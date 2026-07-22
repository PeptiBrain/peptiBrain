import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Syringe } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { GlpDoseCalculator } from "@/components/app/calculator/GlpDoseCalculator";
import { ToolCta, ToolDisclaimer, ToolFaq, ToolCrossLinks, JsonLd } from "@/components/app/calculator/ToolPieces";

const BASE = "https://peptibrain.com";
const PATH = "/calculadora-semaglutida";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Semaglutida" });
  const canonical = locale === "es" ? `${BASE}${PATH}` : `${BASE}/${locale}${PATH}`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: { es: `${BASE}${PATH}`, en: `${BASE}/en${PATH}` },
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: canonical, type: "website" },
  };
}

export default async function SemaglutidaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Semaglutida" });
  const faq = t.raw("faq") as { q: string; a: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("metaTitle"),
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    description: t("metaDescription"),
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Syringe className="size-4" aria-hidden /> {t("kicker")}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("h1")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("subtitle")}</p>

          <div className="mt-6">
            <GlpDoseCalculator />
          </div>

          <section className="mt-10">
            <h2 className="font-display text-xl font-bold text-foreground">{t("howTitle")}</h2>
            <ol className="mt-4 space-y-3">
              {(t.raw("howSteps") as string[]).map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <ToolFaq items={faq} />
          <ToolDisclaimer />
          <ToolCta />
          <ToolCrossLinks current="sema" />
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
      <JsonLd data={faqLd} />
    </>
  );
}
