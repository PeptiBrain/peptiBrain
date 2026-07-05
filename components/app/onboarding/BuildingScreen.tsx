"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

export function BuildingScreen({
  peptideName,
  doseWhen,
  onDone,
}: {
  peptideName: string;
  doseWhen: string;
  onDone: () => void;
}) {
  const t = useTranslations("Onboarding");
  const lines = [
    t("buildingSavingPeptide", { peptide: peptideName || t("yourPeptideFallback") }),
    t("buildingCalculating"),
    t("buildingScheduling", { when: doseWhen || t("soonFallback") }),
    t("buildingPreparing"),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [percent, setPercent] = useState(8);

  useEffect(() => {
    const stepMs = 900;
    const timers: ReturnType<typeof setTimeout>[] = [];
    lines.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setActiveIndex(i + 1);
          setPercent(Math.round(((i + 1) / lines.length) * 100));
        }, stepMs * (i + 1))
      );
    });
    timers.push(setTimeout(onDone, stepMs * lines.length + 500));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-4 py-6"
      aria-live="polite"
      aria-busy={activeIndex < lines.length}
    >
      <div className="relative mb-6 flex size-28 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--secondary)" strokeWidth="9" />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 42}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percent / 100) }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <span className="tabular font-display text-2xl font-bold text-foreground">{percent}%</span>
      </div>

      <h1 className="mb-6 text-balance font-display text-xl font-bold text-foreground">{t("buildingTitle")}</h1>

      <ul className="w-full space-y-3">
        {lines.map((line, i) => (
          <li
            key={line}
            className={`flex items-center gap-2 text-sm transition-opacity ${
              i < activeIndex
                ? "text-foreground"
                : i === activeIndex
                  ? "text-foreground"
                  : "text-muted-foreground/40"
            }`}
          >
            {i < activeIndex ? (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" aria-hidden />
              </span>
            ) : i === activeIndex ? (
              <span className="size-5 shrink-0 animate-pulse rounded-full border-2 border-primary" />
            ) : (
              <span className="size-5 shrink-0 rounded-full border-2 border-border" />
            )}
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
