"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { GA_CONSENT_EVENT } from "@/lib/analytics";

const CONSENT_KEY = "peptibrain_cookie_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let gtagLoaded = false;

function loadGtag(gaId: string) {
  if (gtagLoaded || typeof window === "undefined") return;
  gtagLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", gaId);
}

// Carga Google Analytics 4 SOLO si el dueño configuró un ID (desde el panel) Y el
// visitante aceptó las cookies. Reacciona al banner de cookies en vivo.
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window.localStorage.getItem(CONSENT_KEY) === "accepted") loadGtag(gaId);
    function onConsent(e: Event) {
      const granted = (e as CustomEvent<{ granted: boolean }>).detail?.granted;
      if (granted) loadGtag(gaId);
      else (window as unknown as Record<string, boolean>)[`ga-disable-${gaId}`] = true;
    }
    window.addEventListener(GA_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(GA_CONSENT_EVENT, onConsent);
  }, [gaId]);

  // Vista de página en cada cambio de ruta (App Router es SPA).
  useEffect(() => {
    if (gtagLoaded && window.gtag) {
      window.gtag("event", "page_view", { page_path: pathname });
    }
  }, [pathname]);

  return null;
}
