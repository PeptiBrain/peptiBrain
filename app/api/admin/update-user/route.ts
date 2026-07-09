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

  const { userId, plan, planStatus, phone } = (await request.json()) as {
    userId?: string;
    plan?: string;
    planStatus?: string;
    phone?: string;
  };

  if (!userId || !plan || !planStatus) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  if (!VALID_PLANS.includes(plan) || !VALID_STATUSES.includes(planStatus)) {
    return NextResponse.json({ error: "invalid_value" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { plan, plan_status: planStatus };
  if (typeof phone === "string") {
    const digits = phone.replace(/\D/g, "");
    // El servidor valida el formato igual que el registro (7-15 dígitos, o vacío).
    if (phone.trim() === "" || (digits.length >= 7 && digits.length <= 15)) {
      updates.phone = phone.trim() || null;
    } else {
      return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
    }
  }

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from("profiles").update(updates).eq("id", userId);

  if (error) {
    return NextResponse.json({ error: "update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
