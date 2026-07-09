import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const endpoint = body?.endpoint;
  if (typeof endpoint === "string") {
    await supabase.from("push_subscriptions").delete().eq("user_id", user.id).eq("endpoint", endpoint);
  }

  const { count } = await supabase
    .from("push_subscriptions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  if (!count) {
    await supabase.from("profiles").update({ reminders_enabled: false }).eq("id", user.id);
  }

  return NextResponse.json({ ok: true });
}
