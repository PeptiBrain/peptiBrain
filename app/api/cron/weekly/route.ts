import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPush } from "@/lib/push";
import { emailShell, emailButton, escapeHtml } from "@/lib/email-template";

export const dynamic = "force-dynamic";

// Resumen semanal (domingos). Es la mecánica de retención con mejor retorno del
// sector y aquí sale gratis: los datos ya están, solo hay que devolvérselos al
// usuario en el momento en que decide si sigue o lo deja.
//
// Regla de honestidad: si la semana fue mala, se dice sin dramatizar y sin
// culpar. Un resumen que solo felicita cuando todo va bien y calla cuando no,
// no sirve para decidir nada. Y a quien NO registró nada en toda la semana no
// se le manda (ya lo cubre el re-enganche del cron diario: dos correos de
// "vuelve" en la misma semana es acoso, no retención).

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
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const weekAgoIso = weekAgo.toISOString();
  const weekAgoDate = weekAgoIso.slice(0, 10);

  const [{ data: profiles }, { data: doses }, { data: healthLogs }, { data: subs }] = await Promise.all([
    admin.from("profiles").select("id, email, name, reminders_enabled"),
    admin.from("doses").select("user_id, scheduled_at, done").gte("scheduled_at", weekAgoIso),
    admin.from("health_logs").select("user_id, log_date, weight_kg").gte("log_date", weekAgoDate),
    admin.from("push_subscriptions").select("user_id, endpoint, p256dh, auth"),
  ]);

  const remindersOn = new Set((profiles || []).filter((p) => p.reminders_enabled).map((p) => p.id));
  const subsMap = subsByUserMap((subs || []) as PushSub[]);
  const resendKey = process.env.RESEND_API_KEY;
  const nowMs = now.getTime();

  // Agrupar por usuario una sola vez, en vez de filtrar el array entero por
  // cada perfil (con muchos usuarios eso es cuadrático).
  const dosesByUser = new Map<string, { scheduledAt: number; done: boolean }[]>();
  for (const d of doses || []) {
    const ts = new Date(d.scheduled_at).getTime();
    if (!Number.isFinite(ts)) continue;
    const list = dosesByUser.get(d.user_id) || [];
    list.push({ scheduledAt: ts, done: d.done });
    dosesByUser.set(d.user_id, list);
  }

  const logsByUser = new Map<string, number>();
  for (const h of healthLogs || []) {
    logsByUser.set(h.user_id, (logsByUser.get(h.user_id) || 0) + 1);
  }

  let sent = 0;
  for (const p of profiles || []) {
    const userDoses = dosesByUser.get(p.id) || [];
    const healthCount = logsByUser.get(p.id) || 0;

    // Solo cuentan las dosis que YA vencieron: las de mañana no son un fallo.
    const due = userDoses.filter((d) => d.scheduledAt <= nowMs);
    const done = due.filter((d) => d.done).length;

    // Sin nada que contar no hay resumen que mandar.
    if (due.length === 0 && healthCount === 0) continue;

    const pct = due.length > 0 ? Math.round((done / due.length) * 100) : null;
    const title = "Tu semana en PeptiBrain";
    const summary =
      due.length > 0
        ? `${done} de ${due.length} dosis${pct !== null ? ` (${pct}%)` : ""}${
            healthCount > 0 ? ` · ${healthCount} registros de salud` : ""
          }`
        : `${healthCount} registros de salud esta semana`;

    await admin.from("notifications").insert({
      user_id: p.id,
      type: "weekly_summary",
      title,
      body: summary,
      link: "/app/estadisticas",
    });

    if (remindersOn.has(p.id)) {
      for (const sub of subsMap.get(p.id) || []) {
        const res = await sendPush(sub, { title, body: summary, url: "/app/estadisticas" });
        if (res.expired) await admin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      }
    }

    if (resendKey && p.email) {
      // Ni celebrar una semana floja ni regañar por ella: describir y seguir.
      const closing =
        pct !== null && pct >= 80
          ? "Buena semana. Sigue así."
          : "Una semana floja le pasa a cualquiera: lo que cuenta es la siguiente.";
      const html = emailShell(`
        <p style="margin:0 0 16px 0;">Hola${p.name ? " " + escapeHtml(p.name) : ""},</p>
        <p style="margin:0 0 8px 0;">Esto es lo que registraste estos 7 días:</p>
        <p style="margin:0 0 16px 0;font-size:18px;font-weight:600;">${escapeHtml(summary)}</p>
        <p style="margin:0 0 16px 0;">${closing}</p>
        ${emailButton("https://peptibrain.com/app/estadisticas", "Ver mis estadísticas")}
      `);
      const text = `Hola${p.name ? " " + p.name : ""},\n\nTu semana en PeptiBrain: ${summary}\n\n${closing}\n\nhttps://peptibrain.com/app/estadisticas`;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "PeptiBrain <hello@peptibrain.com>",
          to: p.email,
          subject: title,
          html,
          text,
        }),
      }).catch(() => {});
    }

    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
