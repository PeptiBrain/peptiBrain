import { defineRouting } from "next-intl/routing";

// Español = idioma por defecto (sin prefijo /es en la URL) — el mercado LATAM/España es el
// principal. Inglés queda en /en/... (bueno para SEO: cada idioma tiene su propia URL indexable).
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

// Páginas públicas de marketing/herramientas cuya URL en inglés antes reusaba
// el mismo segmento en español (ej. /en/calculadora-semaglutida) — un lector en
// inglés veía una URL en español, y Google no tenía tan claro que esa página
// está en inglés. Este mapa se usa a mano (con getLocalizedPath, más abajo)
// SOLO en los puntos donde el código enlaza a estas páginas — decisión
// deliberada de NO usar el `pathnames` de next-intl: esa función retipa
// GLOBALMENTE cada `Link` de la app a una unión cerrada de rutas, lo que
// rompió 141 usos en 81 archivos (incluidas rutas internas autenticadas como
// /app/peptidos o /app/estadisticas, que no tienen nada que ver con SEO) —
// demasiado riesgo para una app en producción por un beneficio cosmético en
// ~15 páginas. Solo se listan las rutas públicas indexables — las de sesión
// (/login, /onboarding, /panel, /paywall, /restablecer-password, /app/*) no
// las indexa Google y no necesitan una URL en inglés separada.
export const LOCALIZED_PATHS: Record<string, { es: string; en: string }> = {
  "/herramientas": { es: "/herramientas", en: "/tools" },
  "/calculadora": { es: "/calculadora", en: "/reconstitution-calculator" },
  "/calculadora-semaglutida": { es: "/calculadora-semaglutida", en: "/semaglutide-calculator" },
  "/comparador": { es: "/comparador", en: "/peptide-comparator" },
  "/compatibilidad": { es: "/compatibilidad", en: "/stack-compatibility" },
  "/calculadora-eliminacion": { es: "/calculadora-eliminacion", en: "/clearance-calculator" },
  "/calculadora-costo-mg": { es: "/calculadora-costo-mg", en: "/cost-per-mg-calculator" },
  "/calculadora-trt": { es: "/calculadora-trt", en: "/trt-calculator" },
  "/quiz-trt": { es: "/quiz-trt", en: "/trt-quiz" },
  "/protocolos": { es: "/protocolos", en: "/protocols" },
  "/descargar": { es: "/descargar", en: "/download" },
  "/terminos": { es: "/terminos", en: "/terms" },
  "/privacidad": { es: "/privacidad", en: "/privacy" },
  "/aviso-legal": { es: "/aviso-legal", en: "/legal-notice" },
  "/quienes-somos": { es: "/quienes-somos", en: "/about-us" },
  "/reembolsos": { es: "/reembolsos", en: "/refunds" },
};

// `canonicalPath` es siempre la ruta en español (ej. "/calculadora-semaglutida"),
// tal como ya está escrita en el código — para inglés devuelve la ruta traducida
// si existe en el mapa; si no, devuelve la misma (rutas que no necesitan cambiar,
// como /cookies o /ideas, que son la misma palabra en los dos idiomas).
export function getLocalizedPath(canonicalPath: string, locale: string): string {
  if (locale !== "en") return canonicalPath;
  return LOCALIZED_PATHS[canonicalPath]?.en || canonicalPath;
}

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
