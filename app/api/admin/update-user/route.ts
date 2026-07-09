import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_PLANS = ["free", "premium", "family"];
const VALID_STATUSES = ["active", "past_due", "canceled", "refunded", "chargeback"];

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const { userId, plan, planStatus } = (await request.json()) as {
    userId?: string;
    plan?: string;
    planStatus?: string;
  };

  if (!userId || !plan || !planStatus) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!VALID_PLANS.includes(plan) || !VALID_STATUSES.includes(planStatus)) {
    return NextResponse.json({ error: "invalid_value" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ plan, plan_status: planStatus })
    .eq("id", userId);

  if (error) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
