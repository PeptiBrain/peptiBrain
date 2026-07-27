import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Validado aquí y no en la base (constraint) para poder sumar motivos nuevos
// sin migración — la encuesta es copy, no un cambio de esquema.
const VALID_REASONS = new Set([
  "no_esperaba",
  "plan_gratis_basta",
  "no_entendi",
  "miedo_cobro",
  "muy_caro",
  "no_tiempo",
  "otro",
]);

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const reason = typeof body?.reason === "string" ? body.reason : "";
  if (!VALID_REASONS.has(reason)) {
    return NextResponse.json({ error: "invalid_reason" }, { status: 400 });
  }
  // Nota libre de "otro": tope generoso pero acotado, es feedback no un adjunto.
  const note = typeof body?.note === "string" ? body.note.trim().slice(0, 500) : null;

  const admin = createAdminClient();
  const { error } = await admin.from("cancellation_feedback").insert({
    user_id: user.id,
    reason,
    note: note || null,
  });
  if (error) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
