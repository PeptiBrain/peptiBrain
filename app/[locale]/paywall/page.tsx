"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import { loadOnboarding, saveOnboarding, type OnboardingData } from "@/lib/onboarding";
import { track } from "@/lib/mixpanel";

export default function PaywallPage() {
  const router = useRouter();
  const t = useTranslations("Paywall");
  const [data, setData] = useState<OnboardingData | null>(null);
  const [selected, setSelected] = useState<"gratis" | "premium" | "family">("premium");

  const PLANS = [
    {
      id: "gratis" as const,
      name: t("freeName"),
      price: "$0",
      period: t("freePeriod"),
      features: [t("freeFeature1"), t("freeFeature2"), t("freeFeature3")],
    },
    {
      id: "premium" as const,
      name: t("premiumName"),
      price: "$9",
      period: t("premiumPeriod"),
      features: [t("premiumFeature1"), t("premiumFeature2"), t("premiumFeature3")],
      recommended: true,
    },
    {
      id: "family" as const,
      name: t("familyName"),
      price: "$19",
      period: t("familyPeriod"),
      features: [t("familyFeature1"), t("familyFeature2"), t("familyFeature3")],
    },
  ];

  useEffect(() => {
    setData(loadOnboarding());
    track("paywall_viewed");
  }, []);

  if (!data) return null;

  function choose(planId: "gratis" | "premium" | "family") {
    saveOnboarding({ plan: planId });
    track("plan_selected", { plan: planId });
    router.push("/app");
  }

  return (
    <main className="flex flex-1 flex-col px-4 pt-4 pb-8">
      <div className="mx-auto flex w-full max-w-sm items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/peptibrain-isotipo.svg" alt="" width={24} height={24} />
        </Link>
        <Link
          href="/app"
          aria-label={t("closeAria")}
          className="flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
        >
          <X className="size-5" aria-hidden />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-4 w-full max-w-sm"
      >
        <h1 className="text-balance font-display text-2xl font-bold leading-tight text-foreground">
          {t("protocolReady", { peptide: data.peptideName || t("peptidesFallback") })}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("madeWithAnswers")}</p>

        <div className="mt-5 rounded-xl border border-border bg-card p-4">
          {[t("value1"), t("value2"), t("value3")].map((f) => (
            <div key={f} className="flex items-start gap-2 py-1 text-sm text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {f}
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelected(plan.id)}
              className={`relative w-full rounded-xl border p-4 text-left transition-colors ${
                selected === plan.id
                  ? "border-primary bg-accent"
                  : "border-border bg-card"
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  {t("mostPopular")}
                </span>
              )}
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-bold text-foreground">{plan.name}</span>
                <span className="tabular text-lg font-bold text-foreground">
                  {plan.price}
                  <span className="text-xs font-normal text-muted-foreground"> {plan.period}</span>
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-muted-foreground">
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => choose(selected)}
          className="mt-5 h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97"
        >
          {selected === "gratis" ? t("startFree") : t("choosePlan", { plan: selected === "premium" ? t("premiumName") : t("familyName") })}
        </button>
        {selected !== "gratis" && (
          <p className="mt-2 text-center text-xs text-muted-foreground">{t("simulatedNote")}</p>
        )}

        <button
          type="button"
          onClick={() => choose("gratis")}
          className="mx-auto mt-3 block text-sm text-muted-foreground underline-offset-2 hover:underline"
        >
          {t("notNow")}
        </button>
      </motion.div>
    </main>
  );
}
