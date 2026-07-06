import mixpanel from "mixpanel-browser";

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
let initialized = false;

export function initMixpanel() {
  if (initialized || !TOKEN || typeof window === "undefined") return;
  mixpanel.init(TOKEN, {
    debug: process.env.NODE_ENV !== "production",
    persistence: "localStorage",
    track_pageview: false, // lo hacemos a mano en cada cambio de ruta (App Router es SPA)
  });
  initialized = true;
}

export function trackPageview(path: string) {
  if (!initialized) return;
  mixpanel.track_pageview({ page: path });
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  mixpanel.track(event, properties);
}

export function identifyUser(
  userId: string,
  profile: { email?: string; name?: string; plan?: string }
) {
  if (!initialized) return;
  mixpanel.identify(userId);
  mixpanel.people.set({
    ...(profile.email && { $email: profile.email }),
    ...(profile.name && { $name: profile.name }),
    ...(profile.plan && { plan_type: profile.plan }),
  });
  if (profile.plan) {
    mixpanel.register({ plan_type: profile.plan });
  }
}

export function resetMixpanel() {
  if (!initialized) return;
  mixpanel.reset();
}
