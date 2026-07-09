"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Target } from "lucide-react";
import { PEPTIDE_CATEGORY_IDS, type PeptideCategoryId } from "@/lib/peptide-profiles";

export function GoalStep({
  initialGoal,
  onContinue,
}: {
  initialGoal: string;
  onContinue: (goal: PeptideCategoryId) => void;
}) {
  const t = useTranslations("Onboarding");
  const tCat = useTranslations("PeptideCategories");

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
          <Target className="size-5 text-primary" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t("goalEyebrow")}
          </p>
          <h1 className="text-balance font-display text-2xl font-bold leading-tight text-foreground">
            {t("goalTitle")}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PEPTIDE_CATEGORY_IDS.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onContinue(category)}
            className={`h-16 rounded-xl border px-3 text-left text-sm font-medium transition-colors active:scale-97 ${
              initialGoal === category
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground hover:border-primary/50"
            }`}
          >
            {tCat(category)}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
