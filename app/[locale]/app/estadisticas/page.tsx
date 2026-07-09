"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Wallet, Syringe, Target, TrendingDown, TrendingUp, Trophy, BarChart3, AlertTriangle } from "lucide-react";
import { loadAppData, type AppData } from "@/lib/app-data";
import { computeStats } from "@/lib/stats";
import { PeptideIcon } from "@/components/app/peptidos/PeptideIcon";
import { AnimatedNumber } from "@/components/app/shell/AnimatedNumber";
import { CURRENCY, type Locale } from "@/i18n/routing";

export default function EstadisticasPage() {
  const t = useTranslations("Stats");
  const locale = useLocale() as Locale;
  const { symbol } = CURRENCY[locale];
  const [data, setData] = useState<AppData | null>(null);

  useEffect(() => {
    loadAppData().then(setData);
  }, []);

  const stats = useMemo(() => (data ? computeStats(data, new Date()) : null), [data]);

  if (!data || !stats) return null;

  const hasData = stats.totalDosesDone > 0 || stats.totalInvested > 0 || data.peptides.length > 0;
  const maxDoses = stats.usage[0]?.doseCount || 1;

  const fade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-4">
        <h1 className="font-display text-xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {!hasData ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <BarChart3 className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("emptyBody")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* HÉROE: dinero invertido */}
          <motion.div
            {...fade}
            className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-accent to-card p-5"
          >
            <div className="flex items-center gap-2 text-primary">
              <Wallet className="size-4" aria-hidden />
              <span className="text-xs font-semibold tracking-wide uppercase">{t("investedLabel")}</span>
            </div>
            <p className="mt-1 font-display text-4xl font-bold text-foreground">
              <AnimatedNumber value={stats.totalInvested} decimals={2} prefix={symbol} />
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span>
                {t("spentThisMonth")}:{" "}
                <span className="font-semibold text-foreground">
                  {symbol}
                  {stats.spendThisMonth.toFixed(2)}
                </span>
              </span>
              {stats.costPerDose !== null && (
                <span>
                  {t("costPerDose")}:{" "}
                  <span className="font-semibold text-foreground">
                    {symbol}
                    {stats.costPerDose.toFixed(2)}
                  </span>
                </span>
              )}
            </div>
            {stats.totalInvested === 0 && (
              <p className="mt-2 text-[11px] text-muted-foreground">{t("addCostHint")}</p>
            )}
          </motion.div>

          {/* GRID de métricas */}
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.05 }} className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Target className="size-4 text-primary" aria-hidden />}
              label={t("adherence")}
              value={stats.adherence ? <AnimatedNumber value={stats.adherence.pct} suffix="%" /> : "—"}
              sub={
                stats.adherence
                  ? t("adherenceSub", { done: stats.adherence.done, due: stats.adherence.due })
                  : t("noData")
              }
            />
            <StatCard
              icon={<Syringe className="size-4 text-primary" aria-hidden />}
              label={t("totalDoses")}
              value={<AnimatedNumber value={stats.totalDosesDone} />}
              sub={t("totalDosesSub")}
            />
          </motion.div>

          {/* Péptido más usado */}
          {stats.mostUsed && (
            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <Trophy className="size-6 text-primary" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {t("mostUsed")}
                </p>
                <p className="truncate font-display text-lg font-bold text-foreground">
                  {stats.mostUsed.peptide.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {t("mostUsedSub", {
                    count: stats.mostUsed.doseCount,
                    mg: +stats.mostUsed.totalMg.toFixed(2),
                  })}
                </p>
              </div>
            </motion.div>
          )}

          {/* Ranking de uso por péptido */}
          {stats.usage.length > 0 && (
            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <BarChart3 className="size-4 text-primary" aria-hidden /> {t("usageTitle")}
              </p>
              <ul className="space-y-3">
                {stats.usage.map((u) => (
                  <li key={u.peptide.id} className="flex items-center gap-3">
                    <PeptideIcon peptideName={u.peptide.name} size="size-7" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-medium text-foreground">{u.peptide.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {t("usageDoses", { count: u.doseCount })}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${(u.doseCount / maxDoses) * 100}%` }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Peso + efectos */}
          <motion.div {...fade} transition={{ ...fade.transition, delay: 0.2 }} className="grid grid-cols-2 gap-3">
            <StatCard
              icon={
                stats.weight && stats.weight.deltaKg < 0 ? (
                  <TrendingDown className="size-4 text-primary" aria-hidden />
                ) : (
                  <TrendingUp className="size-4 text-primary" aria-hidden />
                )
              }
              label={t("weightTrend")}
              value={
                stats.weight ? (
                  <span>
                    {stats.weight.deltaKg > 0 ? "+" : ""}
                    {stats.weight.deltaKg} kg
                  </span>
                ) : (
                  "—"
                )
              }
              sub={
                stats.weight
                  ? t("weightSub", { first: stats.weight.first, last: stats.weight.last })
                  : t("noData")
              }
            />
            <StatCard
              icon={<AlertTriangle className="size-4 text-primary" aria-hidden />}
              label={t("sideEffects")}
              value={<AnimatedNumber value={stats.sideEffects} />}
              sub={stats.sideEffects === 0 ? t("sideEffectsNone") : t("sideEffectsSub")}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15">{icon}</div>
      <p className="mt-2 font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="truncate text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
