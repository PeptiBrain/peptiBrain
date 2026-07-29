"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { BLOG_POSTS, localized, getPostImagePath } from "@/lib/blog/posts";
import { ArticleHero } from "@/components/app/blog/ArticleHero";

// Envuelve la grilla+paginación ya renderizada por el servidor (children,
// sin JS, buena para SEO) y le agrega buscador + chips de categoría por
// encima. Mientras no hay filtro activo se muestra el `children` del
// servidor tal cual; en cuanto hay texto o categoría, este componente toma
// el control y renderiza su propia lista filtrada (mismo patrón que
// PeptideLibraryGrid en /protocolos).
export function BlogGrid({
  locale,
  categories,
  searchPlaceholder,
  allLabel,
  noResultsLabel,
  clearLabel,
  children,
}: {
  locale: "es" | "en";
  categories: string[];
  searchPlaceholder: string;
  allLabel: string;
  noResultsLabel: string;
  clearLabel: string;
  children: ReactNode;
}) {
  // Semilla inicial desde ?q= en la URL — así un chip de etiqueta en un
  // artículo (/blog?q=BPC-157) llega aquí ya filtrado, sin más JS que esto.
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtering = query.trim() !== "" || activeCategory !== "all";

  const filtered = useMemo(() => {
    if (!filtering) return [];
    const q = query.trim().toLowerCase();
    return [...BLOG_POSTS]
      .filter((p) => {
        const cat = localized(p.category, locale);
        const matchesCategory = activeCategory === "all" || cat === activeCategory;
        const matchesQuery =
          !q ||
          localized(p.title, locale).toLowerCase().includes(q) ||
          localized(p.excerpt, locale).toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }, [query, activeCategory, filtering, locale]);

  return (
    <div>
      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-9 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={clearLabel}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterPill active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
          {allLabel}
        </FilterPill>
        {categories.map((cat) => (
          <FilterPill key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
            {cat}
          </FilterPill>
        ))}
      </div>

      {!filtering ? (
        children
      ) : filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center">
          <p className="text-sm text-muted-foreground">{noResultsLabel}</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCategory("all");
            }}
            className="mt-3 inline-flex h-9 items-center rounded-full border border-border px-4 text-xs font-semibold text-foreground hover:bg-secondary"
          >
            {clearLabel}
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => {
            const category = localized(post.category, locale);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
              >
                <div className="p-3 pb-0">
                  <ArticleHero icon={post.icon} category={category} image={getPostImagePath(post.slug)} compact />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{category}</p>
                  <h2 className="mt-0.5 font-display text-base font-bold text-foreground transition-colors group-hover:text-primary">
                    {localized(post.title, locale)}
                  </h2>
                  <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{localized(post.excerpt, locale)}</p>
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden />{" "}
                    {locale === "en" ? `${post.readingMinutes} min read` : `${post.readingMinutes} min de lectura`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 shrink-0 whitespace-nowrap rounded-full border px-3.5 text-xs font-semibold transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
