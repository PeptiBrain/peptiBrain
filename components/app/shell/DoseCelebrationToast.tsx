"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { DOSE_CELEBRATION_EVENT, type DoseCelebration } from "@/lib/celebrate";

// Escucha el evento que dispara celebrateDoseLogged() y muestra un aviso con el
// progreso acumulado (adherencia en positivo, dosis totales, peso). Se cierra solo.
export function DoseCelebrationToast() {
  const t = useTranslations("DoseToast");
  const [celebration, setCelebration] = useState<DoseCelebration | null>(null);

  useEffect(() => {
    function onCelebrate(e: Event) {
      const detail = (e as CustomEvent<DoseCelebration>).detail;
      setCelebration(detail);
      const timer = setTimeout(() => setCelebration(null), 4000);
      return () => clearTimeout(timer);
    }
    window.addEventListener(DOSE_CELEBRATION_EVENT, onCelebrate);
    return () => window.removeEventListener(DOSE_CELEBRATION_EVENT, onCelebrate);
  }, []);

  const parts: string[] = [];
  if (celebration) {
    parts.push(t("doses", { count: celebration.totalDoses }));
    if (celebration.adherencePct != null) parts.push(t("adherence", { pct: celebration.adherencePct }));
    if (celebration.weightDeltaKg != null && celebration.weightDeltaKg !== 0) {
      const sign = celebration.weightDeltaKg > 0 ? "+" : "";
      parts.push(t("weight", { delta: `${sign}${celebration.weightDeltaKg}` }));
    }
  }

  return (
    <AnimatePresence>
      {celebration && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-24 z-50 mx-auto flex w-[min(22rem,calc(100vw-2rem))] items-center gap-3 rounded-2xl border border-primary/20 bg-card p-4 shadow-xl"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{t("title")}</p>
            <p className="truncate text-xs text-muted-foreground">{parts.join(" · ")}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
