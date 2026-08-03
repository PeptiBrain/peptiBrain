"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Activity, Bug, Syringe, HeartPulse, Wallet } from "lucide-react";
import type { AdminOverview } from "@/lib/admin-data";
import { UsersTable } from "@/components/app/admin/UsersTable";
import { AnimatedNumber } from "@/components/app/shell/AnimatedNumber";
import { ADMIN, AdminBarChart, AdminDonut, RetentionBars } from "@/components/app/admin/AdminCharts";
import { IntegrationsPanel } from "@/components/app/admin/IntegrationsPanel";
import { HotmartSalesCard } from "@/components/app/admin/HotmartSalesCard";
import { AssistantQuestionsCard } from "@/components/app/admin/AssistantQuestionsCard";

type Tab = "all" | "finance" | "activity" | "users" | "retention" | "health" | "acq" | "satisfaction" | "integrations";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "Todo" },
  { key: "finance", label: "Finanzas" },
  { key: "activity", label: "Actividad" },
  { key: "users", label: "Usuarios" },
  { key: "retention", label: "Retención" },
  { key: "health", label: "Salud" },
  { key: "acq", label: "Adquisición" },
  { key: "satisfaction", label: "Satisfacción" },
  { key: "integrations", label: "Integraciones" },
];

const PLATFORM_COLOR: Record<string, string> = {
  iOS: "#60A5FA",
  Android: ADMIN.positive,
  Escritorio: "#A78BFA",
  desconocido: ADMIN.textMuted,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function AdminDashboard({ data, alerts }: { data: AdminOverview; alerts: string[] }) {
  const [tab, setTab] = useState<Tab>("all");
  const s = data.currencySymbol;
  const lifetimeLeft = Math.max(0, data.lifetimeTotal - data.lifetimeUsers);

  const showFinance = tab === "all" || tab === "finance";
  const showActivity = tab === "all" || tab === "activity";
  const showUsers = tab === "all" || tab === "users";
  const showRetention = tab === "all" || tab === "retention";
  const showHealth = tab === "all" || tab === "health";
  const showAcq = tab === "all" || tab === "acq";
  const showSatisfaction = tab === "all" || tab === "satisfaction";
  const showIntegrations = tab === "all" || tab === "integrations";

  return (
    <div className="min-h-dvh" style={{ background: ADMIN.bg }}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <motion.div {...fadeUp(0)} className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/peptibrain-isotipo.svg" alt="PeptiBrain" className="size-11 shrink-0 rounded-2xl" />
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: ADMIN.text }}>
                PeptiBrain
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm" style={{ color: ADMIN.textMuted }}>
                <span
                  className="inline-block size-2 animate-pulse rounded-full"
                  style={{ background: ADMIN.accent }}
                />
                Panel de control · datos en vivo
              </p>
            </div>
          </div>
        </motion.div>

        {/* Pestañas */}
        <motion.div {...fadeUp(0.05)} className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tt) => (
            <button
              key={tt.key}
              type="button"
              onClick={() => setTab(tt.key)}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors active:scale-97"
              style={
                tab === tt.key
                  ? { background: ADMIN.accent, color: "#04140F" }
                  : { background: ADMIN.surface, color: ADMIN.textMuted, border: `1px solid ${ADMIN.border}` }
              }
            >
              {tt.label}
            </button>
          ))}
        </motion.div>

        {/* Avisos */}
        <motion.div {...fadeUp(0.1)} className="mt-4">
          {alerts.length > 0 ? (
            <ul
              className="space-y-2 rounded-2xl p-4"
              style={{ background: "rgba(251,191,36,0.08)", border: `1px solid rgba(251,191,36,0.25)` }}
            >
              {alerts.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#FDE68A" }}>
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" style={{ color: ADMIN.warning }} aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          ) : (
            <p
              className="flex items-center gap-2 rounded-2xl p-4 text-sm font-medium"
              style={{ background: "rgba(52,211,153,0.08)", border: `1px solid rgba(52,211,153,0.25)`, color: ADMIN.positive }}
            >
              <CheckCircle2 className="size-4" aria-hidden /> Todo en orden hoy.
            </p>
          )}
        </motion.div>

        {/* GANANCIA REAL — el número que más importa */}
        {showFinance && (
          <motion.div {...fadeUp(0.15)} className="mt-6">
            <div
              className="rounded-2xl p-6"
              style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                Ganancia real este mes
              </p>
              <div className="mt-2 flex flex-wrap items-end gap-3">
                <span className="font-display text-4xl font-bold tabular-nums sm:text-5xl" style={{ color: ADMIN.text }}>
                  <AnimatedNumber value={data.netProfitEstimate} prefix={s} decimals={0} />
                </span>
                {data.marginPct != null && (
                  <span
                    className="mb-1 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                      background: data.marginPct >= 0 ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
                      color: data.marginPct >= 0 ? ADMIN.positive : ADMIN.negative,
                    }}
                  >
                    {data.marginPct >= 0 ? (
                      <TrendingUp className="size-3.5" aria-hidden />
                    ) : (
                      <TrendingDown className="size-3.5" aria-hidden />
                    )}
                    {data.marginPct}% de margen
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm" style={{ color: ADMIN.textMuted }}>
                De {s}
                {data.estMrr.toLocaleString()} facturados: −{s}
                {data.hotmartFeeEstimate.toFixed(0)} comisión Hotmart (~10%), −{s}
                {data.aiCostEstimate.toFixed(2)} de IA{" "}
                {data.aiCostMeasured ? (
                  <>
                    (medido de verdad: {data.aiCallsToday} consulta
                    {data.aiCallsToday === 1 ? "" : "s"} hoy,{" "}
                    {data.aiTokens30d.toLocaleString()} tokens en 30 días).
                  </>
                ) : (
                  <>(aún sin consultas registradas — no hay nada que cobrar todavía).</>
                )}
              </p>
            </div>
          </motion.div>
        )}

        {/* FINANZAS */}
        {showFinance && (
          <Section title="Finanzas" note="Estimado a partir de los planes activos. El ingreso real exacto está en Hotmart." delay={0.2}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BolaCard
                label="Ingreso mensual · MRR"
                value={`${s}${data.estMrr.toLocaleString()}`}
                breakdown={[
                  { label: "Premium", value: `${data.premiumActive}`, color: ADMIN.positive },
                  { label: "Family", value: `${data.familyActive}`, color: "#60A5FA" },
                ]}
                accent
              />
              <BolaCard
                label="Ingreso de por vida · Bruto"
                value={`${s}${data.lifetimeRevenue.toLocaleString()}`}
                breakdown={[
                  { label: "Cupos vendidos", value: `${data.lifetimeUsers}/${data.lifetimeTotal}`, color: "#A78BFA" },
                  { label: "Libres", value: `${lifetimeLeft}`, color: ADMIN.textMuted },
                ]}
              />
              <BolaCard label="Clientes pagando" value={`${data.payingCustomers}`} />
              <BolaCard
                label="Conversión · Registro → pago"
                value={`${data.conversionPct}%`}
                breakdown={[{ label: "Ingreso medio/cliente", value: `${s}${data.arpu.toFixed(2)}`, color: ADMIN.positive }]}
              />
            </div>
            <div className="mt-4">
              <HotmartSalesCard />
            </div>
            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                De qué plan es cada cliente
              </p>
              <AdminDonut
                data={data.planDistribution}
                centerLabel="usuarios"
                centerValue={`${data.totalUsers}`}
              />
            </div>
          </Section>
        )}

        {/* ACTIVIDAD DE LA APP */}
        {showActivity && (
          <Section
            title="Actividad de la app"
            note="Qué hacen tus usuarios dentro de la app. Todo dato real, en vivo."
            delay={0.22}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <MiniStat label="Activos hoy" value={data.activeToday} icon={<Activity className="size-3.5" aria-hidden />} />
              <MiniStat label="Activos · 7 días" value={data.activeThisWeek} />
              <MiniStat label="Activos · 30 días" value={data.activeThisMonth} />
              <MiniStat label="Cuentas reales" value={data.realAccounts} sub={`+ ${data.testAccounts} de prueba`} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BolaCard
                label="Dosis registradas"
                value={`${data.totalDoses}`}
                breakdown={[
                  { label: "Aplicadas", value: `${data.dosesApplied}`, color: ADMIN.positive },
                  { label: "Adherencia", value: data.adherencePct == null ? "—" : `${data.adherencePct}%`, color: ADMIN.accent },
                ]}
                icon={<Syringe className="size-3.5" aria-hidden />}
                accent
              />
              <BolaCard
                label="Dinero que rastrean tus usuarios"
                value={`${s}${data.moneyTrackedByUsers.toLocaleString()}`}
                sub={`en ${data.totalVials} viales`}
                breakdown={[{ label: "Péptidos registrados", value: `${data.totalPeptides}`, color: "#A78BFA" }]}
                icon={<Wallet className="size-3.5" aria-hidden />}
              />
            </div>

            {/* Adopción de funciones */}
            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                Qué funciones usan
              </p>
              <ul className="space-y-2.5">
                {data.featureAdoption.map((f) => (
                  <li key={f.label} className="flex items-center gap-3">
                    <span className="w-40 shrink-0 truncate text-sm font-medium" style={{ color: ADMIN.text }}>
                      {f.label}
                    </span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: ADMIN.border }}>
                      <div className="h-full rounded-full" style={{ width: `${f.pct ?? 0}%`, background: ADMIN.accent }} />
                    </div>
                    <span className="w-24 shrink-0 text-right text-xs" style={{ color: ADMIN.textMuted }}>
                      {f.value} · {f.pct ?? 0}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vías de administración */}
            {data.topRoutes.length > 0 && (
              <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                  Cómo se administran los péptidos
                </p>
                <ul className="space-y-2.5">
                  {(() => {
                    const max = Math.max(...data.topRoutes.map((r) => r.count), 1);
                    return data.topRoutes.map((r) => {
                      const pct = Math.round((r.count / max) * 100);
                      return (
                        <li key={r.route} className="flex items-center gap-3">
                          <span className="w-40 shrink-0 truncate text-sm font-medium" style={{ color: ADMIN.text }}>
                            {r.route}
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: ADMIN.border }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ADMIN.accent }} />
                          </div>
                          <span className="w-14 shrink-0 text-right text-xs" style={{ color: ADMIN.textMuted }}>
                            {r.count}
                          </span>
                        </li>
                      );
                    });
                  })()}
                </ul>
              </div>
            )}

            {/* Efectos secundarios — señal de seguridad */}
            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                <HeartPulse className="size-3.5" aria-hidden /> Efectos secundarios reportados
              </p>
              {data.sideEffectsReported === 0 ? (
                <p className="text-sm" style={{ color: ADMIN.textMuted }}>
                  Ninguno reportado todavía.
                </p>
              ) : (
                <>
                  <p className="mb-3 text-sm" style={{ color: ADMIN.text }}>
                    {data.sideEffectsReported} en total — señal de seguridad de tus usuarios.
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {data.sideEffectsList.map((e) => (
                      <li
                        key={e.effect}
                        className="rounded-full px-3 py-1 text-xs"
                        style={{ background: "rgba(251,191,36,0.1)", color: ADMIN.warning }}
                      >
                        {e.effect} · {e.count}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Qué pregunta la gente al Asistente IA */}
            <AssistantQuestionsCard />
          </Section>
        )}

        {/* USUARIOS */}
        {showUsers && (
          <Section title="Usuarios" delay={0.25}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BolaCard
                label="Usuarios · Total"
                value={data.totalUsers.toLocaleString()}
                breakdown={[
                  { label: "Reales", value: `${data.realAccounts}`, color: ADMIN.positive },
                  { label: "De prueba (tuyas)", value: `${data.testAccounts}`, color: ADMIN.textMuted },
                ]}
                accent
              />
              <BolaCard
                label="Altas recientes"
                value={`+${data.newSignups7d}`}
                sub="últimos 7 días"
                breakdown={[
                  { label: "Últimos 30 días", value: `+${data.newSignups30d}`, color: ADMIN.positive },
                  { label: "Cancelaciones (30d)", value: `${data.voluntaryChurn30d}`, color: ADMIN.negative },
                ]}
              />
            </div>

            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                Altas por día · últimos 30 días
              </p>
              <AdminBarChart data={data.signupsByDay} />
            </div>

            {/* Encuesta de un clic al cancelar (docs PROMPT-ENCUESTA-CANCELACION.md):
                esto NO reemplaza los números de Hotmart, es el "por qué" que
                Hotmart no manda. */}
            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                Motivos de cancelación · últimos 30 días
              </p>
              {data.cancellationReasons.length === 0 ? (
                <p className="text-sm" style={{ color: ADMIN.textMuted }}>
                  Nadie respondió la encuesta de cancelación todavía.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {(() => {
                    const REASON_LABELS: Record<string, string> = {
                      no_esperaba: "No era lo que esperaba",
                      plan_gratis_basta: "El plan gratis le basta",
                      no_entendi: "No entendió cómo usarla",
                      miedo_cobro: "Miedo al cobro",
                      muy_caro: "Muy caro",
                      no_tiempo: "No tiene tiempo",
                      otro: "Otro motivo",
                    };
                    const max = Math.max(...data.cancellationReasons.map((r) => r.count), 1);
                    return data.cancellationReasons.map((r) => (
                      <li key={r.reason}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span style={{ color: ADMIN.text }}>{REASON_LABELS[r.reason] || r.reason}</span>
                          <span className="font-semibold" style={{ color: ADMIN.text }}>{r.count}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full" style={{ background: ADMIN.border }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(r.count / max) * 100}%`, background: ADMIN.negative }}
                          />
                        </div>
                      </li>
                    ));
                  })()}
                </ul>
              )}
            </div>

            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                Péptidos más usados por tus clientes
              </p>
              {data.topPeptides.length === 0 ? (
                <p className="text-sm" style={{ color: ADMIN.textMuted }}>
                  Aún no hay registros.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {(() => {
                    const max = Math.max(...data.topPeptides.map((p) => p.userCount), 1);
                    return data.topPeptides.map((p) => {
                      const pct = Math.round((p.userCount / max) * 100);
                      return (
                        <li key={p.name} className="flex items-center gap-3">
                          <div className="w-36 shrink-0">
                            <p className="truncate text-sm font-medium" style={{ color: ADMIN.text }}>
                              {p.name}
                            </p>
                            <p className="truncate text-[10px]" style={{ color: ADMIN.textMuted }}>
                              {p.category}
                            </p>
                          </div>
                          <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: ADMIN.border }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ADMIN.accent }} />
                          </div>
                          <span className="w-20 shrink-0 text-right text-xs" style={{ color: ADMIN.textMuted }}>
                            {p.userCount} {p.userCount === 1 ? "cliente" : "clientes"}
                          </span>
                        </li>
                      );
                    });
                  })()}
                </ul>
              )}
            </div>

            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                De qué países
              </p>
              {data.countries.length === 0 ? (
                <p className="text-sm" style={{ color: ADMIN.textMuted }}>
                  Aún no hay registros.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {data.countries.map((c) => {
                    const pct = data.totalUsers ? Math.round((c.count / data.totalUsers) * 100) : 0;
                    return (
                      <li key={c.country} className="flex items-center gap-3">
                        <span className="w-32 shrink-0 truncate text-sm font-medium" style={{ color: ADMIN.text }}>
                          {c.flag} {c.country}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: ADMIN.border }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ADMIN.accent }} />
                        </div>
                        <span className="w-14 shrink-0 text-right text-xs" style={{ color: ADMIN.textMuted }}>
                          {c.count} · {pct}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                Todos los usuarios
              </p>
              <UsersTable initialUsers={data.users} />
            </div>
          </Section>
        )}

        {/* RETENCIÓN Y ACTIVACIÓN */}
        {showRetention && (
          <Section
            title="Retención y activación"
            note="¿La gente vuelve? Retención = volvió a registrar algo al menos una vez pasado ese punto."
            delay={0.3}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BolaCard
                label="Activación"
                value={`${data.activationPct}%`}
                sub="completó el onboarding (altas 30d)"
              />
              <div className="rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                  Retención D1 / D7 / D30
                </p>
                <RetentionBars
                  values={[
                    { label: "Día 1", pct: data.retentionD1 },
                    { label: "Día 7", pct: data.retentionD7 },
                    { label: "Día 30", pct: data.retentionD30 },
                  ]}
                />
              </div>
            </div>
          </Section>
        )}

        {/* SATISFACCIÓN — pop-up de 5 emojis dentro de la app */}
        {showSatisfaction && (
          <Section
            title="Satisfacción de tus usuarios"
            note="Pop-up de 1 a 5 (muy triste a muy feliz) dentro de la app, máximo 1 vez al mes por usuario."
            delay={0.3}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BolaCard
                label="Promedio"
                value={data.satisfactionAvg == null ? "—" : `${data.satisfactionAvg} / 5`}
                sub={`${data.satisfactionResponses} respuesta${data.satisfactionResponses === 1 ? "" : "s"}`}
                accent
              />
              <div className="rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                  Evolución mensual (promedio)
                </p>
                {data.satisfactionByMonth.length === 0 ? (
                  <p className="text-sm" style={{ color: ADMIN.textMuted }}>
                    Aún no hay suficientes respuestas.
                  </p>
                ) : (
                  <AdminBarChart data={data.satisfactionByMonth.map((m) => ({ label: m.label, count: m.avg }))} />
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                Respuestas por nivel
              </p>
              {data.satisfactionResponses === 0 ? (
                <p className="text-sm" style={{ color: ADMIN.textMuted }}>
                  Nadie respondió la encuesta todavía.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {(() => {
                    const LEVEL_LABELS: Record<number, string> = {
                      1: "😞 Muy insatisfecho",
                      2: "🙁 Insatisfecho",
                      3: "😐 Neutral",
                      4: "🙂 Satisfecho",
                      5: "😄 Muy satisfecho",
                    };
                    const max = Math.max(...data.satisfactionByLevel.map((l) => l.count), 1);
                    return data.satisfactionByLevel.map((l) => (
                      <li key={l.level}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span style={{ color: ADMIN.text }}>{LEVEL_LABELS[l.level]}</span>
                          <span className="font-semibold" style={{ color: ADMIN.text }}>
                            {l.count}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full" style={{ background: ADMIN.border }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${(l.count / max) * 100}%`, background: ADMIN.accent }}
                          />
                        </div>
                      </li>
                    ));
                  })()}
                </ul>
              )}
            </div>
          </Section>
        )}

        {/* EMBUDO DE ACTIVACIÓN — dónde se pierde la gente */}
        {showUsers && (
          <Section
            title="Embudo · Dónde se pierde la gente"
            note="Calculado con los datos reales de la app, no con clics. Cada barra es cuánta gente llegó a ese paso."
            delay={0.3}
          >
            <div className="rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              {data.funnelBottleneck && data.funnelBottleneck.dropFromPrev > 0 && (
                <p
                  className="mb-4 rounded-xl px-3 py-2 text-sm"
                  style={{
                    background: ADMIN.surfaceHover,
                    border: `1px solid ${ADMIN.warning}44`,
                    color: ADMIN.warning,
                  }}
                >
                  Donde más gente se cae: <strong>{data.funnelBottleneck.label}</strong> — se pierden{" "}
                  {data.funnelBottleneck.dropFromPrev} persona
                  {data.funnelBottleneck.dropFromPrev === 1 ? "" : "s"} respecto al paso anterior. Es el
                  primer sitio que conviene arreglar.
                </p>
              )}
              <div className="space-y-2.5">
                {data.activationFunnel.map((step) => {
                  const isWorst = data.funnelBottleneck?.label === step.label;
                  return (
                    <div key={step.label}>
                      <div className="mb-1 flex items-baseline justify-between gap-3">
                        <span className="text-sm" style={{ color: isWorst ? ADMIN.warning : ADMIN.text }}>
                          {step.label}
                        </span>
                        <span className="shrink-0 text-sm tabular-nums" style={{ color: ADMIN.textMuted }}>
                          {step.users} · {step.pct}%
                          {step.dropFromPrev > 0 && (
                            <span style={{ color: ADMIN.negative }}> (−{step.dropFromPrev})</span>
                          )}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: ADMIN.border }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${step.pct}%`,
                            background: isWorst ? "#fbbf24" : ADMIN.accent,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        )}

        {/* SALUD DEL SISTEMA */}
        {showHealth && (
          <Section title="Salud del sistema" delay={0.35}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                  <Activity className="size-3.5" aria-hidden /> Asistente IA · Hoy
                </p>
                <p className="mt-1 font-display text-2xl font-bold" style={{ color: ADMIN.text }}>
                  {data.assistantMessagesToday}
                  <span className="text-base font-medium" style={{ color: ADMIN.textMuted }}>
                    {" "}
                    / {data.assistantGlobalLimit}
                  </span>
                </p>
                <p className="text-xs" style={{ color: ADMIN.textMuted }}>
                  mensajes {data.assistantPaused ? "· PAUSADO (tope alcanzado)" : ""}
                </p>
              </div>
              <div className="rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                  Webhook Hotmart
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: ADMIN.text }}>
                  {data.lastWebhookEventAt
                    ? `Último: ${new Date(data.lastWebhookEventAt).toLocaleString("es")}`
                    : "Sin eventos aún."}
                </p>
                <p className="text-xs" style={{ color: ADMIN.textMuted }}>
                  {data.webhookEventsToday} eventos hoy.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                <Bug className="size-3.5" aria-hidden /> Errores · más frecuentes (30 días)
              </p>
              {data.errorsByMessage30d.length === 0 ? (
                <p className="text-sm" style={{ color: ADMIN.textMuted }}>
                  Sin errores registrados. ✅
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {data.errorsByMessage30d.map((e, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(248,113,113,0.15)", color: ADMIN.negative }}
                      >
                        {e.count}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm" style={{ color: ADMIN.text }}>
                        {e.message}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {data.recentErrors.length > 0 && (
              <div className="mt-4 rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
                  Últimos errores
                </p>
                <ul className="space-y-2">
                  {data.recentErrors.slice(0, 8).map((e) => (
                    <li key={e.id} className="flex items-center justify-between gap-3 text-xs">
                      <span className="min-w-0 flex-1 truncate" style={{ color: ADMIN.text }}>
                        {e.context} — {e.message}
                      </span>
                      <span className="shrink-0" style={{ color: ADMIN.textMuted }}>
                        {new Date(e.createdAt).toLocaleString("es", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Section>
        )}

        {/* ADQUISICIÓN */}
        {showAcq && (
          <Section title="Adquisición · De dónde vienen" delay={0.4}>
            {/* Afiliados: quién vende de verdad. Solo aparece cuando hay alguno,
                para no meterle una tarjeta vacía a quien no use afiliación. */}
            {data.affiliateSales.length > 0 && (
              <div
                className="mb-4 rounded-2xl p-5"
                style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}
              >
                <p className="mb-3 text-sm font-semibold" style={{ color: ADMIN.text }}>
                  Ventas por afiliado
                </p>
                <ul className="space-y-2.5">
                  {data.affiliateSales.map((a) => (
                    <li key={a.name} className="flex items-center gap-3">
                      <span className="min-w-0 flex-1 truncate text-sm font-medium" style={{ color: ADMIN.text }}>
                        {a.name}
                      </span>
                      <span className="shrink-0 text-sm font-semibold" style={{ color: ADMIN.text }}>
                        {a.netSales}
                      </span>
                      {/* Las devueltas se muestran aparte: pagar comisión por una
                          venta reembolsada es el error clásico de los afiliados. */}
                      {a.reversed > 0 && (
                        <span className="shrink-0 text-xs" style={{ color: ADMIN.textMuted }}>
                          ({a.reversed} devuelta{a.reversed === 1 ? "" : "s"})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs" style={{ color: ADMIN.textMuted }}>
                  Contadas desde los avisos que manda Hotmart, descontando reembolsos y contracargos. La cuenta
                  oficial de comisiones es siempre la de Hotmart — esto es para ver de un vistazo quién vende de
                  verdad.
                </p>
              </div>
            )}
            <div className="rounded-2xl p-5" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
              {data.utmSources.length === 0 ? (
                <p className="text-sm" style={{ color: ADMIN.textMuted }}>
                  Aún no hay registros.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {data.utmSources.map((u) => {
                    const pct = data.totalUsers ? Math.round((u.count / data.totalUsers) * 100) : 0;
                    return (
                      <li key={u.source} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 truncate text-sm font-medium capitalize" style={{ color: ADMIN.text }}>
                          {u.source}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: ADMIN.border }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: ADMIN.accent }} />
                        </div>
                        <span className="w-14 shrink-0 text-right text-xs" style={{ color: ADMIN.textMuted }}>
                          {u.count} · {pct}%
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <p className="mt-4 text-xs" style={{ color: ADMIN.textMuted }}>
                Marca tus enlaces con{" "}
                <code className="rounded px-1" style={{ background: ADMIN.bg }}>
                  ?utm_source=instagram
                </code>{" "}
                (o tiktok, youtube…) para separar cada canal. Sin etiqueta, se detecta por el sitio de origen o se
                marca "directo".
              </p>
              <p className="mt-3 text-xs" style={{ color: ADMIN.textMuted }}>
                LTV:CAC por canal todavía no aplica — hoy no hay gasto de marketing registrado. Cuando empieces a
                invertir en un canal, se puede agregar aquí para saber cuál conviene escalar.
              </p>
            </div>

            {/* No basta con saber qué canal trae más registros — hay que saber qué
                canal trae MEJORES usuarios. Un canal puede traer mucha gente
                curiosa y otro, menos gente pero que de verdad paga y se queda. */}
            <div
              className="mt-4 rounded-2xl p-5"
              style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}
            >
              <p className="mb-1 text-sm font-semibold" style={{ color: ADMIN.text }}>
                Embudo por canal
              </p>
              <p className="mb-3 text-xs" style={{ color: ADMIN.textMuted }}>
                No solo cuántos trae cada canal, sino qué tan buenos son esos usuarios.
              </p>
              {data.channelFunnels.length === 0 ? (
                <p className="text-sm" style={{ color: ADMIN.textMuted }}>
                  Aún no hay registros.
                </p>
              ) : (
                <div className="-mx-5 overflow-x-auto px-5">
                  <table className="w-full min-w-[560px] border-separate border-spacing-y-1.5 text-sm">
                    <thead>
                      <tr style={{ color: ADMIN.textMuted }}>
                        <th className="pb-1 text-left text-xs font-medium">Canal</th>
                        <th className="pb-1 text-right text-xs font-medium">Registros</th>
                        <th className="pb-1 text-right text-xs font-medium">Activación</th>
                        <th className="pb-1 text-right text-xs font-medium">Uso 30d</th>
                        <th className="pb-1 text-right text-xs font-medium">Pagan</th>
                        <th className="pb-1 text-right text-xs font-medium">Cancelan</th>
                        <th className="pb-1 text-right text-xs font-medium">Retención 30d</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.channelFunnels.map((c) => (
                        <tr key={c.source}>
                          <td className="whitespace-nowrap text-sm font-medium capitalize" style={{ color: ADMIN.text }}>
                            {c.source}
                          </td>
                          <td className="text-right text-sm" style={{ color: ADMIN.text }}>
                            {c.signups}
                          </td>
                          <td className="text-right text-sm" style={{ color: ADMIN.textMuted }}>
                            {c.activationPct}%
                          </td>
                          <td className="text-right text-sm" style={{ color: ADMIN.textMuted }}>
                            {c.usagePct}%
                          </td>
                          <td className="text-right text-sm font-semibold" style={{ color: ADMIN.accent }}>
                            {c.paidPct}%
                          </td>
                          <td className="text-right text-sm" style={{ color: ADMIN.textMuted }}>
                            {c.cancelledPct == null ? "—" : `${c.cancelledPct}%`}
                          </td>
                          <td className="text-right text-sm" style={{ color: ADMIN.textMuted }}>
                            {c.retentionD30 == null ? "—" : `${c.retentionD30}%`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="mt-3 text-xs" style={{ color: ADMIN.textMuted }}>
                "Pagan" es el número que de verdad importa para decidir dónde invertir — no "Registros". Un canal con
                pocos registros pero "Pagan" alto vale más que uno con muchos registros curiosos que nunca convierten.
              </p>
            </div>
          </Section>
        )}

        {/* INTEGRACIONES */}
        {showIntegrations && (
          <Section
            title="Integraciones"
            note="Conecta herramientas externas de analítica. Se activan respetando el banner de cookies."
            delay={0.45}
          >
            <IntegrationsPanel />
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  note,
  children,
  delay = 0,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section {...fadeUp(delay)} className="mt-8">
      <h2 className="font-display text-lg font-bold" style={{ color: ADMIN.text }}>
        {title}
      </h2>
      {note && (
        <p className="mb-3 text-xs" style={{ color: ADMIN.textMuted }}>
          {note}
        </p>
      )}
      <div className={note ? "" : "mt-3"}>{children}</div>
    </motion.section>
  );
}

function MiniStat({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: number;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-4" style={{ background: ADMIN.surface, border: `1px solid ${ADMIN.border}` }}>
      <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
        {icon}
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold tabular-nums" style={{ color: ADMIN.text }}>
        <AnimatedNumber value={value} />
      </p>
      {sub && (
        <p className="text-[11px]" style={{ color: ADMIN.textMuted }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function BolaCard({
  label,
  value,
  sub,
  breakdown,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  breakdown?: { label: string; value: string; color: string }[];
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: accent ? ADMIN.surfaceHover : ADMIN.surface,
        border: `1px solid ${ADMIN.border}`,
      }}
    >
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: ADMIN.textMuted }}>
        {icon}
        {label}
      </p>
      <p className="mt-1 font-display text-4xl font-bold tracking-tight" style={{ color: ADMIN.text }}>
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: ADMIN.textMuted }}>
          {sub}
        </p>
      )}
      {breakdown && breakdown.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {breakdown.map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="size-2 shrink-0 rounded-full" style={{ background: b.color }} />
              <span style={{ color: ADMIN.textMuted }}>{b.label}</span>
              <span className="ml-auto font-semibold" style={{ color: ADMIN.text }}>
                {b.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
