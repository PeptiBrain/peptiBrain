"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Mascot } from "@/components/app/shell/Mascot";

export function WelcomeStep({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  const t = useTranslations("Onboarding");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-4 py-10 text-center"
    >
      <div className="mb-5">
        <Mascot state="waving" size={104} />
      </div>
      <h1 className="text-balance font-display text-2xl font-bold leading-tight text-foreground">
        {t("welcomeTitle")}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("welcomeBody")}</p>

      <button
        type="button"
        onClick={onStart}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97"
      >
        {t("welcomeStart")} <ArrowRight className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onSkip}
        className="mt-3 text-sm text-muted-foreground underline-offset-2 hover:underline"
      >
        {t("welcomeExploreAlone")}
      </button>
    </motion.div>
  );
}
