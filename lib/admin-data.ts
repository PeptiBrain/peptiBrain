import { createAdminClient } from "@/lib/supabase/admin";
import { countryFromPhoneCode } from "@/lib/countries";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  plan: "free" | "premium" | "family";
  planStatus: string;
  createdAt: string;
  phone: string;
  phoneCode: string;
  country: string;
  countryFlag: string;
  platform: string;
  source: string;
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
  // Finanzas (estimadas a partir de los planes activos)
  premiumActive: number;
  familyActive: number;
  lifetimeUsers: number;
  lifetimeTotal: number;
  payingCustomers: number;
  estMrr: number; // ingreso recurrente mensual estimado
  lifetimeRevenue: number; // ingreso de pagos únicos de por vida
  arpu: number; // ingreso medio por cliente pagador (mensual)
  conversionPct: number; // registrados → pagadores
  currencySymbol: string;
  utmSources: { source: string; count: number }[];
  platforms: { platform: string; count: number }[];
  countries: { country: string; flag: string; count: number }[];
  users: AdminUser[];
};

// Precios mensuales de referencia (deben coincidir con el paywall).
const PRICE_PREMIUM = Number(process.env.NEXT_PUBLIC_PRICE_PREMIUM) || 9;
const PRICE_FAMILY = Number(process.env.NEXT_PUBLIC_PRICE_FAMILY) || 19;
const PRICE_LIFETIME = Number(process.env.NEXT_PUBLIC_LIFETIME_PRICE) || 99;
const LIFETIME_TOTAL = Number(process.env.NEXT_PUBLIC_LIFETIME_TOTAL_SLOTS) || 100;

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
      .select(
        "id, name, email, plan, plan_status, created_at, updated_at, is_lifetime, utm_source, phone, phone_code, platform"
      )
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

  // --- Finanzas estimadas ---
  const isActive = (p: { plan_status: string }) => p.plan_status === "active";
  const premiumActive = profiles.filter(
    (p) => p.plan === "premium" && isActive(p) && !p.is_lifetime
  ).length;
  const familyActive = profiles.filter(
    (p) => p.plan === "family" && isActive(p) && !p.is_lifetime
  ).length;
  const lifetimeUsers = profiles.filter((p) => p.is_lifetime).length;
  const payingCustomers = premiumActive + familyActive + lifetimeUsers;
  const estMrr = premiumActive * PRICE_PREMIUM + familyActive * PRICE_FAMILY;
  const lifetimeRevenue = lifetimeUsers * PRICE_LIFETIME;
  const arpu = premiumActive + familyActive > 0 ? estMrr / (premiumActive + familyActive) : 0;
  const conversionPct = profiles.length > 0 ? Math.round((payingCustomers / profiles.length) * 100) : 0;

  // --- Marketing: origen del tráfico (UTM) ---
  const utmMap = new Map<string, number>();
  for (const p of profiles) {
    const src = (p.utm_source && String(p.utm_source).trim()) || "directo";
    utmMap.set(src, (utmMap.get(src) || 0) + 1);
  }
  const utmSources = [...utmMap.entries()]
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  // --- Dispositivo (iOS / Android / Escritorio) ---
  const platMap = new Map<string, number>();
  for (const p of profiles) {
    const plat = (p.platform && String(p.platform).trim()) || "desconocido";
    platMap.set(plat, (platMap.get(plat) || 0) + 1);
  }
  const platforms = [...platMap.entries()]
    .map(([platform, count]) => ({ platform, count }))
    .sort((a, b) => b.count - a.count);

  // --- País (por código de teléfono) ---
  const countryMap = new Map<string, { flag: string; count: number }>();
  for (const p of profiles) {
    const c = countryFromPhoneCode(p.phone_code);
    const cur = countryMap.get(c.name) || { flag: c.flag, count: 0 };
    countryMap.set(c.name, { flag: c.flag, count: cur.count + 1 });
  }
  const countries = [...countryMap.entries()]
    .map(([country, { flag, count }]) => ({ country, flag, count }))
    .sort((a, b) => b.count - a.count);

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
    premiumActive,
    familyActive,
    lifetimeUsers,
    lifetimeTotal: LIFETIME_TOTAL,
    payingCustomers,
    estMrr,
    lifetimeRevenue,
    arpu,
    conversionPct,
    currencySymbol: "€",
    utmSources,
    platforms,
    countries,
    users: profiles.map((p) => {
      const c = countryFromPhoneCode(p.phone_code);
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        plan: p.plan,
        planStatus: p.plan_status,
        createdAt: p.created_at,
        phone: p.phone || "",
        phoneCode: p.phone_code || "",
        country: c.name,
        countryFlag: c.flag,
        platform: (p.platform && String(p.platform)) || "—",
        source: (p.utm_source && String(p.utm_source)) || "directo",
      };
    }),
  };
}
