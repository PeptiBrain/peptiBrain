"use client";

import { useEffect } from "react";
import { GA_CONSENT_EVENT } from "@/lib/analytics";

const CONSENT_KEY = "peptibrain_cookie_consent";

let clarityLoaded = false;

// Inyecta el tag oficial de Microsoft Clarity (grabaciones de sesión + mapas de calor).
function loadClarity(id: string) {
  if (clarityLoaded || typeof window === "undefined") return;
  clarityLoaded = true;
  (function (c: typeof window, l: Document, a: string, r: string, i: string) {
    (c as unknown as Record<string, unknown>)[a] =
      (c as unknown as Record<string, unknown>)[a] ||
      function (...args: unknown[]) {
        const w = c as unknown as Record<string, { q?: unknown[] }>;
        (w[a].q = w[a].q || []).push(args);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
}

// Carga Clarity SOLO si el dueño configuró un Project ID (desde el panel) Y el visitante
// aceptó las cookies. Reacciona al banner de cookies en vivo — igual que Google Analytics.
export function MicrosoftClarity({ clarityId }: { clarityId: string }) {
  useEffect(() => {
    if (window.localStorage.getItem(CONSENT_KEY) === "accepted") loadClarity(clarityId);
    function onConsent(e: Event) {
      const granted = (e as CustomEvent<{ granted: boolean }>).detail?.granted;
      if (granted) loadClarity(clarityId);
    }
    window.addEventListener(GA_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(GA_CONSENT_EVENT, onConsent);
  }, [clarityId]);

  return null;
}
