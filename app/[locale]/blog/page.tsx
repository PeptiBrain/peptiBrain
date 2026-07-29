import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Link } from "@/i18n/navigation";
import { BLOG_POSTS, localized, getPostImagePath } from "@/lib/blog/posts";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { ArticleHero } from "@/components/app/blog/ArticleHero";
import { BlogGrid } from "@/components/app/blog/BlogGrid";

const BASE = "https://peptibrain.com";
const POSTS_PER_PAGE = 12;

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
    pageLabel: (n: number, total: number) => `Página ${n} de ${total}`,
    prev: "Anterior",
    next: "Siguiente",
    searchPlaceholder: "Buscar en el blog…",
    allCategories: "Todas",
    noResults: "No encontramos artículos con esa búsqueda o categoría.",
    clearFilters: "Quitar filtros",
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
    pageLabel: (n: number, total: number) => `Page ${n} of ${total}`,
    prev: "Previous",
    next: "Next",
    searchPlaceholder: "Search the blog…",
    allCategories: "All",
    noResults: "No articles match that search or category.",
    clearFilters: "Clear filters",
  },
};

// Más recientes primero — BLOG_POSTS está ordenado por fecha ascendente en el
// registro (el orden en que se escribieron), pero un blog se lee del más
// nuevo al más viejo.
const SORTED_POSTS = [...BLOG_POSTS].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

function parsePage(raw: string | undefined, totalPages: number): number {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, totalPages);
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { page: rawPage } = await searchParams;
  const s = locale === "en" ? STRINGS.en : STRINGS.es;
  const path = "/blog";
  const url = locale === "en" ? `${BASE}/en${path}` : `${BASE}${path}`;
  const totalPages = Math.max(1, Math.ceil(SORTED_POSTS.length / POSTS_PER_PAGE));
  const page = parsePage(rawPage, totalPages);
  const title = page > 1 ? `${s.title} — ${s.pageLabel(page, totalPages)}` : s.title;
  return {
    title,
    description: s.description,
    // Página 2+ apunta su canonical a sí misma (no a la página 1) para que
    // Google indexe cada página de listado por separado, no las trate como duplicadas.
    alternates: {
      canonical: page > 1 ? `${url}?page=${page}` : url,
      languages: { es: `${BASE}${path}`, en: `${BASE}/en${path}` },
    },
    openGraph: { title, description: s.description, url, type: "website" },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: rawPage } = await searchParams;
  const safeLocale = locale === "en" ? "en" : "es";
  setRequestLocale(safeLocale);
  const s = STRINGS[safeLocale];

  const totalPages = Math.max(1, Math.ceil(SORTED_POSTS.length / POSTS_PER_PAGE));
  const page = parsePage(rawPage, totalPages);
  const start = (page - 1) * POSTS_PER_PAGE;
  const pagePosts = SORTED_POSTS.slice(start, start + POSTS_PER_PAGE);
  const categories = Array.from(new Set(BLOG_POSTS.map((p) => localized(p.category, safeLocale))));

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: s.title,
    url: `${BASE}/blog`,
    inLanguage: safeLocale,
    blogPost: SORTED_POSTS.map((p) => ({
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

          <BlogGrid
            locale={safeLocale}
            categories={categories}
            searchPlaceholder={s.searchPlaceholder}
            allLabel={s.allCategories}
            noResultsLabel={s.noResults}
            clearLabel={s.clearFilters}
          >
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pagePosts.map((post) => {
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

          {totalPages > 1 && (
            <nav aria-label="Paginación del blog" className="mt-10 flex items-center justify-center gap-2">
              <Link
                href={page > 1 ? { pathname: "/blog", query: { page: page - 1 } } : "/blog"}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
                className={`flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-semibold transition-colors ${
                  page <= 1
                    ? "pointer-events-none opacity-40"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <ChevronLeft className="size-4" aria-hidden /> {s.prev}
              </Link>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <Link
                    key={n}
                    href={n === 1 ? "/blog" : { pathname: "/blog", query: { page: n } }}
                    aria-current={n === page ? "page" : undefined}
                    className={`flex size-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                      n === page
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {n}
                  </Link>
                ))}
              </div>

              <Link
                href={page < totalPages ? { pathname: "/blog", query: { page: page + 1 } } : "/blog"}
                aria-disabled={page >= totalPages}
                tabIndex={page >= totalPages ? -1 : undefined}
                className={`flex h-10 items-center gap-1 rounded-lg border border-border px-3 text-sm font-semibold transition-colors ${
                  page >= totalPages
                    ? "pointer-events-none opacity-40"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {s.next} <ChevronRight className="size-4" aria-hidden />
              </Link>
            </nav>
          )}
          </BlogGrid>
        </div>
      </main>
      <Footer />
      <JsonLd data={blogLd} />
    </>
  );
}
