import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";

// Añade el correo a la Audiencia de Resend (Contacts API). Si no está
// configurado RESEND_API_KEY/RESEND_AUDIENCE_ID todavía, no rompe nada —
// mismo patrón que el resto de integraciones opcionales de esta app
// (ver app/api/family/invite-email/route.ts).
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = (body?.email as string | undefined)?.trim();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!resendKey || !audienceId) {
    return NextResponse.json({ ok: true, subscribed: false, reason: "newsletter_not_configured" });
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false }),
    });
    // Resend devuelve 409 si el contacto ya existe — no es un error para el usuario,
    // ya está suscrito, así que también cuenta como éxito.
    return NextResponse.json({ ok: true, subscribed: res.ok || res.status === 409 });
  } catch {
    return NextResponse.json({ ok: true, subscribed: false, reason: "send_failed" });
  }
}
