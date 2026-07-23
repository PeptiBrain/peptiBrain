import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { BLOG_POSTS } from "@/lib/blog/posts";

const BASE_URL = "https://peptibrain.com";

// Solo páginas públicas de marketing/legales — nada bajo /app (requiere sesión),
// ni /onboarding ni /restablecer-password (páginas funcionales, no de contenido).
const PUBLIC_PATHS = [
  "",
  "/calculadora",
  "/calculadora-semaglutida",
  "/comparador",
  "/protocolos",
  "/ideas",
  "/login",
  "/paywall",
  "/descargar",
  "/terminos",
  "/privacidad",
  "/aviso-legal",
  "/cookies",
  "/reembolsos",
  "/blog",
];

function localizedPath(path: string, locale: string) {
  if (locale === routing.defaultLocale) return `${BASE_URL}${path || "/"}`;
  return `${BASE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = PUBLIC_PATHS.map((path) => ({
    url: localizedPath(path, routing.defaultLocale),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((locale) => [locale, localizedPath(path, locale)])),
    },
  }));

  // El blog ya es bilingüe (es/en) — cada artículo con sus alternates de idioma.
  const blogPages = BLOG_POSTS.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, localizedPath(`/blog/${p.slug}`, locale)])
      ),
    },
  }));

  return [...publicPages, ...blogPages];
}
