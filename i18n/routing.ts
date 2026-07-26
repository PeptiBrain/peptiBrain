import { defineRouting } from "next-intl/routing";

// Español = idioma por defecto (sin prefijo /es en la URL) — el mercado LATAM/España es el
// principal. Inglés queda en /en/... (bueno para SEO: cada idioma tiene su propia URL indexable).
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

// Moneda de los PRECIOS QUE COBRAMOS (paywall, planes, oferta de por vida).
// Aquí sí tiene sentido que siga al idioma: son ofertas distintas en Hotmart.
export const CURRENCY: Record<(typeof routing.locales)[number], { symbol: string; code: string }> = {
  es: { symbol: "€", code: "EUR" },
  en: { symbol: "$", code: "USD" },
};

// Moneda del DINERO QUE EL USUARIO REGISTRÓ (lo que gastó en sus viales).
// NO sigue al idioma: si alguien anotó que gastó 50, cambiar la app a inglés no
// puede convertirlo en 50 de otra divisa — es el mismo dinero, y mostrarlo con
// otro símbolo falsea su historial de gasto (bug #60 del QA).
// Pendiente a futuro: una moneda por usuario elegida al registrarse; hoy no
// existe ese campo, así que se fija la del mercado principal.
export const USER_DATA_CURRENCY = { symbol: "€", code: "EUR" } as const;

export type Locale = (typeof routing.locales)[number];
