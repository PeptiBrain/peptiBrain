"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";

export function OnboardingProgress({
  percent,
  onBack,
  showBack,
  onSkip,
}: {
  percent: number;
  onBack?: () => void;
  showBack: boolean;
  onSkip?: () => void;
}) {
  const t = useTranslations("Onboarding");
  return (
    <div className="sticky top-0 z-10 bg-background/95 px-4 pt-4 pb-3 backdrop-blur">
      <div className="mx-auto flex max-w-sm items-center gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label={t("back")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
        ) : (
          <Link
            href="/"
            aria-label={t("backHome")}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <Image src="/peptibrain-isotipo.svg" alt="" width={20} height={20} />
          </Link>
        )}
        <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "8%" }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <span className="w-9 shrink-0 tabular text-right text-xs text-muted-foreground">
          {percent}%
        </span>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="shrink-0 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {t("skip")}
          </button>
        )}
      </div>
    </div>
  );
}
