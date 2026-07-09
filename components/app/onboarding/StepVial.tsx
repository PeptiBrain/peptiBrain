"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Beaker } from "lucide-react";

export function StepVial({
  peptideName,
  initialAmount,
  initialUnit,
  initialBacWater,
  onContinue,
}: {
  peptideName: string;
  initialAmount: string;
  initialUnit: string;
  initialBacWater: string;
  onContinue: (amount: string, unit: string, bacWater: string) => void;
}) {
  const t = useTranslations("Onboarding");
  const [amount, setAmount] = useState(initialAmount);
  const [unit, setUnit] = useState(initialUnit || "mg");
  const [bacWater, setBacWater] = useState(initialBacWater);

  const concentration = useMemo(() => {
    const a = parseFloat(amount);
    const b = parseFloat(bacWater);
    if (!a || !b) return null;
    return (a / b).toFixed(2);
  }, [amount, bacWater]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
          <Beaker className="size-5 text-primary" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t("step2Eyebrow")}
          </p>
          <h1 className="text-balance font-display text-2xl font-bold leading-tight text-foreground">
            {t("step2Title", { peptide: peptideName || t("yourPeptideFallback") })}
          </h1>
        </div>
      </div>

      <label className="mb-1.5 block text-sm font-medium text-foreground">{t("step2Question")}</label>
      <div className="mb-4 flex gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="5"
          className="h-12 flex-1 rounded-lg border border-input bg-background px-4 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="h-12 w-24 rounded-lg border border-input bg-background px-2 text-base text-foreground"
        >
          <option value="mg">mg</option>
          <option value="mcg">mcg</option>
          <option value="ml">ml</option>
          <option value="UI">UI</option>
        </select>
      </div>

      <label className="mb-1.5 block text-sm font-medium text-foreground">{t("bacWaterLabel")}</label>
      <input
        value={bacWater}
        onChange={(e) => setBacWater(e.target.value)}
        inputMode="decimal"
        placeholder={t("bacWaterPlaceholder")}
        className="mb-3 h-12 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {concentration && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground"
        >
          {t("concentration")} <span className="tabular font-semibold">{concentration}</span> {unit}/mL
        </motion.p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onContinue("", "mg", "")}
          className="h-12 flex-1 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary"
        >
          {t("skipForNow")}
        </button>
        <button
          type="button"
          disabled={!amount.trim()}
          onClick={() => onContinue(amount.trim(), unit, bacWater.trim())}
          className="h-12 flex-1 rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97 disabled:opacity-50"
        >
          {t("continueBtn")}
        </button>
      </div>
    </motion.div>
  );
}
