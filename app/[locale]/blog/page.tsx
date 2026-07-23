import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Clock } from "lucide-react";
import { Header } from "@/components/app/Header";
import { Footer } from "@/components/app/Footer";
import { Link } from "@/i18n/navigation";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { JsonLd } from "@/components/app/calculator/ToolPieces";
import { ArticleHero } from "@/components/app/blog/ArticleHero";

const BASE = "https://peptibrain.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "es") return {};
  const url = `${BASE}/blog`;
  const title = "Blog de PeptiBrain — Guías sobre péptidos";
  const description =
    "Guías claras y educativas sobre péptidos: cómo reconstituir, cómo calcular dosis, semaglutida, BPC-157, GHK-Cu y más.";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "es") notFound();
  setRequestLocale(locale);

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de PeptiBrain",
    url: `${BASE}/blog`,
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${BASE}/blog/${p.slug}`,
      datePublished: p.publishedAt,
    })),
  };

  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Blog</p>
          <h1 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Guías sobre péptidos
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Contenido educativo y claro sobre péptidos: cómo se calculan las dosis, cómo se reconstituyen y qué
            dice la investigación sobre los más usados. No es consejo médico.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
              >
                <div className="p-3 pb-0">
                  <ArticleHero icon={post.icon} category={post.category} compact />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{post.category}</p>
                  <h2 className="mt-0.5 font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden /> {post.readingMinutes} min de lectura
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <JsonLd data={blogLd} />
    </>
  );
}
