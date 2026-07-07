"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { Reveal } from "@/components/app/Reveal";
import { CURRENCY, type Locale } from "@/i18n/routing";

const PLAN_KEYS = ["free", "premium", "family"] as const;
const PRICES: Record<(typeof PLAN_KEYS)[number], { monthly: number; yearly: number | null }> = {
  free: { monthly: 0, yearly: null },
  premium: { monthly: 9, yearly: 84 },
  family: { monthly: 19, yearly: 180 },
};
const FEATURE_COUNTS: Record<(typeof PLAN_KEYS)[number], number> = { free: 4, premium: 6, family: 4 };

function formatMoney(n: number) {
  return Number.isInteger(n) ? `${n}` : n.toFixed(2);
}

export function Pricing() {
  const t = useTranslations("Pricing");
  const locale = useLocale() as Locale;
  const { symbol } = CURRENCY[locale];
  const [period, setPeriod] = useState<"mensual" | "anual">("mensual");

  const plans = PLAN_KEYS.map((key) => {
    const price = PRICES[key];
    const monthlyEquivalent = price.yearly !== null ? price.yearly / 12 : null;
    const showYearly = period === "anual" && monthlyEquivalent !== null;
    const displayMonthly = showYearly ? monthlyEquivalent! : price.monthly;
    const dailyPrice = displayMonthly / 30;
    const discountPercent =
      showYearly && price.monthly > 0
        ? Math.round((1 - monthlyEquivalent! / price.monthly) * 100)
        : null;

    return {
      key,
      name: t(`${key}Name`),
      tagline: t(`${key}Tagline`),
      cta: t(`${key}Cta`),
      priceLabel: key === "free" ? `${symbol}0` : `${symbol}${formatMoney(displayMonthly)}`,
      period: key === "free" ? t("always") : t("perMonth"),
      dailyLabel:
        key === "free" ? null : t("perDay", { price: `${symbol}${dailyPrice.toFixed(2)}` }),
      savingsLabel:
        discountPercent !== null && discountPercent > 0
          ? t("yearlySavings", { percent: discountPercent })
          : null,
      billedYearlyLabel:
        showYearly && price.yearly !== null
          ? t("billedYearly", { price: `${symbol}${price.yearly}` })
          : null,
      features: Array.from({ length: FEATURE_COUNTS[key] }, (_, i) => t(`${key}Feature${i + 1}`)),
      featured: key === "premium",
    };
  });

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-center text-muted-foreground">
            {t("subtitle")}
          </p>

          <div className="mx-auto mt-5 flex w-fit rounded-full bg-secondary p-1">
            <button
              type="button"
              onClick={() => setPeriod("mensual")}
              className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
                period === "mensual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t("monthly")}
            </button>
            <button
              type="button"
              onClick={() => setPeriod("anual")}
              className={`h-9 rounded-full px-4 text-sm font-medium transition-colors ${
                period === "anual" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t("yearly")} <span className="text-primary">{t("yearlyBadge")}</span>
            </button>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {plans.map((plan, i) => (
            <Reveal key={plan.key} delay={i * 0.06}>
              <div
                className={`flex h-full flex-col rounded-xl border p-6 ${
                  plan.featured ? "border-primary bg-accent shadow-md" : "border-border bg-card"
                }`}
              >
                {plan.featured && (
                  <span className="mb-3 w-fit rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                    {t("mostChosen")}
                  </span>
                )}
                <p className="font-display text-lg font-bold text-foreground">{plan.name}</p>
                <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                <p className="mt-2 tabular">
                  <span className="font-display text-3xl font-extrabold text-foreground">
                    {plan.priceLabel}
                  </span>
                  <span className="text-sm text-muted-foreground"> {plan.period}</span>
                </p>
                {plan.dailyLabel && (
                  <p className="tabular text-xs text-muted-foreground">{plan.dailyLabel}</p>
                )}
                {plan.savingsLabel && (
                  <p className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {plan.savingsLabel}
                  </p>
                )}
                {plan.billedYearlyLabel && (
                  <p className="text-xs text-muted-foreground">{plan.billedYearlyLabel}</p>
                )}
                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`mt-6 inline-flex h-11 items-center justify-center rounded-lg text-sm font-semibold transition-transform active:scale-97 ${
                    plan.featured
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("footnote")}
          <br />
          {t("footnoteCancel")}
        </p>
      </div>
    </section>
  );
}
