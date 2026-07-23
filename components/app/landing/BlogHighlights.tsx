import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/app/Reveal";
import { ArticleHero } from "@/components/app/blog/ArticleHero";
import { getBlogPost, localized, getPostImagePath } from "@/lib/blog/posts";

// Las 3 guías más potentes del blog (mayor pilar de demanda + comparativa que
// posiciona PeptiBrain para SEO/GEO). Blog bilingüe: se renderiza en ambos idiomas.
const HIGHLIGHT_SLUGS = [
  "semaglutida-como-funciona-y-como-se-calcula-la-dosis",
  "peptidos-segun-tu-objetivo",
  "mejores-apps-de-peptidos",
] as const;

const STRINGS = {
  es: {
    eyebrow: "Del blog",
    title: "Nuestras guías más completas",
    subtitle: "Contenido educativo y claro sobre péptidos, gratis y sin registro.",
    readMinutes: (n: number) => `${n} min de lectura`,
    seeAll: "Ver todo el blog",
  },
  en: {
    eyebrow: "From the blog",
    title: "Our most complete guides",
    subtitle: "Clear, educational content about peptides, free and with no signup.",
    readMinutes: (n: number) => `${n} min read`,
    seeAll: "See the whole blog",
  },
};

export function BlogHighlights({ locale }: { locale: string }) {
  const safeLocale = locale === "en" ? "en" : "es";
  const s = STRINGS[safeLocale];
  const posts = HIGHLIGHT_SLUGS.map(getBlogPost).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (posts.length === 0) return null;

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-primary">{s.eyebrow}</p>
          <h2 className="mx-auto mt-1 max-w-2xl text-balance text-center font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {s.title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-pretty text-center text-sm text-muted-foreground">
            {s.subtitle}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {posts.map((post, i) => {
            const category = localized(post.category, safeLocale);
            return (
              <Reveal key={post.slug} delay={i * 0.07}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
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
                    <h3 className="mt-0.5 font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                      {localized(post.title, safeLocale)}
                    </h3>
                    <p className="mt-1.5 flex-1 text-sm text-muted-foreground">
                      {localized(post.excerpt, safeLocale)}
                    </p>
                    <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3.5" aria-hidden /> {s.readMinutes(post.readingMinutes)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-97"
            >
              {s.seeAll} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
