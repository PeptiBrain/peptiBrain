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

  // Progreso de la semana (para el saludo gamificado)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekDoses = data.doses.filter((d) => new Date(d.scheduledAt) >= weekAgo);
  const weekDone = weekDoses.filter((d) => d.done).length;
  const weekTag =
    weekDoses.length > 0 && weekDone >= weekDoses.length
      ? t("weekTagPerfect")
      : t("weekTagCatchUp");

  // Saludo según la hora + fecha de hoy
  const now = new Date();
  const hour = now.getHours();
  const greetKey = hour < 12 ? "greetMorning" : hour < 20 ? "greetAfternoon" : "greetEvening";
  const dateLabel = now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });

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
      <div className="mb-2 flex flex-wrap justify-end gap-2">
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
            className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform active:scale-97"
          >
            <Sparkles className="size-3.5" aria-hidden /> {t("assistant")} <Lock className="size-3" aria-hidden />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setShowAssistant(true)}
            className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform active:scale-97"
          >
            <Sparkles className="size-3.5" aria-hidden /> {t("assistant")}
          </button>
        )}
        <Link
          href={streak > 0 ? "/app/estadisticas" : "/app/peptidos"}
          className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <Flame className="size-3.5" aria-hidden />{" "}
          {streak > 0 ? t("streakChip", { count: streak }) : t("startStreak")}
        </Link>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
        <span className="inline-block size-1.5 rounded-full bg-primary" /> {dateLabel}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground"
      >
        {t(greetKey)}
        {name ? (
          <>
            ,{" "}
            <span className="bg-gradient-to-r from-primary to-[#b59a52] bg-clip-text text-transparent">
              {name}
            </span>
          </>
        ) : (
          ""
        )}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mt-0.5 text-sm text-muted-foreground"
      >
        {weekDoses.length > 0 ? (
          <>
            {t("weekProgress", { done: weekDone, total: weekDoses.length })}{" "}
            <span className="font-bold text-foreground">{weekTag}</span>
          </>
        ) : streak > 0 ? (
          <span className="inline-flex items-center gap-1">
            {t("streakLine")} <Flame className="size-4 text-primary" aria-hidden />
          </span>
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
        <HomeStatCard
          icon={Syringe}
          accent="16 185 129"
          value={stats.dosesInRange.length ? `${stats.completionPercent}%` : "—"}
          label={t("doseCompletion")}
          sub={t("ofScheduled", { done: stats.doneInRange.length, total: stats.dosesInRange.length })}
        />
        <HomeStatCard
          icon={Scale}
          accent="139 92 246"
          value={stats.avgWeight ? `${stats.avgWeight} kg` : "—"}
          label={t("avgWeight")}
          sub={!stats.avgWeight ? t("noWeightInRange") : ""}
        />
        <HomeStatCard
          icon={Apple}
          accent="249 115 22"
          value={stats.avgCalories ? `${stats.avgCalories} kcal` : "—"}
          label={t("avgCalories")}
          sub={!stats.avgCalories ? t("noMealsInRange") : ""}
        />
        <HomeStatCard
          icon={Droplets}
          accent="14 165 233"
          value={stats.avgHydration ? `${stats.avgHydration} ml` : "—"}
          label={t("avgHydration")}
          sub={!stats.avgHydration ? t("noHydrationInRange") : ""}
        />
        <HomeStatCard
          icon={AlertTriangle}
          accent="245 158 11"
          value={String(stats.sideEffects.length)}
          label={t("sideEffectsCount")}
          sub={stats.sideEffects.length === 0 ? t("noSideEffectsInRange") : ""}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Syringe className="size-4 text-primary" aria-hidden /> {t("usesInRangeTitle")}
            </p>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {stats.dosesInRange.length}
            </span>
          </div>
          {stats.dosesInRange.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-8 text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Syringe className="size-5 text-primary" aria-hidden />
              </div>
              <p className="text-sm font-medium text-foreground">{t("noUsesTitle")}</p>
              <p className="mx-auto mt-1 max-w-[16rem] text-xs text-muted-foreground">{t("noUsesInRange")}</p>
              <Link
                href="/app/peptidos"
                className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-transform active:scale-97"
              >
                <Check className="size-3.5" aria-hidden /> {t("registerUseCta")}
              </Link>
            </div>
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
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <AlertTriangle className="size-4 text-[var(--notice-icon)]" aria-hidden />{" "}
              {t("sideEffectsPanelTitle")}
            </p>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {stats.sideEffects.length}
            </span>
          </div>
          {stats.sideEffects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border py-8 text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="size-5 text-primary" aria-hidden />
              </div>
              <p className="text-sm font-medium text-foreground">{t("noSideEffectsTitle")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("noSideEffectsPanel")}</p>
            </div>
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

// Tarjeta de estadística con esquina de color semántico (accent = "r g b").
function HomeStatCard({
  icon: Icon,
  accent,
  value,
  label,
  sub,
}: {
  icon: typeof Syringe;
  accent: string;
  value: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-3">
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full blur-xl"
        style={{ background: `rgb(${accent} / 0.18)` }}
        aria-hidden
      />
      <div
        className="relative mb-2 flex size-8 items-center justify-center rounded-lg"
        style={{ background: `rgb(${accent} / 0.14)` }}
      >
        <Icon className="size-4" style={{ color: `rgb(${accent})` }} aria-hidden />
      </div>
      <p className="relative tabular-nums font-display text-xl font-bold text-foreground">{value}</p>
      <p className="relative text-xs font-medium text-foreground">{label}</p>
      {sub && <p className="relative text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
