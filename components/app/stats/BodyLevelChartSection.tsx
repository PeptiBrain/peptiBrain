"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Activity } from "lucide-react";
import { PEPTIDE_PROFILES } from "@/lib/peptide-profiles";
import { computeBodyLevelSeries } from "@/lib/body-level";
import { LineChart } from "@/components/app/stats/Charts";
import type { AppData } from "@/lib/app-data";

const DAYS = 30;

export function BodyLevelChartSection({ data }: { data: AppData }) {
  const t = useTranslations("Stats");
  const locale = useLocale();

  const eligiblePeptides = useMemo(
    () =>
      data.peptides.filter((p) => {
        const profile = PEPTIDE_PROFILES.find((pr) => pr.name.trim().toLowerCase() === p.name.trim().toLowerCase());
        if (!profile || profile.halfLifeHoursEstimate == null) return false;
        return data.doses.some((d) => d.peptideId === p.id && d.done);
      }),
    [data.peptides, data.doses]
  );

  const [peptideId, setPeptideId] = useState(eligiblePeptides[0]?.id || "");
  const selected = eligiblePeptides.find((p) => p.id === peptideId) || eligiblePeptides[0];

  const profile = selected
    ? PEPTIDE_PROFILES.find((pr) => pr.name.trim().toLowerCase() === selected.name.trim().toLowerCase())
    : null;

  const series = useMemo(() => {
    if (!selected || !profile?.halfLifeHoursEstimate) return [];
    return computeBodyLevelSeries(data.doses, selected.id, profile.halfLifeHoursEstimate, DAYS);
  }, [data.doses, selected, profile]);

  if (eligiblePeptides.length === 0) return null;

  const points = series.map((s, i) => ({ x: i, y: s.level }));
  const firstDate = series[0] ? new Date(series[0].timestamp) : null;
  const lastDate = series[series.length - 1] ? new Date(series[series.length - 1].timestamp) : null;
  const doseUnit = data.doses.find((d) => d.peptideId === selected?.id)?.unit || "mg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-card p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Activity className="size-4 text-primary" aria-hidden /> {t("bodyLevelChartTitle")}
        </p>
        {eligiblePeptides.length > 1 && (
          <select
            value={peptideId || selected?.id}
            onChange={(e) => setPeptideId(e.target.value)}
            className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground"
          >
            {eligiblePeptides.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {points.length >= 2 ? (
        <>
          <LineChart
            points={points}
            labels={
              firstDate && lastDate
                ? [
                    firstDate.toLocaleDateString(locale, { day: "numeric", month: "short" }),
                    lastDate.toLocaleDateString(locale, { day: "numeric", month: "short" }),
                  ]
                : undefined
            }
          />
          <p className="mt-2 text-[11px] text-muted-foreground">{t("bodyLevelChartUnit", { unit: doseUnit })}</p>
        </>
      ) : (
        <p className="py-6 text-center text-sm text-muted-foreground">{t("bodyLevelChartEmpty")}</p>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">{t("bodyLevelChartNote")}</p>
    </motion.div>
  );
}
