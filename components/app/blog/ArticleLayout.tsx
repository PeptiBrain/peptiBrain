import type { ReactNode } from "react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Clock, ChevronRight } from "lucide-react";
import { ArticleHero } from "@/components/app/blog/ArticleHero";
import { BlogCtaBanner } from "@/components/app/blog/BlogCtaBanner";
import { NewsletterSignup } from "@/components/app/blog/NewsletterSignup";
import { ToolDisclaimer, ToolCrossLinks, JsonLd } from "@/components/app/calculator/ToolPieces";
import { BLOG_POSTS, localized, localizedTags, getPostImagePath, getSlugForLocale, type BlogPost } from "@/lib/blog/posts";

const BASE = "https://peptibrain.com";

const STRINGS = {
  es: { readMinutes: (n: number) => `${n} min de lectura`, keepReading: "Sigue leyendo", home: "Inicio" },
  en: { readMinutes: (n: number) => `${n} min read`, keepReading: "Keep reading", home: "Home" },
};

// Chrome compartido de cada artículo del blog: cabecera, ilustración, meta,
// aviso médico, CTA a la app, enlaces cruzados a calculadoras/otros artículos
// y datos estructurados Article (schema.org) para SEO/GEO.
export function ArticleLayout({ post, locale, children }: { post: BlogPost; locale: string; children: ReactNode }) {
  const s = locale === "en" ? STRINGS.en : STRINGS.es;
  const title = localized(post.title, locale);
  const excerpt = localized(post.excerpt, locale);
  const category = localized(post.category, locale);

  const dateLabel = new Date(`${post.publishedAt}T00:00:00`).toLocaleDateString(locale === "en" ? "en-US" : "es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  const tags = localizedTags(post.tags, locale);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: post.publishedAt,
    dateModified: post.reviewedAt || post.publishedAt,
    inLanguage: locale,
    author: { "@type": "Organization", name: "PeptiBrain" },
    publisher: { "@type": "Organization", name: "PeptiBrain", logo: `${BASE}/peptibrain-isotipo.svg` },
    mainEntityOfPage: `${BASE}${locale === "en" ? "/en" : ""}/blog/${getSlugForLocale(post, locale)}`,
  };

  const localePrefix = locale === "en" ? "/en" : "";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "en" ? "Home" : "Inicio", item: `${BASE}${localePrefix}` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}${localePrefix}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${BASE}${localePrefix}/blog/${getSlugForLocale(post, locale)}`,
      },
    ],
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
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="max-w-[220px] truncate font-medium text-foreground" aria-current="page">
              {title}
            </span>
          </nav>

          <Link
            href="/blog"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden /> Blog
          </Link>

          <div className="mt-4">
            <ArticleHero
              icon={post.icon}
              category={category}
              image={getPostImagePath(post.slug)}
              useLogo={post.coverIsLogo}
            />
          </div>

          <h1 className="mt-6 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{dateLabel}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden /> {s.readMinutes(post.readingMinutes)}
            </span>
          </div>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={{ pathname: "/blog", query: { q: tag } }}
                  className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/70"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <article className="mt-2">{children}</article>

          <ToolDisclaimer />
          <BlogCtaBanner locale={locale} />
          <ToolCrossLinks current="calc" />

          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-lg font-bold text-foreground">{s.keepReading}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${getSlugForLocale(p, locale)}`}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <p.icon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-semibold text-foreground">
                      {localized(p.title, locale)}
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10">
            <NewsletterSignup />
          </div>
        </div>
      </main>
      <Footer />
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
    </>
  );
}
