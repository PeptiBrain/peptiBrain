// Mixpanel se carga BAJO DEMANDA (import dinámico), no en el bundle inicial.
// Antes se importaba de forma estática desde el layout raíz: ~119 KB de JS
// viajaban en TODAS las páginas (el 79% sin ejecutarse nunca) aunque el
// visitante no hubiera aceptado las cookies todavía — y sin consentimiento
// la librería no puede trackear nada igualmente. Ahora solo se descarga
// cuando hay consentimiento real, así la primera visita (la que decide el
// LCP) no paga ese peso.

type MixpanelLib = typeof import("mixpanel-browser").default;

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const CONSENT_KEY = "peptibrain_cookie_consent";

let mp: MixpanelLib | null = null;
let loading: Promise<MixpanelLib | null> | null = null;

function consentGranted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

// Descarga + inicializa una sola vez. Las llamadas concurrentes comparten la
// misma promesa, así que los eventos disparados durante la carga se envían
// en orden en cuanto la librería está lista (no se pierden).
function load(): Promise<MixpanelLib | null> {
  if (mp) return Promise.resolve(mp);
  if (!TOKEN || typeof window === "undefined") return Promise.resolve(null);
  if (!loading) {
    loading = import("mixpanel-browser")
      .then((mod) => {
        const lib = mod.default;
        lib.init(TOKEN, {
          debug: process.env.NODE_ENV !== "production",
          persistence: "localStorage",
          track_pageview: false, // lo hacemos a mano en cada cambio de ruta (App Router es SPA)
          opt_out_tracking_by_default: true, // no trackea nada hasta el opt-in explícito de abajo
        });
        if (consentGranted()) lib.opt_in_tracking();
        mp = lib;
        return lib;
      })
      .catch(() => null); // sin analítica la app sigue funcionando igual
  }
  return loading;
}

export function initMixpanel() {
  // Solo se precarga si el visitante YA aceptó en una visita anterior.
  if (consentGranted()) void load();
}

export function grantTrackingConsent() {
  void load().then((m) => m?.opt_in_tracking());
}

export function denyTrackingConsent() {
  // Si nunca se cargó (lo normal al rechazar), no hay nada que apagar.
  mp?.opt_out_tracking();
}

export function trackPageview(path: string) {
  if (!consentGranted()) return;
  void load().then((m) => m?.track_pageview({ page: path }));
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!consentGranted()) return;
  void load().then((m) => m?.track(event, properties));
}

export function identifyUser(
  userId: string,
  profile: { email?: string; name?: string; plan?: string }
) {
  if (!consentGranted()) return;
  void load().then((m) => {
    if (!m) return;
    m.identify(userId);
    m.people.set({
      ...(profile.email && { $email: profile.email }),
      ...(profile.name && { $name: profile.name }),
      ...(profile.plan && { plan_type: profile.plan }),
    });
    if (profile.plan) {
      m.register({ plan_type: profile.plan });
    }
  });
}

export function resetMixpanel() {
  mp?.reset();
}
