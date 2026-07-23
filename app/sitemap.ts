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
  "/protocolos",
  "/login",
  "/paywall",
  "/descargar",
  "/terminos",
  "/privacidad",
  "/aviso-legal",
  "/cookies",
  "/reembolsos",
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

  // El blog es solo en español por ahora — sin alternates de idioma (no hay /en
  // todavía) para no señalar una variante que no existe.
  const blogPages = ["/blog", ...BLOG_POSTS.map((p) => `/blog/${p.slug}`)].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  return [...publicPages, ...blogPages];
}
