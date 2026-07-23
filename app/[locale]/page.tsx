import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Hero } from "@/components/app/landing/Hero";
import { Benefits } from "@/components/app/landing/Benefits";
import { FreeTools } from "@/components/app/landing/FreeTools";
import { PeptideLibrary } from "@/components/app/landing/PeptideLibrary";
import { HowItWorks } from "@/components/app/landing/HowItWorks";
import { Pricing } from "@/components/app/landing/Pricing";
import { Testimonials } from "@/components/app/landing/Testimonials";
import { Faq } from "@/components/app/landing/Faq";
import { BlogHighlights } from "@/components/app/landing/BlogHighlights";
import { FinalCta } from "@/components/app/landing/FinalCta";
import { UtmCapture } from "@/components/app/UtmCapture";
import { JsonLd } from "@/components/app/calculator/ToolPieces";

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
    "App web (español e inglés) para calcular dosis de péptidos y llevar el seguimiento de tu protocolo: viales, dosis, recordatorios, bienestar y progreso. Incluye calculadoras gratuitas de reconstitución y de semaglutida/tirzepatida. Contenido educativo, no es consejo médico.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PeptiBrain",
  url: "https://peptibrain.com",
  logo: "https://peptibrain.com/peptibrain-isotipo.svg",
  sameAs: ["https://www.instagram.com/peptibrain/", "https://www.tiktok.com/@peptibrainapp"],
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <>
      <JsonLd data={APP_SCHEMA} />
      <JsonLd data={ORG_SCHEMA} />
      <UtmCapture />
      <Header />
      <main id="main-content" className="flex-1">
        <Hero />
        <Benefits />
        <HowItWorks />
        <Pricing />
        <Testimonials />
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
