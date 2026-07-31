import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPush } from "@/lib/push";
import { computeUsualTime, isHabitual, isWithinReminderWindow } from "@/lib/usual-dose-time";

export const dynamic = "force-dynamic";

// Pensado para llamarse cada ~15 minutos (por un cron externo gratis como
// cron-job.org, ya que el cron propio de Vercel gratis solo corre 1x/día).
// Ventana: dosis pendientes que vencen entre hace 5 min y dentro de 15 min, sin
// recordatorio ya enviado. La ventana (20 min) es mayor que el intervalo de
// llamada (15 min) para que ninguna dosis caiga en un hueco entre dos llamadas;
// `reminded_at` garantiza que cada dosis se avise UNA sola vez aunque dos
// llamadas se solapen. El aviso llega como muy pronto ~15 min antes de la hora.
// Se salta a quien tenga un viaje activo hoy (Modo viaje).
//
// Además dispara sendUsualTimeNudges() (ver abajo): el recordatorio de arriba
// solo funciona si el usuario AGENDÓ una dosis a futuro. Para quien registra
// sin agendar, se infiere su hora habitual del historial y se le avisa si ya
// pasó sin registrar nada hoy — máximo un aviso de este tipo por usuario/día.
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const windowStart = new Date(now.getTime() - 5 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 15 * 60 * 1000);
  const today = now.toISOString().slice(0, 10);

  const { data: doses } = await admin
    .from("doses")
    .select("id, user_id, peptide_id, amount, unit, scheduled_at")
    .eq("done", false)
    .is("reminded_at", null)
    .gte("scheduled_at", windowStart.toISOString())
    .lte("scheduled_at", windowEnd.toISOString());

  let sent = 0;
  let skippedTrip = 0;

  if (doses && doses.length > 0) {
    const userIds = [...new Set(doses.map((d) => d.user_id))];

    const [{ data: profiles }, { data: subs }, { data: trips }, { data: peptides }] = await Promise.all([
      admin.from("profiles").select("id, reminders_enabled").in("id", userIds),
      admin.from("push_subscriptions").select("user_id, endpoint, p256dh, auth").in("user_id", userIds),
      admin.from("trips").select("user_id, start_date, end_date").in("user_id", userIds),
      admin.from("peptides").select("id, name").in(
        "id",
        doses.map((d) => d.peptide_id)
      ),
    ]);

    const enabledUsers = new Set((profiles || []).filter((p) => p.reminders_enabled).map((p) => p.id));
    const tripActiveToday = new Set(
      (trips || []).filter((t) => t.start_date <= today && t.end_date >= today).map((t) => t.user_id)
    );
    const peptideName = new Map((peptides || []).map((p) => [p.id, p.name]));
    const subsByUser = new Map<string, { endpoint: string; p256dh: string; auth: string }[]>();
    for (const s of subs || []) {
      const list = subsByUser.get(s.user_id) || [];
      list.push({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth });
      subsByUser.set(s.user_id, list);
    }

    const remindedIds: string[] = [];

    for (const dose of doses) {
      remindedIds.push(dose.id);
      if (!enabledUsers.has(dose.user_id)) continue;
      if (tripActiveToday.has(dose.user_id)) {
        skippedTrip++;
        continue;
      }
      const name = peptideName.get(dose.peptide_id) || "tu péptido";

      await admin.from("notifications").insert({
        user_id: dose.user_id,
        type: "dose_due",
        title: "Es hora de tu dosis",
        body: `${name} · ${dose.amount} ${dose.unit}`,
        link: "/app",
      });

      const userSubs = subsByUser.get(dose.user_id) || [];
      if (userSubs.length === 0) continue;

      for (const sub of userSubs) {
        const result = await sendPush(sub, {
          title: "Es hora de tu dosis",
          body: `${name} · ${dose.amount} ${dose.unit}`,
          url: "/app",
          doseId: dose.id,
        });
        if (result.expired) {
          await admin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
        } else if (result.ok) {
          sent++;
        }
      }
    }

    if (remindedIds.length > 0) {
      await admin.from("doses").update({ reminded_at: now.toISOString() }).in("id", remindedIds);
    }
  }

  const usualTimeSent = await sendUsualTimeNudges(admin, now, today);

  return NextResponse.json({ sent, skippedTrip, checked: doses?.length || 0, usualTimeSent });
}

