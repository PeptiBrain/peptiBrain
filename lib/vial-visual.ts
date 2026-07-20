const VIAL_BOTTLE_COLORS = ["blue", "green", "magenta", "orange", "pink"] as const;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Color estable por vial (mismo vial siempre muestra el mismo bote, no cambia en cada render).
export function getVialBottleImage(vialId: string): string {
  const color = VIAL_BOTTLE_COLORS[hashString(vialId) % VIAL_BOTTLE_COLORS.length];
  return `/viales/bottle-${color}.png`;
}

// Color estable por péptido (mismo péptido siempre muestra el mismo bote) — usado
// en tarjetas/listas donde se representa el péptido en general, no un vial concreto.
export function getPeptideBottleImage(peptideName: string): string {
  const color = VIAL_BOTTLE_COLORS[hashString(peptideName.trim().toLowerCase()) % VIAL_BOTTLE_COLORS.length];
  return `/viales/bottle-${color}.png`;
}
