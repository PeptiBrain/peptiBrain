"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightLeft, Scale, Syringe } from "lucide-react";

type Mode = "weight" | "dose";

export function UnitConverter() {
  const t = useTranslations("Peptidos");
  const [mode, setMode] = useState<Mode>("weight");

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("weight")}
          className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-sm font-medium ${
            mode === "weight"
              ? "border-primary bg-accent text-accent-foreground"
              : "border-border bg-background text-foreground"
          }`}
        >
          <Scale className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{t("converterWeightTab")}</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("dose")}
          className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-sm font-medium ${
            mode === "dose"
              ? "border-primary bg-accent text-accent-foreground"
              : "border-border bg-background text-foreground"
          }`}
        >
          <Syringe className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{t("converterDoseTab")}</span>
        </button>
      </div>

      {mode === "weight" ? <WeightConverter t={t} /> : <DoseConverter t={t} />}
    </div>
  );
}

type TFn = (key: string, values?: Record<string, string | number>) => string;

// mg <-> mcg (1 mg = 1000 mcg)
function WeightConverter({ t }: { t: TFn }) {
  const [mg, setMg] = useState("");
  const [mcg, setMcg] = useState("");

  function fromMg(value: string) {
    setMg(value);
    const n = parseFloat(value);
    setMcg(Number.isFinite(n) ? String(+(n * 1000).toFixed(4)) : "");
  }
  function fromMcg(value: string) {
    setMcg(value);
    const n = parseFloat(value);
    setMg(Number.isFinite(n) ? String(+(n / 1000).toFixed(6)) : "");
  }

  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">{t("converterWeightHint")}</p>
      <label className="mb-1.5 block text-sm font-medium text-foreground">mg</label>
      <input
        value={mg}
        onChange={(e) => fromMg(e.target.value)}
        inputMode="decimal"
        placeholder="0"
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="my-2 flex justify-center">
        <ArrowRightLeft className="size-4 rotate-90 text-muted-foreground" aria-hidden />
      </div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">mcg (µg)</label>
      <input
        value={mcg}
        onChange={(e) => fromMcg(e.target.value)}
        inputMode="decimal"
        placeholder="0"
        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

// Dosis (mcg) <-> volumen (mL) <-> unidades de insulina (U-100: 100 U = 1 mL)
// dado una concentración en mg/mL
function DoseConverter({ t }: { t: TFn }) {
  const [concentration, setConcentration] = useState(""); // mg/mL
  const [doseMcg, setDoseMcg] = useState("");

  const conc = parseFloat(concentration); // mg/mL
  const dose = parseFloat(doseMcg); // mcg
  const valid = Number.isFinite(conc) && conc > 0 && Number.isFinite(dose) && dose > 0;

  // mcg / (mg/mL * 1000 mcg/mg) = mL
  const ml = valid ? dose / (conc * 1000) : null;
  const units = ml !== null ? ml * 100 : null; // U-100

  return (
    <div>
      <p className="mb-3 text-xs text-muted-foreground">{t("converterDoseHint")}</p>

      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {t("converterConcentrationLabel")}
      </label>
      <div className="flex items-center gap-2">
        <input
          value={concentration}
          onChange={(e) => setConcentration(e.target.value)}
          inputMode="decimal"
          placeholder="5"
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="shrink-0 text-sm text-muted-foreground">mg/mL</span>
      </div>

      <label className="mt-3 mb-1.5 block text-sm font-medium text-foreground">
        {t("converterDoseLabel")}
      </label>
      <div className="flex items-center gap-2">
        <input
          value={doseMcg}
          onChange={(e) => setDoseMcg(e.target.value)}
          inputMode="decimal"
          placeholder="250"
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <span className="shrink-0 text-sm text-muted-foreground">mcg</span>
      </div>

      {valid && ml !== null && units !== null && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-border bg-background p-3 text-center">
            <p className="font-display text-xl font-bold text-primary">{ml.toFixed(3)}</p>
            <p className="text-xs text-muted-foreground">mL</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-3 text-center">
            <p className="font-display text-xl font-bold text-primary">{units.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">{t("converterInsulinUnits")}</p>
          </div>
        </div>
      )}
      {valid && (
        <p className="mt-2 text-center text-[11px] text-muted-foreground">{t("converterInsulinNote")}</p>
      )}
    </div>
  );
}