// ---------- Recordatorio de "hora habitual" (patrón de retención) ----------
// Además del recordatorio de arriba (que solo dispara si HAY una dosis
// programada a futuro), este avisa a quien registra sus dosis sin agendarlas
// de antemano: si, según su historial, suele aplicarse un péptido a cierta
// hora y ya pasó esa hora sin que registrara nada hoy, le llega un aviso
// suave — como mucho UNO por usuario por día, para no ser invasivo.
async function sendUsualTimeNudges(
  admin: ReturnType<typeof createAdminClient>,
  now: Date,
  today: string
): Promise<number> {
  const nowMinutesOfDay = now.getUTCHours() * 60 + now.getUTCMinutes();
  const todayStart = `${today}T00:00:00.000Z`;

  const { data: doneDoses } = await admin
    .from("doses")
    .select("user_id, peptide_id, scheduled_at")
    .eq("done", true)
    .order("scheduled_at", { ascending: false });

  if (!doneDoses || doneDoses.length === 0) return 0;

  // Agrupa por usuario+péptido, separando lo de hoy (para saber si ya
  // registró) del historial previo (para calcular la hora habitual).
  const historyByKey = new Map<string, string[]>();
  const loggedTodayByKey = new Set<string>();
  for (const d of doneDoses) {
    const key = `${d.user_id}::${d.peptide_id}`;
    if (d.scheduled_at >= todayStart) {
      loggedTodayByKey.add(key);
      continue;
    }
    const list = historyByKey.get(key) || [];
    if (list.length < 30) list.push(d.scheduled_at); // cap: suficiente para el patrón, sin cargar todo el historial
    historyByKey.set(key, list);
  }

  const userIds = [...new Set(doneDoses.map((d) => d.user_id))];
  const [{ data: profiles }, { data: subs }, { data: trips }, { data: peptides }, { data: notifiedToday }] =
    await Promise.all([
      admin.from("profiles").select("id, reminders_enabled").in("id", userIds),
      admin.from("push_subscriptions").select("user_id, endpoint, p256dh, auth").in("user_id", userIds),
      admin.from("trips").select("user_id, start_date, end_date").in("user_id", userIds),
      admin.from("peptides").select("id, name").in("id", [...new Set(doneDoses.map((d) => d.peptide_id))]),
      admin.from("notifications").select("user_id").eq("type", "usual_time_nudge").gte("created_at", todayStart),
    ]);

  const enabledUsers = new Set((profiles || []).filter((p) => p.reminders_enabled).map((p) => p.id));
  const tripActiveToday = new Set(
    (trips || []).filter((t) => t.start_date <= today && t.end_date >= today).map((t) => t.user_id)
  );
  const alreadyNudgedToday = new Set((notifiedToday || []).map((n) => n.user_id));
  const peptideName = new Map((peptides || []).map((p) => [p.id, p.name]));
  const subsByUser = new Map<string, { endpoint: string; p256dh: string; auth: string }[]>();
  for (const s of subs || []) {
    const list = subsByUser.get(s.user_id) || [];
    list.push({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth });
    subsByUser.set(s.user_id, list);
  }

  let sent = 0;
  const nudgedUsers = new Set<string>();

  for (const [key, timestamps] of historyByKey) {
    const [userId, peptideId] = key.split("::");
    if (nudgedUsers.has(userId)) continue; // ya se le mandó un aviso este ciclo
    if (!enabledUsers.has(userId)) continue;
    if (alreadyNudgedToday.has(userId)) continue;
    if (tripActiveToday.has(userId)) continue;
    if (loggedTodayByKey.has(key)) continue; // ya registró este péptido hoy

    const usual = computeUsualTime(timestamps);
    if (!isHabitual(usual)) continue;
    if (!isWithinReminderWindow(nowMinutesOfDay, usual.minutesOfDay)) continue;

    const userSubs = subsByUser.get(userId) || [];
    if (userSubs.length === 0) continue;

    const name = peptideName.get(peptideId) || "tu péptido";
    const title = "¿Ya te aplicaste tu dosis hoy?";
    const body = `Sueles registrar ${name} sobre esta hora — no vimos nada hoy todavía.`;

    await admin.from("notifications").insert({ user_id: userId, type: "usual_time_nudge", title, body, link: "/app" });

    for (const sub of userSubs) {
      const result = await sendPush(sub, { title, body, url: "/app" });
      if (result.expired) {
        await admin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      } else if (result.ok) {
        sent++;
      }
    }
    nudgedUsers.add(userId);
  }

  return sent;
}
