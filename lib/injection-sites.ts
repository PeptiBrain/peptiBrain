import type { Dose } from "@/lib/app-data";

// Rotación de 3 zonas — mismas que recomienda el artículo del blog
// "Cómo se usan los péptidos" (abdomen, muslo externo, parte de atrás del
// brazo). Rotar entre pocas zonas fijas es más realista que dejar el campo
// libre: reduce fricción al loguear y sigue evitando lipohipertrofia.
export const INJECTION_SITE_IDS = ["abdomen", "muslo", "brazo"] as const;
export type InjectionSiteId = (typeof INJECTION_SITE_IDS)[number];

function isKnownSite(value: string | undefined): value is InjectionSiteId {
  return Boolean(value) && (INJECTION_SITE_IDS as readonly string[]).includes(value!);
}

// Sugiere la siguiente zona rotando desde la última dosis registrada con
// zona conocida para ese péptido — así nunca sugiere la misma dos veces seguidas.
export function suggestNextInjectionSite(doses: Dose[], peptideId: string): InjectionSiteId {
  const lastWithSite = [...doses]
    .filter((d) => d.peptideId === peptideId && isKnownSite(d.injectionSite))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0];

  if (!lastWithSite) return INJECTION_SITE_IDS[0];

  const lastIndex = INJECTION_SITE_IDS.indexOf(lastWithSite.injectionSite as InjectionSiteId);
  return INJECTION_SITE_IDS[(lastIndex + 1) % INJECTION_SITE_IDS.length];
}

export function lastInjectionSite(doses: Dose[], peptideId: string): InjectionSiteId | null {
  const lastWithSite = [...doses]
    .filter((d) => d.peptideId === peptideId && isKnownSite(d.injectionSite))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0];
  return lastWithSite ? (lastWithSite.injectionSite as InjectionSiteId) : null;
}
