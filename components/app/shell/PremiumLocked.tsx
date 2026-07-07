"use client";

import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function PremiumLocked({ description }: { description: string }) {
  const t = useTranslations("Premium");

  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center">
      <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-secondary">
        <Lock className="size-5 text-muted-foreground" aria-hidden />
      </div>
      <p className="text-sm font-semibold text-foreground">{t("title")}</p>
      <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
      <Link
        href="/paywall"
        className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
