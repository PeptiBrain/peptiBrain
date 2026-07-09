"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Flame, Syringe, AlertTriangle, Scale, Droplets, Lock, Apple, CalendarDays, Sparkles, Wallet, Trophy, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { loadOnboarding } from "@/lib/onboarding";
import { computeStreak, loadAppData, markDoseDone, type AppData } from "@/lib/app-data";
import { computeStats } from "@/lib/stats";
import { CURRENCY, type Locale } from "@/i18n/routing";
import { track } from "@/lib/mixpanel";
import { DateRangeTabs } from "@/components/app/shell/DateRangeTabs";
import { CalendarModal } from "@/components/app/shell/CalendarModal";
import { AssistantModal } from "@/components/app/assistant/AssistantModal";
import { PeptideIcon } from "@/components/app/peptidos/PeptideIcon";
import { Mascot } from "@/components/app/shell/Mascot";
import { isWithinRange, type CustomRange, type DateRangeKey } from "@/lib/date-range";

export default function InicioPage() {
  const t = useTranslations("Inicio");
  const tCal = useTranslations("Calendar");
  const locale = useLocale();
  const [data, setData] = useState<AppData | null>(null);
  const [name, setName] = useState("");
  const [range, setRange] = useState<DateRangeKey>("7d");
  const [customRange, setCustomRange] = useState<CustomRange | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  useEffect(() => {
    loadAppData().then(setData);
    setName(loadOnboarding().name);
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    const dosesInRange = data.doses.filter((d) => isWithinRange(d.scheduledAt, range, customRange));
    const doneInRange = dosesInRange.filter((d) => d.done);
    const logsInRange = data.healthLogs.filter((h) => isWithinRange(h.date, range, customRange));
    const weights = logsInRange.filter((h) => h.weightKg).map((h) => parseFloat(h.weightKg!));
    const hydrations = logsInRange.filter((h) => h.hydrationMl).map((h) => parseFloat(h.hydrationMl!));
    const sideEffects = logsInRange.filter((h) => h.sideEffect);
    const mealsInRange = data.meals.filter((m) => isWithinRange(m.date, range, customRange) && m.calories);
    const calories = mealsInRange.map((m) => parseFloat(m.calories!));

    return {
      dosesInRange,
      doneInRange,
      completionPercent: dosesInRange.length ? Math.round((doneInRange.length / dosesInRange.length) * 100) : 0,
      avgWeight: weights.length ? (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1) : null,
      avgHydration: hydrations.length ? Math.round(hydrations.reduce((a, b) => a + b, 0) / hydrations.length) : null,
      avgCalories: calories.length ? Math.round(calories.reduce((a, b) => a + b, 0) / calories.length) : null,
      sideEffects,
    };
  }, [data, range, customRange]);

  if (!data || !stats) return null;

  const pendingDose = data.doses.find((d) => !d.done);
  const donePeptide = pendingDose
    ? data.peptides.find((p) => p.id === pendingDose.peptideId)
    : null;
  const streak = computeStreak(data.doses);
  const allStats = computeStats(data, new Date());
  const { symbol } = CURRENCY[locale as Locale];

  async function handleMarkDone() {
    if (!pendingDose || !data) return;
    setData(await markDoseDone(data, pendingDose.id));
    track("dose_logged", { peptide: donePeptide?.name });
  }

  function peptideName(peptideId: string) {
    return data!.peptides.find((p) => p.id === peptideId)?.name || t("peptideFallback");
  }

  function formatLogDate(iso: string) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(locale, { day: "numeric", month: "short" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowCalendar(true)}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
        >
          <CalendarDays className="size-3.5" aria-hidden /> {tCal("openCalendar")}
        </button>
        {data.plan === "free" ? (
          <Link
            href="/paywall"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Lock className="size-3.5" aria-hidden /> {t("assistant")}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setShowAssistant(true)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
          >
            <Sparkles className="size-3.5" aria-hidden /> {t("assistant")}
          </button>
        )}
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-muted-foreground"
      >
        {t("greeting")}
        {name ? `, ${name}` : ""}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-1.5 font-display text-xl font-bold text-foreground"
      >
        {streak > 0 ? (
          <>
            {t("streakLine")} <Flame className="size-5 text-primary" aria-hidden />
          </>
        ) : (
          t("goodDayFallback")
        )}
      </motion.p>

      {pendingDose ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-xl bg-accent p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-accent-foreground">{t("nextDose")}</p>
            <span className="text-xs text-muted-foreground">{pendingDose.when}</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <PeptideIcon peptideName={donePeptide?.name || ""} />
            <div>
              <p className="font-display text-lg font-bold text-foreground">
                {donePeptide?.name || t("peptideFallback")}
              </p>
              <p className="text-sm text-muted-foreground">
                {pendingDose.amount} {pendingDose.unit}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleMarkDone}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
          >
            <Check className="size-4" aria-hidden /> {t("markDone")}
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-xl border border-dashed border-border p-6 text-center"
        >
          <div className="mx-auto mb-1 flex justify-center">
            <Mascot state="pointing" size={72} />
          </div>
          <p className="text-sm text-muted-foreground">{t("noDosesPending")}</p>
          <Link
            href="/app/peptidos"
            className="mt-2 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            {t("scheduleDose")}
          </Link>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-3 grid grid-cols-2 gap-3"
      >
        <div className="rounded-xl bg-secondary p-3">
          <p className="text-xs text-muted-foreground">{t("streakLabel")}</p>
          <p className="tabular font-display text-xl font-bold text-foreground">
            {t("streakDoses", { count: streak })}
          </p>
        </div>
        <div className="rounded-xl bg-secondary p-3">
          <p className="text-xs text-muted-foreground">{t("activePeptides")}</p>
          <p className="tabular font-display text-xl font-bold text-foreground">
            {data.peptides.length}
          </p>
        </div>
      </motion.div>

      {(allStats.totalDosesDone > 0 || allStats.totalInvested > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="mt-3 rounded-xl border border-border bg-card p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{t("statsPreviewTitle")}</p>
            <Link
              href="/app/estadisticas"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              {t("viewMoreStats")} <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-secondary/60 p-3 text-center">
              <Wallet className="mx-auto mb-1 size-4 text-primary" aria-hidden />
              <p className="tabular font-display text-base font-bold text-foreground">
                {symbol}
                {allStats.totalInvested.toFixed(0)}
              </p>
              <p className="text-[11px] text-muted-foreground">{t("statInvested")}</p>
            </div>
            <div className="rounded-lg bg-secondary/60 p-3 text-center">
              <Syringe className="mx-auto mb-1 size-4 text-primary" aria-hidden />
              <p className="tabular font-display text-base font-bold text-foreground">
                {allStats.totalDosesDone}
              </p>
              <p className="text-[11px] text-muted-foreground">{t("statDoses")}</p>
            </div>
            <div className="rounded-lg bg-secondary/60 p-3 text-center">
              <Trophy className="mx-auto mb-1 size-4 text-primary" aria-hidden />
              <p className="tabular truncate font-display text-base font-bold text-foreground">
                {allStats.mostUsed ? allStats.mostUsed.peptide.name : "—"}
              </p>
              <p className="text-[11px] text-muted-foreground">{t("statTop")}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-6">
        <DateRangeTabs
          value={range}
          onChange={setRange}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-3">
          <Syringe className="mb-2 size-4 text-primary" aria-hidden />
          <p className="tabular font-display text-xl font-bold text-foreground">
            {stats.dosesInRange.length ? `${stats.completionPercent}%` : "—"}
          </p>
          <p className="text-xs font-medium text-foreground">{t("doseCompletion")}</p>
          <p className="text-xs text-muted-foreground">
            {t("ofScheduled", { done: stats.doneInRange.length, total: stats.dosesInRange.length })}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <Scale className="mb-2 size-4 text-primary" aria-hidden />
          <p className="tabular font-display text-xl font-bold text-foreground">
            {stats.avgWeight ? `${stats.avgWeight} kg` : "—"}
          </p>
          <p className="text-xs font-medium text-foreground">{t("avgWeight")}</p>
          <p className="text-xs text-muted-foreground">{!stats.avgWeight && t("noWeightInRange")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <Apple className="mb-2 size-4 text-primary" aria-hidden />
          <p className="tabular font-display text-xl font-bold text-foreground">
            {stats.avgCalories ? `${stats.avgCalories} kcal` : "—"}
          </p>
          <p className="text-xs font-medium text-foreground">{t("avgCalories")}</p>
          <p className="text-xs text-muted-foreground">{!stats.avgCalories && t("noMealsInRange")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <Droplets className="mb-2 size-4 text-primary" aria-hidden />
          <p className="tabular font-display text-xl font-bold text-foreground">
            {stats.avgHydration ? `${stats.avgHydration} ml` : "—"}
          </p>
          <p className="text-xs font-medium text-foreground">{t("avgHydration")}</p>
          <p className="text-xs text-muted-foreground">{!stats.avgHydration && t("noHydrationInRange")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <AlertTriangle className="mb-2 size-4 text-[var(--notice-icon)]" aria-hidden />
          <p className="tabular font-display text-xl font-bold text-foreground">{stats.sideEffects.length}</p>
          <p className="text-xs font-medium text-foreground">{t("sideEffectsCount")}</p>
          <p className="text-xs text-muted-foreground">
            {stats.sideEffects.length === 0 && t("noSideEffectsInRange")}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">{t("usesInRangeTitle")}</p>
          {stats.dosesInRange.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">{t("noUsesInRange")}</p>
          ) : (
            <ul className="space-y-2">
              {stats.dosesInRange.slice(0, 5).map((d) => (
                <li key={d.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{peptideName(d.peptideId)}</span>
                  <span className="text-xs text-muted-foreground">
                    {d.amount} {d.unit}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">{t("sideEffectsPanelTitle")}</p>
          {stats.sideEffects.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">{t("noSideEffectsPanel")}</p>
          ) : (
            <ul className="space-y-2">
              {stats.sideEffects.slice(0, 5).map((h) => (
                <li key={h.id} className="text-sm">
                  <span className="text-xs text-muted-foreground">{formatLogDate(h.date)}</span>{" "}
                  <span className="text-foreground">{h.sideEffect}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CalendarModal
        open={showCalendar}
        onClose={() => setShowCalendar(false)}
        data={data}
        peptideName={peptideName}
      />

      <AssistantModal open={showAssistant} onClose={() => setShowAssistant(false)} data={data} />
    </div>
  );
}
