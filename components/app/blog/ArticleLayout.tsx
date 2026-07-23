import type { ReactNode } from "react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { ArticleHero } from "@/components/app/blog/ArticleHero";
import { BlogCtaBanner } from "@/components/app/blog/BlogCtaBanner";
import { ToolDisclaimer, ToolCrossLinks, JsonLd } from "@/components/app/calculator/ToolPieces";
import { BLOG_POSTS, localized, getPostImagePath, type BlogPost } from "@/lib/blog/posts";

const BASE = "https://peptibrain.com";

const STRINGS = {
  es: { readMinutes: (n: number) => `${n} min de lectura`, keepReading: "Sigue leyendo" },
  en: { readMinutes: (n: number) => `${n} min read`, keepReading: "Keep reading" },
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

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: post.publishedAt,
    inLanguage: locale,
    author: { "@type": "Organization", name: "PeptiBrain" },
    publisher: { "@type": "Organization", name: "PeptiBrain", logo: `${BASE}/peptibrain-isotipo.svg` },
    mainEntityOfPage: `${BASE}${locale === "en" ? "/en" : ""}/blog/${post.slug}`,
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden /> Blog
          </Link>

          <div className="mt-4">
            <ArticleHero icon={post.icon} category={category} image={getPostImagePath(post.slug)} />
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
                    href={`/blog/${p.slug}`}
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
        </div>
      </main>
      <Footer />
      <JsonLd data={articleLd} />
    </>
  );
}
