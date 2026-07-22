import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ListChecks, ArrowRight } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Link } from "@/i18n/navigation";
import { PEPTIDE_PROFILES, PEPTIDE_CATEGORY_IDS, type PeptideCategoryId } from "@/lib/peptide-profiles";
import { getPeptideBottleImage } from "@/lib/vial-visual";
import Image from "next/image";
import { ToolCta, ToolDisclaimer, ToolFaq, ToolCrossLinks, JsonLd } from "@/components/app/calculator/ToolPieces";

const BASE = "https://peptibrain.com";
const PATH = "/protocolos";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Protocolos" });
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

export default async function ProtocolosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Protocolos" });
  const tc = await getTranslations({ locale, namespace: "PeptideCategories" });
  const faq = t.raw("faq") as { q: string; a: string }[];

  // Agrupa los perfiles por su categoría principal (la primera).
  const byCategory = PEPTIDE_CATEGORY_IDS.map((cat) => ({
    cat,
    label: tc(cat),
    items: PEPTIDE_PROFILES.filter((p) => p.categories[0] === cat),
  })).filter((g) => g.items.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url: locale === "es" ? `${BASE}${PATH}` : `${BASE}/${locale}${PATH}`,
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
            <ListChecks className="size-4" aria-hidden /> {t("kicker")}
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("h1")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("subtitle")}</p>

          <div className="mt-8 space-y-8">
            {byCategory.map((group) => (
              <section key={group.cat}>
                <h2 className="mb-3 font-display text-lg font-bold text-foreground">{group.label}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {group.items.map((p) => {
                    const calcHref = `/calculadora?vial=${encodeURIComponent(p.vialAmount)}&vialUnit=${encodeURIComponent(p.vialUnit)}&bac=${encodeURIComponent(p.bacWater)}&dose=${encodeURIComponent(p.commonDose)}&doseUnit=${encodeURIComponent(p.doseUnit)}`;
                    return (
                      <article key={p.name} className="flex flex-col rounded-2xl border border-border bg-card p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={getPeptideBottleImage(p.name)}
                            alt=""
                            width={28}
                            height={40}
                            className="h-10 w-auto shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="truncate font-display text-base font-bold text-foreground">{p.name}</h3>
                            <p className="text-xs text-muted-foreground">{p.route}</p>
                          </div>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {p.description}
                        </p>
                        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                          <Field label={t("fieldDose")} value={`${p.commonDose} ${p.doseUnit}`} />
                          <Field label={t("fieldFreq")} value={p.frequency} />
                          <Field label={t("fieldVial")} value={`${p.vialAmount} ${p.vialUnit}`} />
                          <Field label={t("fieldBac")} value={`${p.bacWater} mL`} />
                        </dl>
                        <Link
                          href={calcHref}
                          className="mt-3 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                        >
                          {t("calcCta")} <ArrowRight className="size-3.5" aria-hidden />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <ToolFaq items={faq} />
          <ToolDisclaimer />
          <ToolCta />
          <ToolCrossLinks current="protocolos" />
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
      <JsonLd data={faqLd} />
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
