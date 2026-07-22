"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";
import { unitsToDraw } from "@/lib/dose-math";
import { SyringeVisual, SYRINGE_CAPACITY } from "@/components/app/calculator/SyringeVisual";
import type { SyringeType } from "@/lib/app-data";

const SYRINGE_OPTIONS: { value: SyringeType; label: string }[] = [
  { value: "u30", label: "U30 (0.3 mL)" },
  { value: "u50", label: "U50 (0.5 mL)" },
  { value: "u100", label: "U100 (1 mL)" },
];

export type CalcPrefill = {
  vialAmount?: string;
  vialUnit?: string;
  bacWater?: string;
  doseAmount?: string;
  doseUnit?: string;
};

// Calculadora de reconstitución PÚBLICA (sin login, sin datos de la app). Reutiliza la
// misma matemática que la de dentro (unitsToDraw) y la jeringa visual. Sirve de imán SEO.
export function PublicReconstitutionCalculator({ prefill }: { prefill?: CalcPrefill }) {
  const t = useTranslations("Calculadora");
  const [vialAmount, setVialAmount] = useState(prefill?.vialAmount ?? "");
  const [vialUnit, setVialUnit] = useState(prefill?.vialUnit ?? "mg");
  const [bacWater, setBacWater] = useState(prefill?.bacWater ?? "");
  const [syringeType, setSyringeType] = useState<SyringeType>("u100");
  const [doseAmount, setDoseAmount] = useState(prefill?.doseAmount ?? "");
  const [doseUnit, setDoseUnit] = useState(prefill?.doseUnit ?? "mcg");

  const draw = useMemo(() => {
    const a = parseFloat(vialAmount);
    const b = parseFloat(bacWater);
    const d = parseFloat(doseAmount);
    if (!a || !b || !d) return null;
    return unitsToDraw({ vialAmount: a, vialUnit, bacWater: b, doseAmount: d, doseUnit });
  }, [vialAmount, bacWater, doseAmount, vialUnit, doseUnit]);

  const concentration = useMemo(() => {
    const a = parseFloat(vialAmount);
    const b = parseFloat(bacWater);
    if (!a || !b) return null;
    return (a / b).toFixed(2);
  }, [vialAmount, bacWater]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("vialLabel")}
      </p>
      <div className="flex gap-2">
        <input
          value={vialAmount}
          onChange={(e) => setVialAmount(e.target.value)}
          inputMode="decimal"
          placeholder={t("amountPlaceholder")}
          aria-label={t("vialLabel")}
          className="h-12 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={vialUnit}
          onChange={(e) => setVialUnit(e.target.value)}
          aria-label={t("vialUnitLabel")}
          className="h-12 w-20 rounded-lg border border-input bg-background px-2 text-base text-foreground"
        >
          <option value="mg">mg</option>
          <option value="mcg">mcg</option>
        </select>
      </div>

      <p className="mt-4 mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("bacWaterLabel")}
      </p>
      <div className="flex gap-2">
        <input
          value={bacWater}
          onChange={(e) => setBacWater(e.target.value)}
          inputMode="decimal"
          placeholder={t("bacWaterPlaceholder")}
          aria-label={t("bacWaterLabel")}
          className="h-12 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="flex h-12 w-20 items-center justify-center rounded-lg border border-input bg-muted text-base text-muted-foreground">
          mL
        </span>
      </div>
      {concentration && (
        <p className="mt-2 rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">
          {t("concentration")}{" "}
          <span className="font-semibold tabular-nums">{concentration}</span> {vialUnit}/mL
        </p>
      )}

      <p className="mt-4 mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("syringeTypeLabel")}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {SYRINGE_OPTIONS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setSyringeType(s.value)}
            className={`h-11 rounded-lg border text-xs font-medium transition-colors ${
              syringeType === s.value
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mt-4 mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("desiredDoseLabel")}
      </p>
      <div className="flex gap-2">
        <input
          value={doseAmount}
          onChange={(e) => setDoseAmount(e.target.value)}
          inputMode="decimal"
          placeholder={t("dosePlaceholder")}
          aria-label={t("desiredDoseLabel")}
          className="h-12 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={doseUnit}
          onChange={(e) => setDoseUnit(e.target.value)}
          aria-label={t("doseUnitLabel")}
          className="h-12 w-24 rounded-lg border border-input bg-background px-2 text-base text-foreground"
        >
          <option value="mcg">mcg</option>
          <option value="mg">mg</option>
        </select>
      </div>

      {draw !== null ? (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-center text-sm text-muted-foreground">{t("drawUpTo")}</p>
          <p className="mt-1 text-center font-display text-4xl font-bold tabular-nums text-primary">
            {draw.toFixed(1)}
            <span className="ml-1 text-lg font-semibold text-muted-foreground">{t("units")}</span>
          </p>
          <div className="mt-3">
            <SyringeVisual syringeType={syringeType} units={draw} />
          </div>
          {draw > SYRINGE_CAPACITY[syringeType] && (
            <p className="mt-2 text-center text-xs font-medium text-destructive">{t("overCapacity")}</p>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted"
          >
            <Printer className="size-3.5" aria-hidden /> {t("print")}
          </button>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center">
          <p className="text-sm text-muted-foreground">{t("emptyResult")}</p>
        </div>
      )}
    </div>
  );
}
