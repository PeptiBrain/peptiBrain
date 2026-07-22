// Consentimiento de Google Analytics — se dispara desde el banner de cookies, igual
// que el de Mixpanel. GA solo se carga tras aceptar (opt-in), como manda la ley UE.
export const GA_CONSENT_EVENT = "peptibrain:ga-consent";

export function grantAnalyticsConsent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(GA_CONSENT_EVENT, { detail: { granted: true } }));
  }
}

export function denyAnalyticsConsent() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(GA_CONSENT_EVENT, { detail: { granted: false } }));
  }
}
