import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Users } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { LegalPage } from "@/components/app/legal/LegalPage";

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

export default async function QuienesSomosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "QuienesSomos" });

  return (
    <>
      <Header />
      <LegalPage
        icon={Users}
        title={t("title")}
        updated={t("updated")}
        intro={t("intro")}
        sections={t.raw("sections")}
        backHome={t("backHome")}
      />
      <Footer />
    </>
  );
}
