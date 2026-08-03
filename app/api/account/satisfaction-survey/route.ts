import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const level = Number(body?.level);
  if (!Number.isInteger(level) || level < 1 || level > 5) {
    return NextResponse.json({ error: "invalid_level" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("satisfaction_responses").insert({
    user_id: user.id,
    level,
  });
  if (error) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
