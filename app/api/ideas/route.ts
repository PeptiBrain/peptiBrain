import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { IDEA_CATEGORIES } from "@/lib/ideas";

// Crea una idea nueva en el tablero. Solo usuarios con sesión (RLS lo exige, y lo
// verificamos aquí para dar un 401 claro). El autor vota automáticamente su propia
// idea (patrón habitual tipo Canny) — así arranca con 1 voto y el trigger la cuenta.
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const category = typeof body?.category === "string" ? body.category : "otra";

  if (title.length < 3 || title.length > 120) {
    return NextResponse.json({ error: "invalid_title" }, { status: 400 });
  }
  if (description.length > 2000) {
    return NextResponse.json({ error: "invalid_description" }, { status: 400 });
  }
  const safeCategory = (IDEA_CATEGORIES as readonly string[]).includes(category) ? category : "otra";

  const { data: idea, error } = await supabase
    .from("ideas")
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      category: safeCategory,
    })
    .select("id, title, description, category, status, vote_count, created_at")
    .single();

  if (error || !idea) {
    return NextResponse.json({ error: error?.message || "insert_failed" }, { status: 500 });
  }

  // El autor vota su propia idea. Si falla el voto no rompemos la creación.
  await supabase.from("idea_votes").insert({ idea_id: idea.id, user_id: user.id });

  return NextResponse.json({ ok: true, idea: { ...idea, vote_count: 1 } });
}
