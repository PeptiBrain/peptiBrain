import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/app/Reveal";
import { CURRENCY, type Locale } from "@/i18n/routing";

export function Faq() {
  const t = useTranslations("Faq");
  const locale = useLocale() as Locale;
  const symbol = CURRENCY[locale].symbol;

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
    { q: t("q5"), a: t("a5", { premium: `${symbol}9`, family: `${symbol}19` }) },
  ];

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <Accordion className="mt-8 rounded-xl border border-border bg-card px-5">
            {faqs.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-foreground">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
