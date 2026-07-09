"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";
import type { AppData } from "@/lib/app-data";
import { unitsToDraw } from "@/lib/dose-math";
import { SyringeVisual, SYRINGE_CAPACITY } from "@/components/app/calculator/SyringeVisual";
import type { SyringeType } from "@/lib/app-data";

const SYRINGE_OPTIONS: { value: SyringeType; label: string }[] = [
  { value: "u30", label: "U30 (0.3 mL)" },
  { value: "u50", label: "U50 (0.5 mL)" },
  { value: "u100", label: "U100 (1 mL)" },
];

export function ReconstitutionCalculator({ data }: { data: AppData }) {
  const t = useTranslations("Peptidos");
  const [vialId, setVialId] = useState("");
  const [vialAmount, setVialAmount] = useState("");
  const [vialUnit, setVialUnit] = useState("mg");
  const [bacWater, setBacWater] = useState("");
  const [syringeType, setSyringeType] = useState<SyringeType>("u100");
  const [doseAmount, setDoseAmount] = useState("");
  const [doseUnit, setDoseUnit] = useState("mcg");

  function pickVial(id: string) {
    setVialId(id);
    const vial = data.vials.find((v) => v.id === id);
    if (!vial) return;
    setVialAmount(vial.amount);
    setVialUnit(vial.unit);
    setBacWater(vial.bacWater || "");
    if (vial.syringeType) setSyringeType(vial.syringeType);
  }

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
    <div className="rounded-xl border border-border bg-card p-4">
      {data.vials.length > 0 && (
        <div className="mb-3">
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {t("calculatorUseVialLabel")}
          </label>
          <select
            value={vialId}
            onChange={(e) => pickVial(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground"
          >
            <option value="">{t("calculatorManualEntry")}</option>
            {data.vials.map((v) => {
              const peptide = data.peptides.find((p) => p.id === v.peptideId);
              return (
                <option key={v.id} value={v.id}>
                  {peptide?.name || "—"} · {v.amount} {v.unit}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <p className="mb-1.5 text-xs font-medium text-foreground">{t("vialLabel")}</p>
      <div className="flex gap-2">
        <input
          value={vialAmount}
          onChange={(e) => setVialAmount(e.target.value)}
          inputMode="decimal"
          placeholder={t("amountPlaceholder")}
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={vialUnit}
          onChange={(e) => setVialUnit(e.target.value)}
          className="h-11 w-20 rounded-lg border border-input bg-background px-2 text-base text-foreground"
        >
          <option value="mg">mg</option>
          <option value="mcg">mcg</option>
          <option value="ml">ml</option>
          <option value="UI">UI</option>
        </select>
      </div>

      <input
        value={bacWater}
        onChange={(e) => setBacWater(e.target.value)}
        inputMode="decimal"
        placeholder={t("bacWaterPlaceholder")}
        className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {concentration && (
        <p className="mt-2 rounded-lg bg-accent px-3 py-1.5 text-xs text-accent-foreground">
          {t("concentration")} <span className="tabular font-semibold">{concentration}</span> {vialUnit}/mL
        </p>
      )}

      <p className="mt-3 mb-1.5 text-xs font-medium text-foreground">{t("syringeTypeLabel")}</p>
      <div className="grid grid-cols-3 gap-2">
        {SYRINGE_OPTIONS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setSyringeType(s.value)}
            className={`h-10 rounded-lg border text-xs font-medium ${
              syringeType === s.value
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-background text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="mt-3 mb-1.5 text-xs font-medium text-foreground">{t("desiredDoseLabel")}</p>
      <div className="flex gap-2">
        <input
          value={doseAmount}
          onChange={(e) => setDoseAmount(e.target.value)}
          inputMode="decimal"
          placeholder={t("dosePlaceholder")}
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={doseUnit}
          onChange={(e) => setDoseUnit(e.target.value)}
          className="h-11 w-24 rounded-lg border border-input bg-background px-2 text-base text-foreground"
        >
          <option value="mcg">mcg</option>
          <option value="mg">mg</option>
        </select>
      </div>

      {draw !== null && (
        <div className="mt-3 rounded-lg border border-border p-3">
          <p className="text-center text-sm text-foreground">
            {t("drawUpTo")} <span className="tabular font-semibold text-primary">{draw.toFixed(1)}</span>{" "}
            {t("units")}
          </p>
          <div className="mt-2">
            <SyringeVisual syringeType={syringeType} units={draw} />
          </div>
          {draw > SYRINGE_CAPACITY[syringeType] && (
            <p className="mt-1 text-center text-xs text-destructive">{t("overCapacity")}</p>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-foreground"
          >
            <Printer className="size-3.5" aria-hidden /> {t("pdf")}
          </button>
        </div>
      )}
    </div>
  );
}
