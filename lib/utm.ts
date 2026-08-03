// Primer contacto (nunca se sobrescribe) y último contacto (se actualiza cada
// vez que hay una señal real de canal) — sin esto, un usuario que llega por
// TikTok, vuelve dos semanas después por un anuncio de Meta y ahí se registra
// aparecía SOLO como "tiktok", perdiendo la campaña que de verdad cerró la venta.
const KEY_FIRST = "peptibrain_utm_source";
const KEY_LAST = "peptibrain_utm_source_last";

// Canales conocidos para normalizar el referrer.
const REFERRER_MAP: { host: string; source: string }[] = [
  { host: "instagram.", source: "instagram" },
  { host: "l.instagram.", source: "instagram" },
  { host: "tiktok.", source: "tiktok" },
  { host: "youtube.", source: "youtube" },
  { host: "youtu.be", source: "youtube" },
  { host: "facebook.", source: "facebook" },
  { host: "fb.", source: "facebook" },
  { host: "google.", source: "google" },
  { host: "bing.", source: "google" },
  { host: "t.co", source: "twitter" },
  { host: "twitter.", source: "twitter" },
  { host: "x.com", source: "twitter" },
  { host: "reddit.", source: "reddit" },
  { host: "whatsapp", source: "whatsapp" },
  { host: "hotmart.", source: "hotmart" },
];

// Detecta el canal de ESTA visita concreta — null si no hay ninguna señal real
// (ej. quien vuelve escribiendo la URL a mano no aporta nada nuevo al último
// contacto, y no debe borrar el último canal real que sí trajo señal).
function detectSourceThisVisit(): string | null {
  const params = new URLSearchParams(window.location.search);
  const explicit = params.get("utm_source") || params.get("ref") || params.get("source");
  if (explicit) return explicit.toLowerCase().slice(0, 40);

  const ref = document.referrer || "";
  if (ref) {
    try {
      const host = new URL(ref).host.toLowerCase();
      // ignorar auto-referencias del propio dominio
      if (!host.includes(window.location.host)) {
        const match = REFERRER_MAP.find((m) => host.includes(m.host));
        return match ? match.source : host.replace(/^www\./, "");
      }
    } catch {
      /* referrer no parseable */
    }
  }
  return null;
}

// Se llama en cada carga de página pública (landing). Primer contacto: solo se
// escribe una vez, con "directo" como fallback si esta primera visita no trae
// ninguna señal. Último contacto: se sobrescribe SOLO cuando hay señal real.
export function captureUtm() {
  if (typeof window === "undefined") return;
  const source = detectSourceThisVisit();

  if (!window.localStorage.getItem(KEY_FIRST)) {
    window.localStorage.setItem(KEY_FIRST, source || "directo");
  }
  if (source) {
    window.localStorage.setItem(KEY_LAST, source);
  }
}

// Primer contacto — quién lo descubrió. Mantiene el nombre de siempre para no
// romper el resto del código que ya lo usa.
export function getUtm(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY_FIRST);
}

// Último contacto — qué campaña cerró de verdad. Si nunca hubo una señal
// distinta al primer contacto, cae en el mismo valor (es lo correcto: significa
// que solo hubo un canal real).
export function getLastUtm(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY_LAST) || getUtm();
}

// Dispositivo desde el que se registra el usuario (iOS / Android / Escritorio).
export function detectPlatform(): string {
  if (typeof navigator === "undefined") return "desconocido";
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  return "Escritorio";
}
