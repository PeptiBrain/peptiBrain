import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "PeptiBrain <hello@peptibrain.com>",
        to: toEmail,
        subject: `${ownerName} te invitó a compartir progreso en PeptiBrain`,
        text: `Hola${toName ? " " + toName : ""},\n\n${ownerName} te invitó a ver su progreso en PeptiBrain (péptidos, dosis, y lo que decida compartir contigo).\n\nEntra a https://peptibrain.com con este correo (${toEmail}) — si no tienes cuenta, créala con este mismo correo y verás la invitación en tu pestaña Familia.\n\nSi no esperabas este correo, puedes ignorarlo.`,
      }),
    });
    return NextResponse.json({ ok: true, sent: res.ok });
  } catch {
    return NextResponse.json({ ok: true, sent: false, reason: "send_failed" });
  }
}
