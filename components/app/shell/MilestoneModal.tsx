"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Mascot } from "@/components/app/shell/Mascot";
import { MILESTONE_CELEBRATION_EVENT, type MilestoneCelebration } from "@/lib/celebrate";

// Escucha celebrateMilestone() (7/30/100/365 días de racha) y muestra a Pepti
// celebrando con un mensaje que crece en intensidad según el hito.
export function MilestoneModal() {
  const t = useTranslations("Milestones");
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    function onCelebrate(e: Event) {
      const detail = (e as CustomEvent<MilestoneCelebration>).detail;
      setMilestone(detail.milestone);
    }
    window.addEventListener(MILESTONE_CELEBRATION_EVENT, onCelebrate);
    return () => window.removeEventListener(MILESTONE_CELEBRATION_EVENT, onCelebrate);
  }, []);

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setMilestone(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 18, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-xs flex-col items-center rounded-3xl bg-card p-6 text-center shadow-2xl"
          >
            <Mascot state="celebrating" size={140} />
            <p className="mt-4 font-display text-2xl font-bold text-foreground">
              {t("title", { days: milestone })}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t(`body_${milestone}` as never)}
            </p>
            <button
              type="button"
              onClick={() => setMilestone(null)}
              className="mt-5 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              {t("cta")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
