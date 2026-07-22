import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Marca una dosis como aplicada. Lo usa el botón "✓ Hecho" de la notificación push
// (el Service Worker llama aquí con la cookie de sesión), para poder registrar la
// dosis en 1 toque SIN abrir la app. RLS ya garantiza que solo se puede tocar la
// dosis propia; además verificamos el dueño explícitamente por si acaso.
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const doseId = body?.doseId as string | undefined;
  if (!doseId) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("doses")
    .update({ done: true })
    .eq("id", doseId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!updated) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
