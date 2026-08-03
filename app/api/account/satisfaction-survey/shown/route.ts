import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Se llama en cuanto el pop-up se hace visible (responda o no la persona) —
// así "máximo una vez al mes" también aplica a quien lo cierra sin contestar.
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ last_satisfaction_survey_shown_at: new Date().toISOString() })
    .eq("id", user.id);
  if (error) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
