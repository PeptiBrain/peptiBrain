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
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://${supabaseHost()} https://www.google-analytics.com https://www.googletagmanager.com`,
  "font-src 'self' data:",
  `connect-src 'self' https://${supabaseHost()} https://api.mixpanel.com https://api-js.mixpanel.com https://challenges.cloudflare.com https://www.google-analytics.com https://www.googletagmanager.com https://region1.google-analytics.com`,
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
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
