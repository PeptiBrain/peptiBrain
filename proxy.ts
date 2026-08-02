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

// Bots que van a buscar la vista previa de un link (Threads, Facebook, WhatsApp,
// Twitter/X, LinkedIn, Telegram, Slack, Discord) casi siempre corren desde
// servidores en EE.UU. — con la detección por país de arriba, terminaban viendo
// SIEMPRE la versión en inglés (y esa vista previa en inglés es la que se
// guardaba/mostraba), sin importar el idioma real de la URL que se compartió.
// A los bots no se les debe redirigir nunca: tienen que ver exactamente el
// idioma que implica la URL que pidieron, igual que cualquier crawler de SEO.
const CRAWLER_USER_AGENTS = [
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "slackbot",
  "discordbot",
  "threadsbot",
  "pinterest",
  "redditbot",
  "googlebot",
  "bingbot",
  "applebot",
  "slurp",
  "yandex",
  "duckduckbot",
];

function isCrawlerBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((bot) => ua.includes(bot));
}

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

  const isBot = isCrawlerBot(request.headers.get("user-agent") || "");

  // Si el visitante ya eligió idioma a mano (o next-intl ya lo detectó antes), no lo pisamos.
  // A los bots nunca se les toca el idioma por país/navegador: deben ver siempre el
  // idioma exacto que implica la URL que pidieron (bug: Threads/Facebook mostraban
  // SIEMPRE la vista previa en inglés porque sus servidores pegan desde EE.UU.).
  if (!isBot && !request.cookies.get("NEXT_LOCALE")) {
    const country = request.headers.get("x-vercel-ip-country");
    if (country) {
      const detected = ENGLISH_SPEAKING_COUNTRIES.has(country) ? "en" : "es";
      // Fuerza la negociación por idioma de next-intl hacia el resultado detectado por país.
      request.headers.set("accept-language", detected);
    }
  } else if (isBot) {
    // Sin esto, el propio Accept-Language que manda el bot (a menudo "en-US" por
    // defecto) seguiría empujando a next-intl a redirigir a /en/... aunque la URL
    // pedida no tuviera prefijo. Sin cabecera que negociar, next-intl sirve el
    // idioma por defecto (es) tal cual lo pide la URL, sin redirigir a nadie.
    request.headers.delete("accept-language");
  }
  const intlResponse = handleI18nRouting(request);
  return updateSession(request, intlResponse);
}

export const config = {
  // Excluye _next/_vercel, archivos con extensión (sitemap.xml, robots.txt…), las
  // rutas de imágenes de metadatos de Next (opengraph-image/twitter-image) y los
  // alias del feed RSS (/feed, /rss) — si el middleware de idiomas las tocara,
  // las reescribiría con prefijo de idioma (/es/feed) y devolverían 404.
  matcher: ["/((?!_next|_vercel|opengraph-image|twitter-image|feed$|rss$|.*\\..*).*)"],
};
