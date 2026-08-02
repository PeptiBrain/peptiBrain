import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Único dominio real de la app — CORS solo lo permite a él, nunca a "*".
const SITE_ORIGIN = "https://peptibrain.com";

// El host de Supabase se calcula desde la propia env var (nunca hardcodeado a mano)
// para que la política de seguridad no se desactualice si cambia el proyecto.
function supabaseHost(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").host;
  } catch {
    return "";
  }
}

// Content-Security-Policy: solo permite cargar/conectar con lo que la app REALMENTE
// usa — Supabase (datos+fotos), Mixpanel (analítica), Cloudflare Turnstile (captcha
// del login/registro). 'unsafe-inline' en script/style es la única concesión: Next.js
// necesita un pequeño script inline para el modo oscuro sin parpadeo, y Tailwind usa
// estilos inline en algunos componentes — eliminarlo del todo requeriría un sistema
// de nonces por petición, fuera de alcance de este ajuste.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${supabaseHost()} https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms`,
  "font-src 'self' data:",
  `connect-src 'self' https://${supabaseHost()} https://api.mixpanel.com https://api-js.mixpanel.com https://challenges.cloudflare.com https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com https://*.clarity.ms https://c.bing.com`,
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Las URLs en inglés del blog reusaban el slug en español (bug de SEO/UX real:
// un lector en inglés veía "/en/blog/como-se-usan-los-peptidos" en la barra de
// direcciones). Ahora cada artículo tiene su propio slug en inglés — estas
// redirecciones 301 evitan romper cualquier link ya compartido o ya indexado
// por Google con la URL vieja.
const EN_BLOG_SLUG_REDIRECTS: Array<[string, string]> = [
  ["que-es-peptibrain", "what-is-peptibrain"],
  ["que-son-los-peptidos", "what-are-peptides"],
  ["como-reconstituir-un-peptido", "how-to-reconstitute-a-peptide"],
  ["semaglutida-como-funciona-y-como-se-calcula-la-dosis", "semaglutide-how-it-works-and-dose-calculation"],
  ["bpc-157-que-es-y-para-que-se-usa", "bpc-157-what-it-is-and-what-its-used-for"],
  ["ghk-cu-el-peptido-de-la-piel", "ghk-cu-the-skin-peptide"],
  ["errores-comunes-al-empezar-con-peptidos", "common-mistakes-starting-with-peptides"],
  ["mejores-apps-de-peptidos", "best-peptide-apps"],
  ["peptidos-populares", "popular-peptides"],
  ["peptidos-segun-tu-objetivo", "peptides-by-goal"],
  ["como-se-usan-los-peptidos", "how-peptides-are-used"],
  ["como-almacenar-tus-peptidos", "how-to-store-your-peptides"],
  ["preguntas-frecuentes-sobre-peptidos", "peptides-faq"],
  ["como-registrar-tus-dosis-de-glp1", "how-to-track-your-glp1-doses"],
  ["como-registrar-tus-dosis-de-trt", "how-to-track-your-trt-doses"],
  ["compatibilidad-de-stacks-como-usarla", "stack-compatibility-calculator"],
  ["calculadora-de-reconstitucion-como-usarla", "reconstitution-calculator"],
  ["calculadora-de-semaglutida-como-usarla", "semaglutide-tirzepatide-calculator"],
  ["comparador-de-peptidos-como-usarlo", "peptide-comparator"],
  ["calculadora-de-eliminacion-como-usarla", "clearance-calculator"],
  ["calculadora-de-costo-por-mg-como-usarla", "cost-per-mg-calculator"],
  ["calculadora-de-dosis-de-glp1", "glp1-dose-calculator"],
  ["como-calcular-la-dosis-de-un-peptido", "how-to-calculate-a-peptide-dose"],
  ["mejores-herramientas-para-registrar-peptidos", "best-tools-to-track-peptides"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return EN_BLOG_SLUG_REDIRECTS.map(([oldSlug, newSlug]) => ({
      source: `/en/blog/${oldSlug}`,
      destination: `/en/blog/${newSlug}`,
      permanent: true,
    }));
  },
  async headers() {
    return [
      {
        // Cabeceras de seguridad en TODA la app (páginas y API).
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: CSP },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // CORS de las rutas de API: solo el dominio real de PeptiBrain puede llamarlas
        // desde el navegador (Hotmart/Vercel Cron llaman servidor-a-servidor, sin CORS).
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: SITE_ORIGIN },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
