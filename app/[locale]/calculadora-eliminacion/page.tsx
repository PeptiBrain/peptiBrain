import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { ClearanceTool } from "@/components/app/calculator/ClearanceTool";
import { ToolCta, ToolDisclaimer, ToolFaq, ToolCrossLinks, JsonLd } from "@/components/app/calculator/ToolPieces";

const BASE = "https://peptibrain.com";
const PATH = "/calculadora-eliminacion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Eliminacion" });
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

export default async function EliminacionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Eliminacion" });
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
            <Clock className="size-4" aria-hidden /> {t("kicker")}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("h1")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("subtitle")}</p>

          <div className="mt-8">
            <ClearanceTool />
          </div>

          <ToolFaq items={faq} />
          <ToolDisclaimer />
          <ToolCta />
          <ToolCrossLinks current="eliminacion" />
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
      <JsonLd data={faqLd} />
    </>
  );
}
