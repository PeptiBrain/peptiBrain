"use client";

import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroPanel } from "@/components/app/landing/HeroPanel";

export function Hero() {
  const reduce = useReducedMotion();
  const t = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-16 sm:pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--primary) 35%, transparent) 0%, transparent 70%)",
        }}
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {t("eyebrow")}
          </span>
          <h1 className="mt-4 text-balance font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            {t("titleLine1")} <span className="text-primary">{t("titleHighlight")}</span>
          </h1>
          <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" aria-hidden /> {t("trustLine")}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              {t("ctaPrimary")} <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 text-base font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {t("ctaSecondary")}
            </Link>
          </div>
          <ul className="mt-6 space-y-1.5 text-sm text-muted-foreground">
            <li>✓ {t("bullet1")}</li>
            <li>✓ {t("bullet2")}</li>
            <li>✓ {t("bullet3")}</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full justify-center lg:justify-end"
        >
          <HeroPanel />
        </motion.div>
      </div>
    </section>
  );
}
