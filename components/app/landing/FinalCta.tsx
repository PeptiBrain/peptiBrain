import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/app/Reveal";

export function FinalCta() {
  const t = useTranslations("FinalCta");

  return (
    <section className="px-4 py-16">
      <Reveal>
        <div className="mx-auto max-w-2xl rounded-2xl bg-foreground px-6 py-12 text-center">
          <h2 className="text-balance font-display text-2xl font-bold tracking-tight text-background sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-background/70">{t("subtitle")}</p>
          <Link
            href="/login"
            className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-base font-semibold text-primary-foreground transition-transform active:scale-97"
          >
            {t("cta")} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
