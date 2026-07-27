import { createAdminClient } from "@/lib/supabase/admin";
import { countryFromPhoneCode } from "@/lib/countries";
import { PEPTIDE_PROFILES } from "@/lib/peptide-profiles";

const CATEGORY_LABELS: Record<string, string> = {
  peso: "Pérdida de peso",
  musculo_gh: "Músculo y GH",
  recuperacion: "Recuperación",
  longevidad: "Longevidad",
  sueno: "Sueño",
  piel_belleza: "Piel y belleza",
  cognicion: "Cognición",
  libido: "Libido",
  intestinal: "Salud digestiva",
  inmunidad: "Inmunidad",
};

function categoryLabelForPeptide(name: string): string {
  const profile = PEPTIDE_PROFILES.find((p) => p.name.toLowerCase() === name.toLowerCase());
  const category = profile?.categories[0];
  return category ? CATEGORY_LABELS[category] || "Otro" : "Personalizado";
}

// Detecta cuentas de prueba/QA (las que creamos desarrollando) para poder separarlas
// de los clientes reales en el panel. Conservador: correos con "test"/"qa"/"prueba"/"demo",
// alias de Gmail con "+", el typo josepoveda.com, o dominios de ejemplo. Un cliente real
// con un alias "+" es raro, pero por eso el panel deja un interruptor para incluirlas.
function isTestAccount(email: string): boolean {
  const e = (email || "").toLowerCase();
  return (
    /\+\d/.test(e) ||
    /(test|qa|prueba|demo)/.test(e) ||
    e.includes("example.com") ||
    e.includes("josepoveda.com@")
  );
}

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
  isTest: boolean;
};

export type ActivityStat = { label: string; value: number; pct?: number };

