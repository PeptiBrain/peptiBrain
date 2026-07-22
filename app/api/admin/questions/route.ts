import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

// Devuelve las últimas preguntas al Asistente IA + totales, solo para el dueño.
// Sirve para ver QUÉ pregunta la audiencia y decidir qué contenido/features crear.
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const supabase = createAdminClient();
  const since7d = new Date(Date.now() - 7 * 86400000).toISOString();

  const [recentRes, totalRes, weekRes] = await Promise.all([
    supabase
      .from("assistant_questions")
      .select("id, question, plan, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("assistant_questions").select("id", { count: "exact", head: true }),
    supabase.from("assistant_questions").select("id", { count: "exact", head: true }).gte("created_at", since7d),
  ]);

  return NextResponse.json({
    recent: recentRes.data || [],
    total: totalRes.count || 0,
    week: weekRes.count || 0,
  });
}
