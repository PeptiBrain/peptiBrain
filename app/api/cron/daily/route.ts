import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPush } from "@/lib/push";
import { emailShell, emailButton, escapeHtml } from "@/lib/email-template";

export const dynamic = "force-dynamic";

// Tareas de retención que corren 1 vez al día (las llama el cron gratis de Vercel
// vía vercel.json, protegidas por CRON_SECRET):
//   - "Se te acaba el vial": avisa cuando a un vial le quedan ~3 dosis o menos.
//   - Re-enganche: a quien lleva 3+ días sin registrar nada, un empujón suave.
// Ambas guardadas por un timestamp para no repetir el aviso cada día.

const LOW_STOCK_THRESHOLD = 3; // dosis restantes estimadas
const WINBACK_INACTIVE_DAYS = 3;
const WINBACK_COOLDOWN_DAYS = 7;

function toMg(amount: string | number | null, unit: string): number {
  const n = typeof amount === "number" ? amount : parseFloat(amount || "");
  if (!Number.isFinite(n)) return 0;
  if (unit === "mcg") return n / 1000;
  if (unit === "mg") return n;
  return 0;
}

type PushSub = { user_id: string; endpoint: string; p256dh: string; auth: string };

function subsByUserMap(subs: PushSub[]): Map<string, { endpoint: string; p256dh: string; auth: string }[]> {
  const map = new Map<string, { endpoint: string; p256dh: string; auth: string }[]>();
  for (const s of subs) {
    const list = map.get(s.user_id) || [];
    list.push({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth });
    map.set(s.user_id, list);
  }
  return map;
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const nowIso = now.toISOString();

  const [{ data: profiles }, { data: doses }, { data: vials }, { data: peptides }, { data: healthLogs }, { data: subs }] =
    await Promise.all([
      admin.from("profiles").select("id, email, name, reminders_enabled, winback_sent_at"),
      admin.from("doses").select("id, user_id, peptide_id, amount, unit, scheduled_at, created_at, done"),
      admin.from("vials").select("id, user_id, peptide_id, amount, unit, created_at, low_stock_notified_at"),
      admin.from("peptides").select("id, name"),
      admin.from("health_logs").select("user_id, log_date"),
      admin.from("push_subscriptions").select("user_id, endpoint, p256dh, auth"),
    ]);

  const peptideName = new Map((peptides || []).map((p) => [p.id, p.name]));
  const remindersOn = new Set((profiles || []).filter((p) => p.reminders_enabled).map((p) => p.id));
  const subsMap = subsByUserMap((subs || []) as PushSub[]);
  const doneDoses = (doses || []).filter((d) => d.done);

  // ---------- 1) "Se te acaba el vial" ----------
  let lowStockNotified = 0;
  for (const v of vials || []) {
    if (v.low_stock_notified_at) continue; // ya avisado
    if (v.unit !== "mg" && v.unit !== "mcg") continue; // solo estimable en peso
    const totalMg = toMg(v.amount, v.unit);
    if (totalMg <= 0) continue;

    const openedAt = new Date(v.created_at).getTime();
    const relevant = doneDoses.filter(
      (d) => d.user_id === v.user_id && d.peptide_id === v.peptide_id && new Date(d.scheduled_at).getTime() >= openedAt
    );
    if (relevant.length < 2) continue; // sin datos suficientes para estimar

    const usedMg = relevant.reduce((sum, d) => sum + toMg(d.amount, d.unit), 0);
    const remainingMg = Math.max(0, totalMg - usedMg);
    const avgDoseMg = usedMg / relevant.length;
    if (avgDoseMg <= 0) continue;
    const dosesLeft = Math.floor(remainingMg / avgDoseMg);
    if (dosesLeft > LOW_STOCK_THRESHOLD) continue;

    const name = peptideName.get(v.peptide_id) || "tu péptido";
    const body =
      dosesLeft <= 0
        ? `${name}: se te acabó. Prepara el siguiente.`
        : `${name}: te quedan ~${dosesLeft} dosis. Pide más pronto para no quedarte sin.`;

    await admin.from("notifications").insert({
      user_id: v.user_id,
      type: "low_stock",
      title: "Se te acaba un vial",
      body,
      link: "/app/peptidos",
    });

    if (remindersOn.has(v.user_id)) {
      for (const sub of subsMap.get(v.user_id) || []) {
        const res = await sendPush(sub, { title: "Se te acaba un vial", body, url: "/app/peptidos" });
        if (res.expired) await admin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      }
    }
    await admin.from("vials").update({ low_stock_notified_at: nowIso }).eq("id", v.id);
    lowStockNotified++;
  }

  // ---------- 2) Re-enganche de inactivos ----------
  // Última actividad = la dosis/registro de salud más reciente por usuario.
  const lastActivity = new Map<string, number>();
  function bump(userId: string, iso: string) {
    const t = new Date(iso).getTime();
    if (!lastActivity.has(userId) || t > lastActivity.get(userId)!) lastActivity.set(userId, t);
  }
  for (const d of doses || []) if (d.user_id && d.created_at) bump(d.user_id, d.created_at);
  for (const h of healthLogs || []) if (h.user_id && h.log_date) bump(h.user_id, `${h.log_date}T12:00:00Z`);

  const inactiveCutoff = now.getTime() - WINBACK_INACTIVE_DAYS * 86400000;
  const cooldownCutoff = now.getTime() - WINBACK_COOLDOWN_DAYS * 86400000;
  const resendKey = process.env.RESEND_API_KEY;
  let winbackSent = 0;

  for (const p of profiles || []) {
    const last = lastActivity.get(p.id);
    if (last == null) continue; // nunca hizo nada → es tema de onboarding, no de re-enganche
    if (last >= inactiveCutoff) continue; // sigue activo
    if (p.winback_sent_at && new Date(p.winback_sent_at).getTime() >= cooldownCutoff) continue; // ya se le avisó hace poco

    const daysAway = Math.floor((now.getTime() - last) / 86400000);
    const body = `Llevas ${daysAway} días sin registrar. Un minuto y sigues al día con tu protocolo.`;

    await admin.from("notifications").insert({
      user_id: p.id,
      type: "winback",
      title: "¿Cómo va tu protocolo?",
      body,
      link: "/app",
    });

    if (remindersOn.has(p.id)) {
      for (const sub of subsMap.get(p.id) || []) {
        const res = await sendPush(sub, { title: "¿Cómo va tu protocolo?", body, url: "/app" });
        if (res.expired) await admin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      }
    }

    if (resendKey && p.email) {
      const html = emailShell(`
        <p style="margin:0 0 16px 0;">Hola${p.name ? " " + escapeHtml(p.name) : ""},</p>
        <p style="margin:0 0 8px 0;">Hace ${daysAway} días que no registras nada en PeptiBrain. Tu protocolo funciona cuando no pierdes el hilo — y ponerte al día es cosa de un minuto.</p>
        ${emailButton("https://peptibrain.com/app", "Ponerme al día")}
        <p style="margin:16px 0 0 0;color:#5B6478;font-size:13px;">Si ya no lo usas, puedes ignorar este correo.</p>
      `);
      const text = `Hola${p.name ? " " + p.name : ""},\n\nHace ${daysAway} días que no registras nada en PeptiBrain. Ponerte al día es cosa de un minuto: https://peptibrain.com/app\n\nSi ya no lo usas, puedes ignorar este correo.`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "PeptiBrain <hello@peptibrain.com>",
          to: p.email,
          subject: "¿Cómo va tu protocolo?",
          html,
          text,
        }),
      }).catch(() => {});
    }

    await admin.from("profiles").update({ winback_sent_at: nowIso }).eq("id", p.id);
    winbackSent++;
  }

  return NextResponse.json({ ok: true, lowStockNotified, winbackSent });
}
