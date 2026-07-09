const KEY = "peptibrain_utm_source";

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

// Captura el origen la PRIMERA vez que el usuario llega. No lo sobrescribe.
export function captureUtm() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(KEY)) return; // ya capturado

  const params = new URLSearchParams(window.location.search);
  const explicit =
    params.get("utm_source") || params.get("ref") || params.get("source");
  if (explicit) {
    window.localStorage.setItem(KEY, explicit.toLowerCase().slice(0, 40));
    return;
  }

  const ref = document.referrer || "";
  if (ref) {
    try {
      const host = new URL(ref).host.toLowerCase();
      // ignorar auto-referencias del propio dominio
      if (!host.includes(window.location.host)) {
        const match = REFERRER_MAP.find((m) => host.includes(m.host));
        window.localStorage.setItem(KEY, match ? match.source : host.replace(/^www\./, ""));
        return;
      }
    } catch {
      /* referrer no parseable */
    }
  }
  window.localStorage.setItem(KEY, "directo");
}

export function getUtm(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}
