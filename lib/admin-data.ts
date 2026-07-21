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
  // Salud del negocio
  involuntaryChurn30d: number;
  activationPct: number; // % de altas (30d) que completaron el onboarding
  retentionD1: number | null;
  retentionD7: number | null;
  retentionD30: number | null;
  // Ganancia real
  hotmartFeeEstimate: number;
  aiCostEstimate: number;
  netProfitEstimate: number;
  marginPct: number | null;
  // Series para gráficos
  signupsByDay: { date: string; label: string; count: number }[];
  planDistribution: { label: string; value: number; color: string }[];
  // Salud técnica
  recentErrors: { id: string; message: string; context: string; createdAt: string }[];
  errorsByMessage30d: { message: string; count: number }[];
  errorsToday: number;
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
    { data: doseActivity },
    { data: recentErrorRows },
  ] = await Promise.all([
    admin
      .from("profiles")
      .select(
        "id, name, email, plan, plan_status, created_at, updated_at, is_lifetime, utm_source, phone, phone_code, platform, onboarding_completed_at"
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
    admin.from("doses").select("user_id, created_at"),
    admin
      .from("error_log")
      .select("id, message, context, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
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

  const involuntaryChurn30d = pastDue + refundedOrChargeback30d;

  // --- Ganancia real: MRR menos lo que de verdad se va en comisiones y costos ---
  // Costo de IA: el modelo configurado (ASSISTANT_AI_MODEL) es gratuito hoy, así que
  // el costo real es 0 — si algún día se cambia a un modelo de pago, esto debe leer
  // el gasto real de una tabla de costos (ver 31-EVALS-OBSERVABILIDAD-OPERACION.md).
  const HOTMART_FEE_PCT = 0.1;
  const hotmartFeeEstimate = estMrr * HOTMART_FEE_PCT;
  const aiCostEstimate = 0;
  const netProfitEstimate = estMrr - hotmartFeeEstimate - aiCostEstimate;
  const marginPct = estMrr > 0 ? Math.round((netProfitEstimate / estMrr) * 100) : null;

  // --- Activación: de los que se registraron en 30 días, cuántos completaron el onboarding ---
  const signups30d = profiles.filter((p) => p.created_at >= since30d);
  const activated30d = signups30d.filter((p) => p.onboarding_completed_at).length;
  const activationPct = signups30d.length > 0 ? Math.round((activated30d / signups30d.length) * 100) : 0;

  // --- Retención D1/D7/D30: ¿volvió a registrar algo después de ese punto? ---
  const doses = doseActivity || [];
  const activityByUser = new Map<string, string[]>();
  for (const d of doses) {
    if (!d.user_id || !d.created_at) continue;
    const list = activityByUser.get(d.user_id) || [];
    list.push(d.created_at);
    activityByUser.set(d.user_id, list);
  }
  function retentionAt(days: number): number | null {
    const cutoff = daysAgoIso(days);
    const eligible = profiles.filter((p) => p.created_at <= cutoff);
    if (eligible.length === 0) return null;
    const thresholdMs = days * 24 * 60 * 60 * 1000 * 0.85; // ~85% del periodo, margen de zona horaria
    let returned = 0;
    for (const p of eligible) {
      const signupMs = new Date(p.created_at).getTime();
      const activity = activityByUser.get(p.id) || [];
      if (activity.some((a) => new Date(a).getTime() - signupMs >= thresholdMs)) returned++;
    }
    return Math.round((returned / eligible.length) * 100);
  }
  const retentionD1 = retentionAt(1);
  const retentionD7 = retentionAt(7);
  const retentionD30 = retentionAt(30);

  // --- Altas por día (últimos 30 días), para el gráfico de barras ---
  const dayBuckets = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayBuckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const p of profiles) {
    const day = p.created_at.slice(0, 10);
    if (dayBuckets.has(day)) dayBuckets.set(day, (dayBuckets.get(day) || 0) + 1);
  }
  const signupsByDay = [...dayBuckets.entries()].map(([date, count]) => ({
    date,
    label: new Date(`${date}T12:00:00`).toLocaleDateString("es", { day: "numeric", month: "short" }),
    count,
  }));

  // --- Distribución de planes (para el donut) ---
  const planDistribution = [
    { label: "Gratis", value: usersByPlan.free || 0, color: "#5B6478" },
    { label: "Premium", value: premiumActive, color: "#22c55e" },
    { label: "Family", value: familyActive, color: "#0ea5e9" },
    { label: "De por vida", value: lifetimeUsers, color: "#8b5cf6" },
  ].filter((s) => s.value > 0);

  // --- Salud técnica: errores recientes ---
  const errorRows = recentErrorRows || [];
  const errorsToday = errorRows.filter((e) => e.created_at >= todayStart).length;
  const errorMsgMap = new Map<string, number>();
  for (const e of errorRows) {
    if (e.created_at < since30d) continue;
    errorMsgMap.set(e.message, (errorMsgMap.get(e.message) || 0) + 1);
  }
  const errorsByMessage30d = [...errorMsgMap.entries()]
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const recentErrors = errorRows.slice(0, 15).map((e) => ({
    id: e.id,
    message: e.message,
    context: e.context,
    createdAt: e.created_at,
  }));

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
    involuntaryChurn30d,
    activationPct,
    retentionD1,
    retentionD7,
    retentionD30,
    hotmartFeeEstimate,
    aiCostEstimate,
    netProfitEstimate,
    marginPct,
    signupsByDay,
    planDistribution,
    recentErrors,
    errorsByMessage30d,
    errorsToday,
  };
}
