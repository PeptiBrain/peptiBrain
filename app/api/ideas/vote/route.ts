import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Alterna el voto del usuario sobre una idea (si ya votó, retira el voto; si no,
// vota). El unique(idea_id,user_id) y RLS garantizan 1 voto por persona por idea.
// El trigger de la migración mantiene ideas.vote_count al día en ambos casos.
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const ideaId = typeof body?.ideaId === "string" ? body.ideaId : "";
  if (!ideaId) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("idea_votes")
    .select("id")
    .eq("idea_id", ideaId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("idea_votes").delete().eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, voted: false });
  }

  const { error } = await supabase.from("idea_votes").insert({ idea_id: ideaId, user_id: user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, voted: true });
}
