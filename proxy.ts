import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

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
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
