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
import { hotmartCheckoutUrl } from "@/lib/hotmart-links";
import { LifetimeOfferCard } from "@/components/app/paywall/LifetimeOfferCard";
import { useLocale } from "next-intl";
import { CURRENCY, type Locale } from "@/i18n/routing";

const YEARLY_PRICES = { premium: 84, family: 180 } as const;

function formatMoney(n: number) {
  return Number.isInteger(n) ? `${n}` : n.toFixed(2);
}

export default function PaywallPage() {
  const router = useRouter();
  const t = useTranslations("Paywall");
  const tCat = useTranslations("PeptideCategories");
  const locale = useLocale() as Locale;
  const { symbol } = CURRENCY[locale];
  const [data, setData] = useState<OnboardingData | null>(null);
  const [selected, setSelected] = useState<"gratis" | "premium" | "family">("premium");
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  const MONTHLY_PRICES = { gratis: 0, premium: 9, family: 19 } as const;

  const TRANSLATION_KEY = { gratis: "free", premium: "premium", family: "family" } as const;

  const PLANS = (["gratis", "premium", "family"] as const).map((id) => {
    const key = TRANSLATION_KEY[id];
    const monthly = MONTHLY_PRICES[id];
    const yearly = id !== "gratis" ? YEARLY_PRICES[id as "premium" | "family"] : null;
    const monthlyEquivalent = yearly !== null ? yearly / 12 : null;
    const showYearly = period === "yearly" && monthlyEquivalent !== null;
    const displayMonthly = showYearly ? monthlyEquivalent! : monthly;
    const dailyPrice = displayMonthly / 30;
    const discountPercent =
      showYearly && monthly > 0 ? Math.round((1 - monthlyEquivalent! / monthly) * 100) : null;

    return {
      id,
      name: t(`${key}Name`),
      price: id === "gratis" ? "$0" : `${symbol}${formatMoney(displayMonthly)}`,
      period: id === "gratis" ? t("freePeriod") : t("perMonthLabel"),
      dailyLabel: id === "gratis" ? null : t("perDayLabel", { price: `${symbol}${dailyPrice.toFixed(2)}` }),
      savingsLabel:
        discountPercent !== null && discountPercent > 0
          ? t("yearlySavingsLabel", { percent: discountPercent })
          : null,
      features: [t(`${key}Feature1`), t(`${key}Feature2`), t(`${key}Feature3`)],
      recommended: id === "premium",
    };
  });

  useEffect(() => {
    setData(loadOnboarding());
    track("paywall_viewed");
  }, []);

  if (!data) return null;

  function choose(planId: "gratis" | "premium" | "family") {
    track("plan_selected", { plan: planId, period });
    if (planId === "gratis") {
      saveOnboarding({ plan: planId });
      router.push("/app");
      return;
    }
    window.location.href = hotmartCheckoutUrl(planId, period, data?.email);
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
        <p className="mt-1 text-sm text-muted-foreground">
          {data.goal ? t("madeWithAnswersGoal", { goal: tCat(data.goal) }) : t("madeWithAnswers")}
        </p>

        <div className="mt-4">
          <LifetimeOfferCard email={data.email} />
        </div>

        <div className="mt-5 rounded-xl border border-border bg-card p-4">
          {[t("value1"), t("value2"), t("value3")].map((f) => (
            <div key={f} className="flex items-start gap-2 py-1 text-sm text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              {f}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-5 flex w-fit rounded-full bg-secondary p-1">
          <button
            type="button"
            onClick={() => setPeriod("monthly")}
            className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
              period === "monthly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t("monthlyToggle")}
          </button>
          <button
            type="button"
            onClick={() => setPeriod("yearly")}
            className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
              period === "yearly" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t("yearlyToggle")}
          </button>
        </div>

        <div className="mt-4 space-y-3">
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
              {plan.dailyLabel && (
                <p className="tabular mt-0.5 text-xs text-muted-foreground">{plan.dailyLabel}</p>
              )}
              {plan.savingsLabel && (
                <p className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {plan.savingsLabel}
                </p>
              )}
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
