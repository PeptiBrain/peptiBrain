import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emailShell, emailButton, escapeHtml } from "@/lib/email-template";

// Avisa por correo a la persona invitada. Si RESEND_API_KEY no está configurado
// todavía, no rompe nada: la invitación ya quedó guardada, solo no manda el
// correo (igual que el resto de avisos por email de esta app).
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const toEmail = body?.toEmail as string | undefined;
  const toName = (body?.toName as string | undefined) || "";
  const ownerName = (body?.ownerName as string | undefined) || "Alguien";
  if (!toEmail || !toEmail.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ ok: true, sent: false, reason: "resend_not_configured" });
  }

  const html = emailShell(`
    <p style="margin:0 0 16px 0;">Hola${toName ? " " + escapeHtml(toName) : ""},</p>
    <p style="margin:0 0 8px 0;">
      <strong>${escapeHtml(ownerName)}</strong> te invitó a ver su progreso en PeptiBrain
      (péptidos, dosis, y lo que decida compartir contigo).
    </p>
    ${emailButton("https://peptibrain.com", "Ver invitación")}
    <p style="margin:16px 0 0 0;color:#5B6478;font-size:13px;">
      Entra con este correo (${escapeHtml(toEmail)}) — si no tienes cuenta, créala con este
      mismo correo y verás la invitación en tu pestaña Familia.
    </p>
  `);
  const text = `Hola${toName ? " " + toName : ""},\n\n${ownerName} te invitó a ver su progreso en PeptiBrain (péptidos, dosis, y lo que decida compartir contigo).\n\nEntra a https://peptibrain.com con este correo (${toEmail}) — si no tienes cuenta, créala con este mismo correo y verás la invitación en tu pestaña Familia.\n\nSi no esperabas este correo, puedes ignorarlo.`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "PeptiBrain <hello@peptibrain.com>",
        to: toEmail,
        subject: `${ownerName} te invitó a compartir progreso en PeptiBrain`,
        html,
        text,
      }),
    });
    return NextResponse.json({ ok: true, sent: res.ok });
  } catch {
    return NextResponse.json({ ok: true, sent: false, reason: "send_failed" });
  }
}