export type FunnelStep = {
  label: string;
  /** Personas distintas que llegaron a este paso. */
  users: number;
  /** % sobre el total de registrados. */
  pct: number;
  /** Personas perdidas entre el paso anterior y este. */
  dropFromPrev: number;
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
  /** Ventas atribuidas a cada afiliado (según lo que manda Hotmart en el
   *  webhook). La cuenta oficial de comisiones sigue siendo la de Hotmart. */
  affiliateSales: { name: string; sales: number; reversed: number; netSales: number; lastSaleAt: string | null }[];
  /** Motivos de cancelación de los últimos 30 días (encuesta de un clic al cancelar). */
  cancellationReasons: { reason: string; count: number }[];
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
  /** Embudo de activación calculado desde las tablas reales (no desde eventos). */
  activationFunnel: FunnelStep[];
  /** El paso con mayor caída respecto al anterior — dónde arreglar primero. */
  funnelBottleneck: FunnelStep | null;
  aiCostEstimate: number;
  /** Costo real de IA de HOY (USD), sumado de ai_calls. */
  aiCostToday: number;
  /** Llamadas al modelo hechas hoy. */
  aiCallsToday: number;
  /** Tokens consumidos en 30 días (volumen de uso, aunque el costo sea 0). */
  aiTokens30d: number;
  /** false = todavía no hay ninguna llamada registrada → mostrar "no medido"
   *  en vez de dar a entender que el gasto es 0 porque se midió. */
  aiCostMeasured: boolean;
  netProfitEstimate: number;
  marginPct: number | null;
  // Series para gráficos
  signupsByDay: { date: string; label: string; count: number }[];
  planDistribution: { label: string; value: number; color: string }[];
  // Salud técnica
  recentErrors: { id: string; message: string; context: string; createdAt: string }[];
  errorsByMessage30d: { message: string; count: number }[];
  errorsToday: number;
  topPeptides: { name: string; category: string; userCount: number }[];
  // Cuentas de prueba vs reales
  testAccounts: number;
  realAccounts: number;
  // Actividad / engagement (todo dato real)
  activeToday: number;
  activeThisWeek: number;
  activeThisMonth: number;
  totalDoses: number;
  dosesApplied: number;
  adherencePct: number | null;
  totalPeptides: number;
  totalVials: number;
  moneyTrackedByUsers: number;
  sideEffectsReported: number;
  sideEffectsList: { effect: string; count: number }[];
  featureAdoption: ActivityStat[];
  topRoutes: { route: string; count: number }[];
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
    { data: allPeptides },
    { data: allVials },
    { data: allHealthLogs },
    { data: allMeals },
    { data: assistantUsers },
    { data: cancellationFeedback },
  ] = await Promise.all([
    admin
      .from("profiles")
      .select(
        "id, name, email, plan, plan_status, created_at, updated_at, is_lifetime, utm_source, phone, phone_code, platform, onboarding_completed_at"
      )
      .order("created_at", { ascending: false }),
    admin
      .from("hotmart_events")
      // El payload entero ya se guardaba; ahora además se LEE, para saber qué
      // ventas ha traído cada afiliado (Hotmart lo manda en data.affiliates).
      .select("processed_at, event_type, payload")
      .order("processed_at", { ascending: false })
      .limit(500),
    admin
      .from("assistant_global_usage")
      .select("message_count")
      .eq("usage_date", todayIso())
      .maybeSingle(),
    admin.from("doses").select("user_id, created_at, done, injection_site"),
    admin
      .from("error_log")
      .select("id, message, context, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    admin.from("peptides").select("user_id, name, route"),
    admin.from("vials").select("user_id, cost, created_at"),
    admin.from("health_logs").select("user_id, log_date, side_effect"),
    admin.from("meals").select("user_id, created_at"),
    admin.from("assistant_usage").select("user_id"),
    admin
      .from("cancellation_feedback")
      .select("reason, created_at")
      .gte("created_at", daysAgoIso(30)),
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

  // ── Ventas por afiliado ────────────────────────────────────────────────────
  // Hotmart lleva la cuenta oficial de comisiones; esto NO la sustituye. Sirve
  // para ver desde la app quién está trayendo ventas de verdad y quién solo
  // figura, sin tener que entrar al panel de Hotmart.
  //
  // Se cuentan solo las compras APROBADAS/COMPLETADAS y se descuentan las que
  // acabaron en reembolso o contracargo: pagar comisión por una venta devuelta
  // es el error clásico de los programas de afiliados.
  const APPROVED = new Set(["PURCHASE_APPROVED", "PURCHASE_COMPLETE"]);
  const REVERSED = new Set(["PURCHASE_REFUNDED", "PURCHASE_CHARGEBACK", "PURCHASE_PROTEST"]);
  const affiliateTally = new Map<string, { sales: number; reversed: number; lastSaleAt: string | null }>();

  for (const e of events) {
    const payload = e.payload as { data?: { affiliates?: { name?: string; affiliate_code?: string }[] } } | null;
    const affiliate = payload?.data?.affiliates?.[0];
    // Sin afiliado = venta directa tuya, no entra en este recuento.
    const code = affiliate?.affiliate_code?.trim();
    if (!code) continue;
    const label = affiliate?.name?.trim() || code;
    const entry = affiliateTally.get(label) || { sales: 0, reversed: 0, lastSaleAt: null };
    if (APPROVED.has(e.event_type)) {
      entry.sales++;
      if (!entry.lastSaleAt || e.processed_at > entry.lastSaleAt) entry.lastSaleAt = e.processed_at;
    } else if (REVERSED.has(e.event_type)) {
      entry.reversed++;
    }
    affiliateTally.set(label, entry);
  }

  const affiliateSales = Array.from(affiliateTally.entries())
    .map(([name, v]) => ({ name, ...v, netSales: Math.max(0, v.sales - v.reversed) }))
    .sort((a, b) => b.netSales - a.netSales);

  // ── Motivos de cancelación (últimos 30 días) ────────────────────────────────
  const reasonTally = new Map<string, number>();
  for (const f of cancellationFeedback || []) {
    reasonTally.set(f.reason, (reasonTally.get(f.reason) || 0) + 1);
  }
  const cancellationReasons = Array.from(reasonTally.entries())
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);

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
  // Costo de IA: ya NO es un 0 escrito a mano. Se suma el costo real de cada
  // llamada registrada en `ai_calls` (migración 0044). Con el modelo gratuito
  // de hoy dará 0, que es la verdad; el día que se cambie a uno de pago, el
  // gasto aparece aquí solo, sin esperar a la factura.
  // Si la migración aún no se corrió, la query falla suave y se asume 0.
  const { data: aiCalls } = await admin
    .from("ai_calls")
    .select("cost_usd, input_tokens, output_tokens, feature, created_at")
    .gte("created_at", since30d);

  const aiCallRows = aiCalls || [];
  const aiCostEstimate = aiCallRows.reduce((sum, c) => sum + Number(c.cost_usd || 0), 0);
  const aiCallsToday = aiCallRows.filter((c) => c.created_at >= todayIso()).length;
  const aiCostToday = aiCallRows
    .filter((c) => c.created_at >= todayIso())
    .reduce((sum, c) => sum + Number(c.cost_usd || 0), 0);
  const aiTokens30d = aiCallRows.reduce(
    (sum, c) => sum + Number(c.input_tokens || 0) + Number(c.output_tokens || 0),
    0
  );
  const aiCostMeasured = aiCallRows.length > 0;

  const HOTMART_FEE_PCT = 0.1;
  const hotmartFeeEstimate = estMrr * HOTMART_FEE_PCT;
  const netProfitEstimate = estMrr - hotmartFeeEstimate - aiCostEstimate;
  const marginPct = estMrr > 0 ? Math.round((netProfitEstimate / estMrr) * 100) : null;

  // --- Activación: de los que se registraron en 30 días, cuántos completaron el onboarding ---
  const signups30d = profiles.filter((p) => p.created_at >= since30d);
  const activated30d = signups30d.filter((p) => p.onboarding_completed_at).length;
  const activationPct = signups30d.length > 0 ? Math.round((activated30d / signups30d.length) * 100) : 0;

  // --- Funnel de activación: de registrarse a volverse usuario habitual ---
  // Se calcula desde las tablas que YA existen (profiles/peptides/vials/doses),
  // no desde una tabla de eventos nueva. Dos ventajas grandes: funciona con el
  // historial completo desde el día 1 (una tabla de eventos empezaría vacía y
  // no diría nada hasta dentro de semanas) y no añade una escritura extra en
  // cada acción del usuario. Mide HECHOS ("tiene un péptido"), no clics.
  const uniqueUsers = (rows: { user_id?: string | null }[]) =>
    new Set(rows.filter((r) => r.user_id).map((r) => r.user_id as string)).size;

  const peptidesRows = allPeptides || [];
  const vialsRows = allVials || [];
  const dosesRows = doseActivity || [];
  const funnelHealthRows = allHealthLogs || [];
  const totalSignups = profiles.length;

  const funnelRaw: { label: string; users: number }[] = [
    { label: "Se registran", users: totalSignups },
    {
      label: "Completan el onboarding",
      users: profiles.filter((p) => p.onboarding_completed_at).length,
    },
    { label: "Añaden su primer péptido", users: uniqueUsers(peptidesRows) },
    { label: "Registran un vial", users: uniqueUsers(vialsRows) },
    { label: "Programan una dosis", users: uniqueUsers(dosesRows) },
    { label: "Marcan una dosis como aplicada", users: uniqueUsers(dosesRows.filter((d) => d.done)) },
    { label: "Anotan peso o salud", users: uniqueUsers(funnelHealthRows) },
    { label: "Pagan", users: profiles.filter((p) => p.plan !== "free").length },
  ];

  const activationFunnel: FunnelStep[] = funnelRaw.map((step, i) => {
    const prev = i === 0 ? step.users : funnelRaw[i - 1].users;
    return {
      label: step.label,
      users: step.users,
      pct: totalSignups > 0 ? Math.round((step.users / totalSignups) * 100) : 0,
      // Cuánta gente se pierde ENTRE este paso y el anterior: es lo que dice
      // dónde está el agujero, no el porcentaje absoluto.
      dropFromPrev: i === 0 ? 0 : prev - step.users,
    };
  });

  // El paso con la mayor caída respecto al anterior — el que hay que arreglar
  // primero. Se ignora el último ("Pagan"), que cae por precio, no por UX.
  const funnelBottleneck =
    activationFunnel.slice(1, -1).reduce<FunnelStep | null>(
      (worst, s) => (!worst || s.dropFromPrev > worst.dropFromPrev ? s : worst),
      null
    ) || null;

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

  // --- Péptidos más usados: por cuántos usuarios distintos, con su categoría ---
  const peptideMap = new Map<string, { displayName: string; users: Set<string> }>();
  for (const p of allPeptides || []) {
    if (!p.name || !p.user_id) continue;
    const key = p.name.trim().toLowerCase();
    const entry = peptideMap.get(key) || { displayName: p.name.trim(), users: new Set<string>() };
    entry.users.add(p.user_id);
    peptideMap.set(key, entry);
  }
  const topPeptides = [...peptideMap.values()]
    .map((v) => ({
      name: v.displayName,
      category: categoryLabelForPeptide(v.displayName),
      userCount: v.users.size,
    }))
    .sort((a, b) => b.userCount - a.userCount)
    .slice(0, 10);

  // --- Cuentas de prueba vs reales ---
  const testAccounts = profiles.filter((p) => isTestAccount(p.email)).length;
  const realAccounts = profiles.length - testAccounts;

  // --- Actividad / engagement (todo dato real) ---
  const doseRows = doseActivity || [];
  const vialRows = allVials || [];
  const healthRows = allHealthLogs || [];
  const mealRows = allMeals || [];

  // Un usuario está "activo" en un periodo si registró CUALQUIER cosa (dosis, vial,
  // salud, comida) dentro de él. Salud usa log_date (solo fecha); el resto, created_at.
  function activeSince(cutoffIso: string): number {
    const cutoffDay = cutoffIso.slice(0, 10);
    const active = new Set<string>();
    for (const d of doseRows) if (d.user_id && d.created_at >= cutoffIso) active.add(d.user_id);
    for (const v of vialRows) if (v.user_id && v.created_at >= cutoffIso) active.add(v.user_id);
    for (const m of mealRows) if (m.user_id && m.created_at >= cutoffIso) active.add(m.user_id);
    for (const h of healthRows) if (h.user_id && h.log_date >= cutoffDay) active.add(h.user_id);
    return active.size;
  }
  const activeToday = activeSince(`${todayIso()}T00:00:00.000Z`);
  const activeThisWeek = activeSince(since7d);
  const activeThisMonth = activeSince(since30d);

  const totalDoses = doseRows.length;
  const dosesApplied = doseRows.filter((d) => d.done).length;
  const adherencePct = totalDoses > 0 ? Math.round((dosesApplied / totalDoses) * 100) : null;
  const totalPeptides = (allPeptides || []).length;
  const totalVials = vialRows.length;
  const moneyTrackedByUsers = vialRows.reduce(
    (sum, v) => sum + (v.cost != null ? Number(v.cost) || 0 : 0),
    0
  );

  // Efectos secundarios reportados (señal de seguridad, clave en una app de péptidos).
  const effectMap = new Map<string, number>();
  let sideEffectsReported = 0;
  for (const h of healthRows) {
    const eff = (h.side_effect && String(h.side_effect).trim()) || "";
    if (!eff) continue;
    sideEffectsReported++;
    const key = eff.toLowerCase();
    effectMap.set(key, (effectMap.get(key) || 0) + 1);
  }
  const sideEffectsList = [...effectMap.entries()]
    .map(([effect, count]) => ({ effect, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Adopción por función: cuántos usuarios distintos usaron cada una.
  const usersWithPeptides = new Set((allPeptides || []).map((p) => p.user_id).filter(Boolean));
  const usersWithHealth = new Set(healthRows.map((h) => h.user_id).filter(Boolean));
  const usersWithFamily = new Set(profiles.filter((p) => p.plan === "family").map((p) => p.id));
  const usersWithAssistant = new Set((assistantUsers || []).map((a) => a.user_id).filter(Boolean));
  const totalForPct = profiles.length || 1;
  const featureAdoption: ActivityStat[] = [
    { label: "Registran péptidos", value: usersWithPeptides.size, pct: Math.round((usersWithPeptides.size / totalForPct) * 100) },
    { label: "Usan Salud", value: usersWithHealth.size, pct: Math.round((usersWithHealth.size / totalForPct) * 100) },
    { label: "Comparten en Familia", value: usersWithFamily.size, pct: Math.round((usersWithFamily.size / totalForPct) * 100) },
    { label: "Usan el Asistente IA", value: usersWithAssistant.size, pct: Math.round((usersWithAssistant.size / totalForPct) * 100) },
  ];

  // Vías de administración más usadas.
  const routeMap = new Map<string, number>();
  for (const p of allPeptides || []) {
    const r = (p.route && String(p.route).trim()) || "Sin especificar";
    routeMap.set(r, (routeMap.get(r) || 0) + 1);
  }
  const topRoutes = [...routeMap.entries()]
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count);

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
    affiliateSales,
    cancellationReasons,
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
        isTest: isTestAccount(p.email),
      };
    }),
    involuntaryChurn30d,
    activationPct,
    retentionD1,
    retentionD7,
    retentionD30,
    hotmartFeeEstimate,
    activationFunnel,
    funnelBottleneck,
    aiCostEstimate,
    aiCostToday,
    aiCallsToday,
    aiTokens30d,
    aiCostMeasured,
    netProfitEstimate,
    marginPct,
    signupsByDay,
    planDistribution,
    recentErrors,
    errorsByMessage30d,
    errorsToday,
    topPeptides,
    testAccounts,
    realAccounts,
    activeToday,
    activeThisWeek,
    activeThisMonth,
    totalDoses,
    dosesApplied,
    adherencePct,
    totalPeptides,
    totalVials,
    moneyTrackedByUsers,
    sideEffectsReported,
    sideEffectsList,
    featureAdoption,
    topRoutes,
  };
}
