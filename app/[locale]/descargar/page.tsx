"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Share, Smartphone, ArrowRight } from "lucide-react";

export default function DescargarPage() {
  const t = useTranslations("Descargar");

  return (
    <main className="flex flex-1 flex-col px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-sm text-center"
      >
        <Image
          src="/peptibrain-isotipo.svg"
          alt=""
          width={64}
          height={64}
          className="mx-auto"
          priority
        />
        <h1 className="mt-4 text-balance font-display text-2xl font-bold leading-tight text-foreground">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>

        <div className="mt-8 space-y-6 text-left">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Share className="size-4 text-primary" aria-hidden />
              <p className="font-display text-base font-bold text-foreground">{t("iosTitle")}</p>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {[t("iosStep1"), t("iosStep2"), t("iosStep3"), t("iosStep4")].map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Smartphone className="size-4 text-primary" aria-hidden />
              <p className="font-display text-base font-bold text-foreground">{t("androidTitle")}</p>
            </div>
            <ol className="space-y-2 text-sm text-muted-foreground">
              {[t("androidStep1"), t("androidStep2"), t("androidStep3"), t("androidStep4")].map(
                (step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                )
              )}
            </ol>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97"
        >
          {t("cta")} <ArrowRight className="size-4" aria-hidden />
        </Link>
      </motion.div>
    </main>
  );
}
