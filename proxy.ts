import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse, type NextRequest } from "next/server";

// Rutas llamadas por servidores de confianza (Hotmart, el cron de Vercel), nunca
// por un visitante directo — no tiene sentido limitarles la tasa de peticiones.
function isTrustedServerRoute(pathname: string): boolean {
  return pathname === "/api/webhooks/hotmart" || pathname.startsWith("/api/cron/");
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

// Países donde el inglés es el idioma esperado — todo lo demás cae en español (LATAM/España,
// el mercado principal). Vercel manda gratis el país real del visitante en esta cabecera
// (`x-vercel-ip-country`) cuando la app corre desplegada ahí; en local/otros hosts no llega,
// y se usa el idioma del navegador como respaldo (comportamiento por defecto de next-intl).
const ENGLISH_SPEAKING_COUNTRIES = new Set([
  "US",
  "GB",
  "CA",
  "AU",
  "NZ",
  "IE",
  "ZA",
]);

const handleI18nRouting = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isTrustedServerRoute(pathname)) {
    const { blocked, retryAfterSeconds } = await checkRateLimit(getClientIp(request));
    if (blocked) {
      return new NextResponse("Too Many Requests — inténtalo de nuevo en unos minutos.", {
        status: 429,
        headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
      });
    }
  }

  // Las rutas de API manejan su propia respuesta — el enrutamiento por idioma de
  // abajo es solo para páginas, no tiene sentido reescribirlo sobre /api.
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Si el visitante ya eligió idioma a mano (o next-intl ya lo detectó antes), no lo pisamos.
  if (!request.cookies.get("NEXT_LOCALE")) {
    const country = request.headers.get("x-vercel-ip-country");
    if (country) {
      const detected = ENGLISH_SPEAKING_COUNTRIES.has(country) ? "en" : "es";
      // Fuerza la negociación por idioma de next-intl hacia el resultado detectado por país.
      request.headers.set("accept-language", detected);
    }
  }
  const intlResponse = handleI18nRouting(request);
  return updateSession(request, intlResponse);
}

export const config = {
  // Excluye _next/_vercel, archivos con extensión (sitemap.xml, robots.txt…) y las
  // rutas de imágenes de metadatos de Next (opengraph-image/twitter-image) — si el
  // middleware de idiomas las tocara, romperían la vista previa al compartir enlaces.
  matcher: ["/((?!_next|_vercel|opengraph-image|twitter-image|.*\\..*).*)"],
};
