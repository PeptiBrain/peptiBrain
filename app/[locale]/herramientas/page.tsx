import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Wrench, Calculator, Syringe, Shuffle, ListChecks, Clock, Coins, ArrowRight } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/app/calculator/ToolPieces";

const BASE = "https://peptibrain.com";
const PATH = "/herramientas";

const TOOLS = [
  { href: "/calculadora", key: "calc" as const, icon: Calculator },
  { href: "/calculadora-semaglutida", key: "sema" as const, icon: Syringe },
  { href: "/comparador", key: "comparador" as const, icon: Shuffle },
  { href: "/protocolos", key: "protocolos" as const, icon: ListChecks },
  { href: "/calculadora-eliminacion", key: "eliminacion" as const, icon: Clock },
  { href: "/calculadora-costo-mg", key: "costomg" as const, icon: Coins },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Herramientas" });
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

export default async function HerramientasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Herramientas" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("h1"),
    itemListElement: TOOLS.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE}${locale === "es" ? "" : `/${locale}`}${tool.href}`,
      name: t(`${tool.key}Title`),
    })),
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Wrench className="size-4" aria-hidden /> {t("kicker")}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("h1")}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{t("subtitle")}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <tool.icon className="size-5" aria-hidden />
                  </span>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                    {t("freeTag")}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-lg font-bold text-foreground">{t(`${tool.key}Title`)}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`${tool.key}Desc`)}
                </p>
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">
                  {t("openCta")}{" "}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  );
}
