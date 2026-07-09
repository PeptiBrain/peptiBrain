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
  const p256dh = body?.keys?.p256dh;
  const auth = body?.keys?.auth;
  if (typeof endpoint !== "string" || typeof p256dh !== "string" || typeof auth !== "string") {
    return NextResponse.json({ error: "invalid_subscription" }, { status: 400 });
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ user_id: user.id, endpoint, p256dh, auth }, { onConflict: "endpoint" });
  if (error) {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }

  await supabase.from("profiles").update({ reminders_enabled: true }).eq("id", user.id);

  return NextResponse.json({ ok: true });
}
