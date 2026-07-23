import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArticleLayout } from "@/components/app/blog/ArticleLayout";
import { BLOG_POSTS, getBlogPost, localized } from "@/lib/blog/posts";

const BASE = "https://peptibrain.com";
type Loader = () => Promise<{ default: React.ComponentType }>;

// Cuerpo de cada artículo — mapa slug -> idioma -> componente. Blog bilingüe (es/en).
const CONTENT: Record<string, { es: Loader; en: Loader }> = {
  "que-son-los-peptidos": {
    es: () => import("@/components/app/blog/posts/es/que-son-los-peptidos"),
    en: () => import("@/components/app/blog/posts/en/que-son-los-peptidos"),
  },
  "como-reconstituir-un-peptido": {
    es: () => import("@/components/app/blog/posts/es/como-reconstituir-un-peptido"),
    en: () => import("@/components/app/blog/posts/en/como-reconstituir-un-peptido"),
  },
  "semaglutida-como-funciona-y-como-se-calcula-la-dosis": {
    es: () => import("@/components/app/blog/posts/es/semaglutida-como-funciona-y-como-se-calcula-la-dosis"),
    en: () => import("@/components/app/blog/posts/en/semaglutida-como-funciona-y-como-se-calcula-la-dosis"),
  },
  "bpc-157-que-es-y-para-que-se-usa": {
    es: () => import("@/components/app/blog/posts/es/bpc-157-que-es-y-para-que-se-usa"),
    en: () => import("@/components/app/blog/posts/en/bpc-157-que-es-y-para-que-se-usa"),
  },
  "ghk-cu-el-peptido-de-la-piel": {
    es: () => import("@/components/app/blog/posts/es/ghk-cu-el-peptido-de-la-piel"),
    en: () => import("@/components/app/blog/posts/en/ghk-cu-el-peptido-de-la-piel"),
  },
  "errores-comunes-al-empezar-con-peptidos": {
    es: () => import("@/components/app/blog/posts/es/errores-comunes-al-empezar-con-peptidos"),
    en: () => import("@/components/app/blog/posts/en/errores-comunes-al-empezar-con-peptidos"),
  },
  "mejores-apps-de-peptidos": {
    es: () => import("@/components/app/blog/posts/es/mejores-apps-de-peptidos"),
    en: () => import("@/components/app/blog/posts/en/mejores-apps-de-peptidos"),
  },
  "peptidos-populares": {
    es: () => import("@/components/app/blog/posts/es/peptidos-populares"),
    en: () => import("@/components/app/blog/posts/en/peptidos-populares"),
  },
  "peptidos-segun-tu-objetivo": {
    es: () => import("@/components/app/blog/posts/es/peptidos-segun-tu-objetivo"),
    en: () => import("@/components/app/blog/posts/en/peptidos-segun-tu-objetivo"),
  },
  "como-se-usan-los-peptidos": {
    es: () => import("@/components/app/blog/posts/es/como-se-usan-los-peptidos"),
    en: () => import("@/components/app/blog/posts/en/como-se-usan-los-peptidos"),
  },
  "como-almacenar-tus-peptidos": {
    es: () => import("@/components/app/blog/posts/es/como-almacenar-tus-peptidos"),
    en: () => import("@/components/app/blog/posts/en/como-almacenar-tus-peptidos"),
  },
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const title = localized(post.title, locale);
  const description = localized(post.excerpt, locale);
  const path = `/blog/${slug}`;
  const url = locale === "en" ? `${BASE}/en${path}` : `${BASE}${path}`;
  return {
    title: `${title} | Blog de PeptiBrain`,
    description,
    alternates: { canonical: url, languages: { es: `${BASE}${path}`, en: `${BASE}/en${path}` } },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const safeLocale = locale === "en" ? "en" : "es";
  setRequestLocale(safeLocale);

  const post = getBlogPost(slug);
  const entry = CONTENT[slug];
  if (!post || !entry) notFound();

  const { default: Content } = await entry[safeLocale]();

  return (
    <ArticleLayout post={post} locale={safeLocale}>
      <Content />
    </ArticleLayout>
  );
}
