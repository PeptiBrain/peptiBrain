import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Hero } from "@/components/app/landing/Hero";
import { Benefits } from "@/components/app/landing/Benefits";
import { FreeTools } from "@/components/app/landing/FreeTools";
import { PeptideLibrary } from "@/components/app/landing/PeptideLibrary";
import { HowItWorks } from "@/components/app/landing/HowItWorks";
import { Pricing } from "@/components/app/landing/Pricing";
import { Testimonials } from "@/components/app/landing/Testimonials";
import { WhatItIs } from "@/components/app/landing/WhatItIs";
import { Faq } from "@/components/app/landing/Faq";
import { BlogHighlights } from "@/components/app/landing/BlogHighlights";
import { FinalCta } from "@/components/app/landing/FinalCta";
import { UtmCapture } from "@/components/app/UtmCapture";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { CURRENCY, type Locale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

// Datos estructurados de entidad (GEO): ayudan a que buscadores y LLMs entiendan
// QUÉ es PeptiBrain y puedan citarlo/recomendarlo. Descripción factual y quotable.
const APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PeptiBrain",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://peptibrain.com",
  inLanguage: ["es", "en"],
  description:
    "App web (español e inglés) para calcular dosis de GLP-1, péptidos y terapia de reemplazo de testosterona (TRT), y llevar el seguimiento de tu protocolo: viales, dosis, recordatorios, bienestar y progreso. Incluye calculadoras gratuitas de reconstitución y de semaglutida/tirzepatida. Contenido educativo, no es consejo médico.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PeptiBrain",
  url: "https://peptibrain.com",
  logo: "https://peptibrain.com/peptibrain-isotipo.svg",
  sameAs: ["https://www.instagram.com/peptibrain/", "https://www.tiktok.com/@peptibrainapp"],
};

// FAQPage (rich results + AEO): la landing tenía el FAQ visible pero sin datos
// estructurados — la calculadora y el comparador sí los tenían, esta pantalla
// (la que más tráfico de marca recibe) no.
async function buildFaqLd(locale: string) {
  const t = await getTranslations({ locale, namespace: "Faq" });
  const symbol = CURRENCY[locale as Locale].symbol;
  const pairs = [
    ["q1", "a1"], ["q2", "a2"], ["q3", "a3"], ["q4", "a4"],
  ] as const;
  const faqs = pairs.map(([q, a]) => ({ q: t(q), a: t(a) }));
  faqs.push({ q: t("q5"), a: t("a5", { premium: `${symbol}9`, family: `${symbol}19` }) });
  for (const k of ["q6", "q7", "q8", "q9", "q10"] as const) {
    const aKey = `a${k.slice(1)}` as const;
    faqs.push({ q: t(k), a: t(aKey) });
  }
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const faqLd = await buildFaqLd(locale);
  return (
    <>
      <JsonLd data={APP_SCHEMA} />
      <JsonLd data={ORG_SCHEMA} />
      <JsonLd data={faqLd} />
      <UtmCapture />
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <WhatItIs />
        <Faq />
        <FreeTools />
        <PeptideLibrary />
        <BlogHighlights locale={locale} />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
