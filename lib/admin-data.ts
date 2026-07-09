import { createAdminClient } from "@/lib/supabase/admin";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  plan: "free" | "premium" | "family";
  planStatus: string;
  createdAt: string;
};

export type AdminOverview = {
  totalUsers: number;
  usersByPlan: Record<string, number>;
  newSignups7d: number;
  newSignups30d: number;
  voluntaryChurn30d: number;
  pastDue: number;
  refundedOrChargeback30d: number;
  lastWebhookEventAt: string | null;
  webhookEventsToday: number;
  assistantMessagesToday: number;
  assistantGlobalLimit: number;
  assistantPaused: boolean;
  users: AdminUser[];
};

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export async function loadAdminOverview(): Promise<AdminOverview> {
  const admin = createAdminClient();

  const [
    { data: allProfiles },
    { data: recentHotmartEvents },
    { data: globalUsage },
  ] = await Promise.all([
    admin
      .from("profiles")
      .select("id, name, email, plan, plan_status, created_at, updated_at")
      .order("created_at", { ascending: false }),
    admin
      .from("hotmart_events")
      .select("processed_at")
      .order("processed_at", { ascending: false })
      .limit(50),
    admin
      .from("assistant_global_usage")
      .select("message_count")
      .eq("usage_date", todayIso())
      .maybeSingle(),
  ]);

  const profiles = allProfiles || [];
  const usersByPlan: Record<string, number> = { free: 0, premium: 0, family: 0 };
  for (const p of profiles) usersByPlan[p.plan] = (usersByPlan[p.plan] || 0) + 1;

  const since7d = daysAgoIso(7);
  const since30d = daysAgoIso(30);

  const newSignups7d = profiles.filter((p) => p.created_at >= since7d).length;
  const newSignups30d = profiles.filter((p) => p.created_at >= since30d).length;
  const voluntaryChurn30d = profiles.filter(
    (p) => p.plan_status === "canceled" && p.updated_at >= since30d
  ).length;
  const pastDue = profiles.filter((p) => p.plan_status === "past_due").length;
  const refundedOrChargeback30d = profiles.filter(
    (p) => (p.plan_status === "refunded" || p.plan_status === "chargeback") && p.updated_at >= since30d
  ).length;

  const events = recentHotmartEvents || [];
  const lastWebhookEventAt = events[0]?.processed_at || null;
  const todayStart = `${todayIso()}T00:00:00`;
  const webhookEventsToday = events.filter((e) => e.processed_at >= todayStart).length;

  const ASSISTANT_GLOBAL_LIMIT = Number(process.env.ASSISTANT_GLOBAL_DAILY_LIMIT) || 500;
  const assistantMessagesToday = globalUsage?.message_count || 0;

  return {
    totalUsers: profiles.length,
    usersByPlan,
    newSignups7d,
    newSignups30d,
    voluntaryChurn30d,
    pastDue,
    refundedOrChargeback30d,
    lastWebhookEventAt,
    webhookEventsToday,
    assistantMessagesToday,
    assistantGlobalLimit: ASSISTANT_GLOBAL_LIMIT,
    assistantPaused: assistantMessagesToday >= ASSISTANT_GLOBAL_LIMIT,
    users: profiles.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      plan: p.plan,
      planStatus: p.plan_status,
      createdAt: p.created_at,
    })),
  };
}
