import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPush } from "@/lib/push";

export const dynamic = "force-dynamic";

// Corre cada ~10 minutos (ver vercel.json). Busca dosis pendientes que vencen
// dentro de los próximos 10 minutos, sin recordatorio ya enviado, y le manda
// una notificación push al dueño — salvo que tenga un viaje activo hoy
// (Modo viaje: los recordatorios se pausan solos durante un viaje registrado).
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const windowEnd = new Date(now.getTime() + 10 * 60 * 1000);
  const today = now.toISOString().slice(0, 10);

  const { data: doses } = await admin
    .from("doses")
    .select("id, user_id, peptide_id, amount, unit, scheduled_at")
    .eq("done", false)
    .is("reminded_at", null)
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", windowEnd.toISOString());

  if (!doses || doses.length === 0) {
    return NextResponse.json({ sent: 0, skippedTrip: 0 });
  }

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

  let sent = 0;
  let skippedTrip = 0;
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

  return NextResponse.json({ sent, skippedTrip, checked: doses.length });
}
