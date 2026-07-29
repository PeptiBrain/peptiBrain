"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { calcTrtDose, type TrtFrequency } from "@/lib/trt-calc";
import { SyringeVisual } from "./SyringeVisual";

const CONCENTRATIONS = [100, 200, 250];
const FREQUENCIES: TrtFrequency[] = ["weekly", "twice-weekly", "eod"];

export function TrtDoseTool() {
  const t = useTranslations("Trt");
  const [weeklyDoseMg, setWeeklyDoseMg] = useState("100");
  const [concentration, setConcentration] = useState("200");
  const [customConcentration, setCustomConcentration] = useState("");
  const [frequency, setFrequency] = useState<TrtFrequency>("weekly");

  const concentrationMgPerMl = concentration === "custom" ? parseFloat(customConcentration) : parseFloat(concentration);

  const result = useMemo(() => {
    const weekly = parseFloat(weeklyDoseMg);
    if (!weekly || !concentrationMgPerMl) return null;
    return calcTrtDose({ weeklyDoseMg: weekly, concentrationMgPerMl, frequency });
  }, [weeklyDoseMg, concentrationMgPerMl, frequency]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <label className="block">
        <span className="text-sm font-semibold text-foreground">{t("weeklyDoseLabel")}</span>
        <input
          value={weeklyDoseMg}
          onChange={(e) => setWeeklyDoseMg(e.target.value)}
          inputMode="decimal"
          placeholder="100"
          className="mt-1.5 h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <div className="mt-4">
        <span className="text-sm font-semibold text-foreground">{t("concentrationLabel")}</span>
        <div className="mt-1.5 grid grid-cols-4 gap-2">
          {CONCENTRATIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setConcentration(String(c))}
              className={`h-11 rounded-lg border text-sm font-semibold transition-colors ${
                concentration === String(c)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-input bg-background text-foreground hover:bg-muted"
              }`}
            >
              {c}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setConcentration("custom")}
            className={`h-11 rounded-lg border text-sm font-semibold transition-colors ${
              concentration === "custom"
                ? "border-primary bg-primary/10 text-primary"
                : "border-input bg-background text-foreground hover:bg-muted"
            }`}
          >
            {t("customOption")}
          </button>
        </div>
        {concentration === "custom" && (
          <input
            value={customConcentration}
            onChange={(e) => setCustomConcentration(e.target.value)}
            inputMode="decimal"
            placeholder={t("customPlaceholder")}
            className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        )}
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-foreground">{t("frequencyLabel")}</span>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as TrtFrequency)}
          className="mt-1.5 h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          {FREQUENCIES.map((f) => (
            <option key={f} value={f}>
              {t(`freq.${f}`)}
            </option>
          ))}
        </select>
      </label>

      {result && (
        <div className="mt-5 rounded-xl border border-border bg-background p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-accent p-3 text-center">
              <p className="text-xs font-medium text-accent-foreground">{t("mgPerInjectionLabel")}</p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums text-accent-foreground">
                {result.mgPerInjection.toFixed(1)}
              </p>
            </div>
            <div className="rounded-lg bg-accent p-3 text-center">
              <p className="text-xs font-medium text-accent-foreground">{t("mlPerInjectionLabel")}</p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums text-accent-foreground">
                {result.mlPerInjection.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <SyringeVisual syringeType="u100" units={result.units} />
          </div>
        </div>
      )}
    </div>
  );
}
