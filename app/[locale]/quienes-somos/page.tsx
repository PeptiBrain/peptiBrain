import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronRight, Users } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import ContentEs from "@/components/app/quienes-somos/ContentEs";
import ContentEn from "@/components/app/quienes-somos/ContentEn";

const BASE = "https://peptibrain.com";
const PATH = "/quienes-somos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "QuienesSomos" });
  const canonical = locale === "es" ? `${BASE}${PATH}` : `${BASE}/${locale}${PATH}`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical,
      languages: { es: `${BASE}${PATH}`, en: `${BASE}/en${PATH}` },
    },
  };
}

const STRINGS = {
  es: { home: "Inicio", label: "Quiénes somos" },
  en: { home: "Home", label: "About us" },
};

export default async function QuienesSomosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "QuienesSomos" });
  const s = locale === "en" ? STRINGS.en : STRINGS.es;
  const localePrefix = locale === "en" ? "/en" : "";

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: s.home, item: `${BASE}${localePrefix}` },
      { "@type": "ListItem", position: 2, name: s.label, item: `${BASE}${localePrefix}${PATH}` },
    ],
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PeptiBrain",
    url: BASE,
    logo: `${BASE}/peptibrain-isotipo.svg`,
    email: "hello@peptibrain.com",
    parentOrganization: {
      "@type": "Organization",
      name: "Digital Dreams World LLC",
      address: {
        "@type": "PostalAddress",
        streetAddress: "2105 Vista Oeste NW Suite E 3564",
        addressLocality: "Albuquerque",
        addressRegion: "NM",
        postalCode: "87120",
        addressCountry: "US",
      },
    },
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              {s.home}
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="max-w-[220px] truncate font-medium text-foreground" aria-current="page">
              {s.label}
            </span>
          </nav>

          <div className="mt-6 flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
              <Users className="size-6 text-primary" aria-hidden />
            </div>
            <h1 className="mt-3 text-balance font-display text-2xl font-bold text-foreground sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">{t("updated")}</p>
          </div>

          <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>

          <article className="mt-2">{locale === "en" ? <ContentEn /> : <ContentEs />}</article>

          <Link
            href="/"
            className="mx-auto mt-10 flex h-11 w-fit items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            {t("backHome")}
          </Link>
        </div>
      </main>
      <Footer />
      <JsonLd data={organizationLd} />
      <JsonLd data={breadcrumbLd} />
    </>
  );
}
