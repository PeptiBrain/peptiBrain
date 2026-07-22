import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

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
  return PUBLIC_PATHS.map((path) => ({
    url: localizedPath(path, routing.defaultLocale),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((locale) => [locale, localizedPath(path, locale)])),
    },
  }));
}
