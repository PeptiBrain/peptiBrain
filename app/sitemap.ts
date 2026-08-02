import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { BLOG_POSTS, getSlugForLocale } from "@/lib/blog/posts";

const BASE_URL = "https://peptibrain.com";

// Solo páginas públicas de marketing/legales — nada bajo /app (requiere sesión),
// ni /onboarding ni /restablecer-password (páginas funcionales, no de contenido).
// priority/changeFrequency reflejan qué tan seguido cambia cada tipo de página
// (no hay fecha real de última edición para páginas estáticas, así que no se
// inventa un lastModified falso para ellas — solo el blog tiene fecha real).
const PUBLIC_PATHS: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/herramientas", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
  { path: "/calculadora", priority: 0.8, changeFrequency: "monthly" },
  { path: "/calculadora-semaglutida", priority: 0.8, changeFrequency: "monthly" },
  { path: "/comparador", priority: 0.8, changeFrequency: "monthly" },
  { path: "/compatibilidad", priority: 0.8, changeFrequency: "monthly" },
  { path: "/calculadora-eliminacion", priority: 0.8, changeFrequency: "monthly" },
  { path: "/calculadora-costo-mg", priority: 0.8, changeFrequency: "monthly" },
  { path: "/calculadora-trt", priority: 0.8, changeFrequency: "monthly" },
  { path: "/quiz-trt", priority: 0.8, changeFrequency: "monthly" },
  { path: "/protocolos", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ideas", priority: 0.6, changeFrequency: "daily" },
  { path: "/login", priority: 0.5, changeFrequency: "monthly" },
  { path: "/paywall", priority: 0.5, changeFrequency: "monthly" },
  { path: "/descargar", priority: 0.5, changeFrequency: "monthly" },
  { path: "/terminos", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" },
  { path: "/aviso-legal", priority: 0.3, changeFrequency: "yearly" },
  { path: "/quienes-somos", priority: 0.5, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.3, changeFrequency: "yearly" },
  { path: "/reembolsos", priority: 0.3, changeFrequency: "yearly" },
];

function localizedPath(path: string, locale: string) {
  if (locale === routing.defaultLocale) return `${BASE_URL}${path || "/"}`;
  return `${BASE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: localizedPath(path, routing.defaultLocale),
    priority,
    changeFrequency,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((locale) => [locale, localizedPath(path, locale)])),
    },
  }));

  // El blog ya es bilingüe (es/en), con su propio slug por idioma (antes el
  // inglés reusaba el slug en español) — cada URL real es su propia entrada,
  // con alternates apuntando a la URL real de cada idioma, y la fecha real de
  // publicación (publishedAt), no una fecha inventada.
  const blogPages = BLOG_POSTS.flatMap((p) => {
    const lastModified = new Date(`${p.publishedAt}T00:00:00Z`);
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, localizedPath(`/blog/${getSlugForLocale(p, locale)}`, locale)])
    );
    return routing.locales.map((locale) => ({
      url: localizedPath(`/blog/${getSlugForLocale(p, locale)}`, locale),
      lastModified,
      priority: 0.7,
      changeFrequency: "monthly" as const,
      alternates: { languages },
    }));
  });

  return [...publicPages, ...blogPages];
}
