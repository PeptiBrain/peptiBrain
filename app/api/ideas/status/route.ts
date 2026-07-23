import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { IDEA_STATUSES } from "@/lib/ideas";

// Cambia el estado de una idea. SOLO el dueño (role='admin') — verificado en el
// servidor con requireAdmin (nunca confiar en ocultar el control en el cliente).
// Alimenta el Roadmap (planned / in_progress / done) y "descartada".
export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const ideaId = typeof body?.ideaId === "string" ? body.ideaId : "";
  const status = typeof body?.status === "string" ? body.status : "";

  if (!ideaId || !(IDEA_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("ideas").update({ status }).eq("id", ideaId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
