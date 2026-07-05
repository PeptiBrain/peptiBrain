"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { CalendarClock } from "lucide-react";

export function StepDose({
  peptideName,
  initialAmount,
  initialUnit,
  onFinish,
}: {
  peptideName: string;
  initialAmount: string;
  initialUnit: string;
  onFinish: (when: string, amount: string, unit: string) => void;
}) {
  const t = useTranslations("Onboarding");
  const QUICK = [t("in1Hour"), t("tomorrow8am"), t("tomorrow8pm")];
  const [when, setWhen] = useState("");
  const [amount, setAmount] = useState(initialAmount);
  const [unit, setUnit] = useState(initialUnit || "mg");

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-sm px-4 py-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
          <CalendarClock className="size-5 text-primary" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t("step3Eyebrow")}
          </p>
          <h1 className="text-balance font-display text-2xl font-bold leading-tight text-foreground">
            {t("step3Title")}
          </h1>
        </div>
      </div>

      <label className="mb-1.5 block text-sm font-medium text-foreground">{t("whenLabel")}</label>
      <div className="mb-3 flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setWhen(q)}
            className={`h-9 rounded-full border px-3 text-sm font-medium transition-colors active:scale-97 ${
              when === q
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground"
            }`}
          >
            {q}
          </button>
        ))}
      </div>
      <input
        value={when}
        onChange={(e) => setWhen(e.target.value)}
        placeholder={t("whenPlaceholder")}
        className="mb-4 h-12 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <label className="mb-1.5 block text-sm font-medium text-foreground">{t("doseLabel")}</label>
      <div className="mb-6 flex gap-2">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="0.25"
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

      <button
        type="button"
        disabled={!when.trim() || !amount.trim()}
        onClick={() => onFinish(when.trim(), amount.trim(), unit)}
        className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97 disabled:opacity-50"
      >
        {t("finish")}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {t("configuringProtocol", { peptide: peptideName || t("yourPeptideFallback") })}
      </p>
    </motion.div>
  );
}
