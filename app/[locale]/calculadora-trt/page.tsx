import type { Metadata } from "next";
import { getLocalizedPath } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Activity } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { TrtDoseTool } from "@/components/app/calculator/TrtDoseTool";
import { ToolCta, ToolDisclaimer, ToolFaq, ToolCrossLinks, JsonLd } from "@/components/app/calculator/ToolPieces";

const BASE = "https://peptibrain.com";
const PATH = "/calculadora-trt";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Trt" });
  const canonical = locale === "es" ? `${BASE}${PATH}` : `${BASE}/en${getLocalizedPath(PATH, locale)}`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: { es: `${BASE}${PATH}`, en: `${BASE}/en${getLocalizedPath(PATH, "en")}` },
    },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), url: canonical, type: "website" },
  };
}

export default async function TrtCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Trt" });
  const faq = t.raw("faq") as { q: string; a: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url: locale === "es" ? `${BASE}${PATH}` : `${BASE}/${locale}${PATH}`,
    applicationCategory: "HealthApplication",
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
        <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Activity className="size-4" aria-hidden /> {t("kicker")}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("h1")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("subtitle")}</p>

          <div className="mt-8">
            <TrtDoseTool />
          </div>

          <ToolFaq items={faq} />
          <ToolDisclaimer />
          <ToolCta />
          <ToolCrossLinks current="trt" />
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
      <JsonLd data={faqLd} />
    </>
  );
}
