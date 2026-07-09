import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TOTAL_SLOTS = Number(process.env.NEXT_PUBLIC_LIFETIME_TOTAL_SLOTS) || 100;

export async function GET() {
  const admin = createAdminClient();
  const { count } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_lifetime", true);

  const claimed = count || 0;
  return NextResponse.json({
    claimed,
    remaining: Math.max(0, TOTAL_SLOTS - claimed),
    total: TOTAL_SLOTS,
  });
}
