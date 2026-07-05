import { defineRouting } from "next-intl/routing";

// Español = idioma por defecto (sin prefijo /es en la URL) — el mercado LATAM/España es el
// principal. Inglés queda en /en/... (bueno para SEO: cada idioma tiene su propia URL indexable).
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

// Moneda que sigue al idioma (decisión del usuario): es → €, en → $
export const CURRENCY: Record<(typeof routing.locales)[number], { symbol: string; code: string }> = {
  es: { symbol: "€", code: "EUR" },
  en: { symbol: "$", code: "USD" },
};

export type Locale = (typeof routing.locales)[number];
