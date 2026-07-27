import { defineRouting } from "next-intl/routing";

// Español = idioma por defecto (sin prefijo /es en la URL) — el mercado LATAM/España es el
// principal. Inglés queda en /en/... (bueno para SEO: cada idioma tiene su propia URL indexable).
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

// Moneda de los PRECIOS QUE COBRAMOS (paywall, planes, oferta de por vida).
//
// USD en los dos idiomas porque es lo que Hotmart cobra de verdad: los planes
// están configurados en dólares (USD$ 9,00 Premium, USD$ 19,00 Family). Antes
// la versión en español anunciaba "9 €" y al cliente le llegaba un cargo de 9
// USD (~8 €): ni el importe ni la divisa coincidían con lo prometido.
//
// Si algún día se crean ofertas en euros en Hotmart, este mapa vuelve a tener
// sentido por idioma — pero los números tienen que salir de Hotmart, no de aquí.
export const CURRENCY: Record<(typeof routing.locales)[number], { symbol: string; code: string }> = {
  es: { symbol: "$", code: "USD" },
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
