import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Clock } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Link } from "@/i18n/navigation";
import { BLOG_POSTS, localized, getPostImagePath } from "@/lib/blog/posts";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { ArticleHero } from "@/components/app/blog/ArticleHero";

const BASE = "https://peptibrain.com";

const STRINGS = {
  es: {
    title: "Blog de PeptiBrain — Guías sobre péptidos",
    description:
      "Guías claras y educativas sobre péptidos: cómo reconstituir, cómo calcular dosis, semaglutida, BPC-157, GHK-Cu y más.",
    eyebrow: "Blog",
    h1: "Guías sobre péptidos",
    subtitle:
      "Contenido educativo y claro sobre péptidos: cómo se calculan las dosis, cómo se reconstituyen y qué dice la investigación sobre los más usados. No es consejo médico.",
    readMinutes: (n: number) => `${n} min de lectura`,
  },
  en: {
    title: "PeptiBrain Blog — Peptide guides",
    description:
      "Clear, educational guides on peptides: how to reconstitute, how to calculate doses, semaglutide, BPC-157, GHK-Cu and more.",
    eyebrow: "Blog",
    h1: "Peptide guides",
    subtitle:
      "Clear, educational content about peptides: how doses are calculated, how they're reconstituted, and what the research says about the most used ones. Not medical advice.",
    readMinutes: (n: number) => `${n} min read`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const s = locale === "en" ? STRINGS.en : STRINGS.es;
  const path = "/blog";
  const url = locale === "en" ? `${BASE}/en${path}` : `${BASE}${path}`;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: url, languages: { es: `${BASE}${path}`, en: `${BASE}/en${path}` } },
    openGraph: { title: s.title, description: s.description, url, type: "website" },
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = locale === "en" ? "en" : "es";
  setRequestLocale(safeLocale);
  const s = STRINGS[safeLocale];

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: s.title,
    url: `${BASE}/blog`,
    inLanguage: safeLocale,
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: localized(p.title, safeLocale),
      url: `${BASE}/blog/${p.slug}`,
      datePublished: p.publishedAt,
    })),
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{s.eyebrow}</p>
          <h1 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {s.h1}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{s.subtitle}</p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => {
              const category = localized(post.category, safeLocale);
              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
                >
                  <div className="p-3 pb-0">
                    <ArticleHero
                      icon={post.icon}
                      category={category}
                      image={getPostImagePath(post.slug)}
                      compact
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{category}</p>
                    <h2 className="mt-0.5 font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {localized(post.title, safeLocale)}
                    </h2>
                    <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                      {localized(post.excerpt, safeLocale)}
                    </p>
                    <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3.5" aria-hidden /> {s.readMinutes(post.readingMinutes)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
      <JsonLd data={blogLd} />
    </>
  );
}
