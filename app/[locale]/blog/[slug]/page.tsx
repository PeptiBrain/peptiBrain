import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArticleLayout } from "@/components/app/blog/ArticleLayout";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog/posts";

const BASE = "https://peptibrain.com";

// Cuerpo de cada artículo — mapa slug -> componente. Contenido en español por
// ahora (el usuario decidió empezar solo en es; inglés queda para más adelante).
const CONTENT: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "que-son-los-peptidos": () => import("@/components/app/blog/posts/que-son-los-peptidos"),
  "como-reconstituir-un-peptido": () => import("@/components/app/blog/posts/como-reconstituir-un-peptido"),
  "semaglutida-como-funciona-y-como-se-calcula-la-dosis": () =>
    import("@/components/app/blog/posts/semaglutida-como-funciona-y-como-se-calcula-la-dosis"),
  "bpc-157-que-es-y-para-que-se-usa": () => import("@/components/app/blog/posts/bpc-157-que-es-y-para-que-se-usa"),
  "ghk-cu-el-peptido-de-la-piel": () => import("@/components/app/blog/posts/ghk-cu-el-peptido-de-la-piel"),
  "errores-comunes-al-empezar-con-peptidos": () =>
    import("@/components/app/blog/posts/errores-comunes-al-empezar-con-peptidos"),
  "mejores-apps-de-peptidos": () => import("@/components/app/blog/posts/mejores-apps-de-peptidos"),
  "peptidos-populares": () => import("@/components/app/blog/posts/peptidos-populares"),
  "peptidos-segun-tu-objetivo": () => import("@/components/app/blog/posts/peptidos-segun-tu-objetivo"),
  "como-se-usan-los-peptidos": () => import("@/components/app/blog/posts/como-se-usan-los-peptidos"),
  "como-almacenar-tus-peptidos": () => import("@/components/app/blog/posts/como-almacenar-tus-peptidos"),
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const url = `${BASE}/blog/${slug}`;
  return {
    title: `${post.title} | Blog de PeptiBrain`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.excerpt, url, type: "article" },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  // El blog SOLO existe en español por ahora. Si alguien llega por /en/blog/... (por
  // ejemplo un enlace compartido, o el país detectado fuerza inglés), NUNCA mostramos
  // un 404 — mostramos el contenido en español (mejor eso que un error para el visitante).
  setRequestLocale("es");

  const post = getBlogPost(slug);
  const loader = CONTENT[slug];
  if (!post || !loader) notFound();

  const { default: Content } = await loader();

  return (
    <ArticleLayout post={post}>
      <Content />
    </ArticleLayout>
  );
}
