"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import {
  Wallet,
  Syringe,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  BarChart3,
  AlertTriangle,
  PieChart,
  Users,
} from "lucide-react";
import { loadAppData, loadFamilySharedData, type AppData, type SharedOwnerData } from "@/lib/app-data";
import { computeStats, filterDataByRange, doseBuckets, totalInvested, doneDoses } from "@/lib/stats";
import { PeptideIcon } from "@/components/app/peptidos/PeptideIcon";
import { AnimatedNumber } from "@/components/app/shell/AnimatedNumber";
import { BarChart, DonutChart } from "@/components/app/stats/Charts";
import { STATS_RANGE_KEYS, type DateRangeKey, type CustomRange } from "@/lib/date-range";
import { CURRENCY, type Locale } from "@/i18n/routing";

const RANGE_LABEL_KEY: Record<DateRangeKey, string> = {
  today: "today",
  "7d": "last7",
  "30d": "last30",
  "3m": "last3m",
  "6m": "last6m",
  "1y": "last1y",
  "2y": "last2y",
  "3y": "last3y",
  "5y": "last5y",
  "10y": "last10y",
  all: "all",
  custom: "custom",
};

export default function EstadisticasPage() {
  const t = useTranslations("Stats");
  const tr = useTranslations("DateRange");
  const locale = useLocale() as Locale;
  const { symbol } = CURRENCY[locale];
  const [data, setData] = useState<AppData | null>(null);
  const [familyData, setFamilyData] = useState<SharedOwnerData[] | null>(null);
  const [range, setRange] = useState<DateRangeKey>("all");
  const [custom, setCustom] = useState<CustomRange | null>(null);
  const [viewMode, setViewMode] = useState<"mine" | "family">("mine");

  useEffect(() => {
    loadAppData().then(setData);
    loadFamilySharedData().then(setFamilyData);
  }, []);

  const hasFamilyData = (familyData?.length || 0) > 0;
  const combined = viewMode === "family" && hasFamilyData;

  // En modo "yo + familia" se suman péptidos/viales/dosis/comidas de quienes
  // aceptaron compartir contigo. Peso y efectos secundarios se dejan solo
  // tuyos: promediar el peso de dos personas distintas no tiene sentido.
  const combinedSource: AppData | null = useMemo(() => {
    if (!data) return null;
    if (!combined || !familyData) return data;
    return {
      ...data,
      peptides: [...data.peptides, ...familyData.flatMap((f) => f.peptides)],
      vials: [...data.vials, ...familyData.flatMap((f) => f.vials)],
      doses: [...data.doses, ...familyData.flatMap((f) => f.doses)],
      meals: [...data.meals, ...familyData.flatMap((f) => f.meals)],
    };
  }, [data, familyData, combined]);

  const filtered = useMemo(
    () => (combinedSource ? filterDataByRange(combinedSource, range, custom) : null),
    [combinedSource, range, custom]
  );
  const stats = useMemo(() => (filtered ? computeStats(filtered, new Date()) : null), [filtered]);
  const buckets = useMemo(
    () => (combinedSource ? doseBuckets(combinedSource, range, custom, new Date(), locale) : []),
    [combinedSource, range, custom, locale]
  );

  const perPerson = useMemo(() => {
    if (!data || !familyData) return [];
    const mine = filterDataByRange(data, range, custom);
    const rows = [
      { name: t("youLabel"), invested: totalInvested(mine.vials), doses: doneDoses(mine.doses).length },
    ];
    for (const f of familyData) {
      const asAppData: AppData = { ...data, doses: f.doses, healthLogs: f.healthLogs, vials: f.vials, meals: f.meals };
      const theirFiltered = filterDataByRange(asAppData, range, custom);
      rows.push({
        name: f.ownerName,
        invested: totalInvested(theirFiltered.vials),
        doses: doneDoses(theirFiltered.doses).length,
      });
    }
    return rows;
  }, [data, familyData, range, custom, t]);

  if (!data || !filtered || !stats) return null;

  const hasData = data.peptides.length > 0 || data.doses.length > 0;
  const maxDoses = stats.usage[0]?.doseCount || 1;
  const chartHasValues = buckets.some((b) => b.value > 0);

  const fade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        {hasFamilyData && (
          <div className="flex shrink-0 gap-1 rounded-full bg-secondary p-1">
            <button
              type="button"
              onClick={() => setViewMode("mine")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "mine" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t("viewMine")}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("family")}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "family" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Users className="size-3.5" aria-hidden /> {t("viewFamily")}
            </button>
          </div>
        )}
      </div>

      {combined && (
        <p className="mb-3 text-xs text-muted-foreground">{t("familyNote")}</p>
      )}

      {!hasData ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <BarChart3 className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("emptyBody")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Selector de rango */}
          <div className="rounded-xl border border-border bg-card p-3">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("rangeLabel")}</label>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as DateRangeKey)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
            >
              {STATS_RANGE_KEYS.map((k) => (
                <option key={k} value={k}>
                  {tr(RANGE_LABEL_KEY[k])}
                </option>
              ))}
            </select>
            {range === "custom" && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="date"
                  value={custom?.start || ""}
                  onChange={(e) => setCustom({ start: e.target.value, end: custom?.end || e.target.value })}
                  className="h-10 flex-1 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
                />
                <span className="text-xs text-muted-foreground">{tr("customTo")}</span>
                <input
                  type="date"
                  value={custom?.end || ""}
                  onChange={(e) => setCustom({ start: custom?.start || e.target.value, end: e.target.value })}
                  className="h-10 flex-1 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
                />
              </div>
            )}
          </div>

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
            {combined && perPerson.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-primary/20 pt-3 text-xs">
                {perPerson.map((p) => (
                  <span key={p.name} className="text-muted-foreground">
                    {p.name}:{" "}
                    <span className="font-semibold text-foreground">
                      {symbol}
                      {p.invested.toFixed(0)}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* GRÁFICA DE BARRAS: dosis en el tiempo */}
          <motion.div {...fade} className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <BarChart3 className="size-4 text-primary" aria-hidden /> {t("dosesOverTime")}
            </p>
            {chartHasValues ? (
              <BarChart data={buckets} />
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">{t("noDosesInRange")}</p>
            )}
          </motion.div>

          {/* DONUT: reparto por péptido */}
          {stats.usage.length > 0 && (
            <motion.div {...fade} className="rounded-xl border border-border bg-card p-4">
              <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <PieChart className="size-4 text-primary" aria-hidden /> {t("usageShare")}
              </p>
              <DonutChart
                data={stats.usage.map((u) => ({ label: u.peptide.name, value: u.doseCount }))}
                centerLabel={t("totalDosesSub")}
                centerValue={String(stats.totalDosesDone)}
              />
            </motion.div>
          )}

          {/* GRID de métricas */}
          <motion.div {...fade} className="grid grid-cols-2 gap-3">
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
              sub={
                combined && perPerson.length > 0
                  ? perPerson.map((p) => `${p.name}: ${p.doses}`).join(" · ")
                  : t("totalDosesSub")
              }
            />
          </motion.div>

          {/* Péptido más usado */}
          {stats.mostUsed && (
            <motion.div {...fade} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
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
            <motion.div {...fade} className="rounded-xl border border-border bg-card p-4">
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
          <motion.div {...fade} className="grid grid-cols-2 gap-3">
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
