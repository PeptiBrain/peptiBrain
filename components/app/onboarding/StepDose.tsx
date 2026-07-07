"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { CalendarClock } from "lucide-react";
import type { Locale } from "@/i18n/routing";

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatLabel(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

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
  const locale = useLocale() as Locale;
  const [whenInput, setWhenInput] = useState("");
  const [amount, setAmount] = useState(initialAmount);
  const [unit, setUnit] = useState(initialUnit || "mg");

  function setQuick(minutesFromNow?: number, atHour?: number) {
    const d = new Date();
    if (minutesFromNow !== undefined) {
      d.setMinutes(d.getMinutes() + minutesFromNow);
    } else if (atHour !== undefined) {
      d.setDate(d.getDate() + 1);
      d.setHours(atHour, 0, 0, 0);
    }
    setWhenInput(toLocalInputValue(d));
  }

  const QUICK = [
    { label: t("in1Hour"), action: () => setQuick(60) },
    { label: t("tomorrow8am"), action: () => setQuick(undefined, 8) },
    { label: t("tomorrow8pm"), action: () => setQuick(undefined, 20) },
  ];

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
      <input
        type="datetime-local"
        value={whenInput}
        onChange={(e) => setWhenInput(e.target.value)}
        className="mb-3 h-12 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button
            key={q.label}
            type="button"
            onClick={q.action}
            className="h-9 rounded-full border border-border bg-card px-3 text-sm font-medium text-foreground transition-colors active:scale-97"
          >
            {q.label}
          </button>
        ))}
      </div>

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
        disabled={!whenInput.trim() || !amount.trim()}
        onClick={() => onFinish(formatLabel(whenInput, locale), amount.trim(), unit)}
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
