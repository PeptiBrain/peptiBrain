"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { track } from "@/lib/mixpanel";
import { hotmartLifetimeCheckoutUrl } from "@/lib/hotmart-links";

const LIFETIME_PRICE = process.env.NEXT_PUBLIC_LIFETIME_PRICE || "99";

export function LifetimeOfferCard({ email }: { email?: string }) {
  const t = useTranslations("Paywall");
  const [slots, setSlots] = useState<{ remaining: number; total: number } | null>(null);

  useEffect(() => {
    fetch("/api/lifetime-slots")
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch(() => setSlots(null));
  }, []);

  const checkoutUrl = hotmartLifetimeCheckoutUrl(email);
  if (!checkoutUrl) return null; // sin oferta configurada en Hotmart, no se muestra nada
  if (slots && slots.remaining <= 0) return null; // cupos agotados

  function handleClick() {
    track("lifetime_offer_clicked");
  }

  return (
    <div className="mb-4 rounded-xl border-2 border-primary bg-accent p-4">
      <div className="flex items-center gap-1.5">
        <Sparkles className="size-4 text-primary" aria-hidden />
        <span className="text-xs font-bold tracking-wide text-primary uppercase">
          {t("lifetimeOfferBadge")}
        </span>
      </div>
      <p className="mt-1.5 font-display text-lg font-bold text-foreground">
        {t("lifetimeOfferTitle", { price: LIFETIME_PRICE })}
      </p>
      <p className="mt-0.5 text-sm text-accent-foreground">{t("lifetimeOfferBody")}</p>
      {slots && (
        <p className="mt-1 text-xs font-medium text-primary">
          {t("lifetimeSlotsRemaining", { remaining: slots.remaining, total: slots.total })}
        </p>
      )}
      <a
        href={checkoutUrl}
        onClick={handleClick}
        className="mt-3 flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
      >
        {t("lifetimeOfferCta")}
      </a>
    </div>
  );
}
