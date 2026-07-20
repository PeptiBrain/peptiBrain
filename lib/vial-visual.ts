const VIAL_BOTTLE_COLORS = ["blue", "green", "magenta", "orange", "pink"] as const;

// Color estable por vial (mismo vial siempre muestra el mismo bote, no cambia en cada render).
export function getVialBottleImage(vialId: string): string {
  let hash = 0;
  for (let i = 0; i < vialId.length; i++) {
    hash = (hash * 31 + vialId.charCodeAt(i)) >>> 0;
  }
  const color = VIAL_BOTTLE_COLORS[hash % VIAL_BOTTLE_COLORS.length];
  return `/viales/bottle-${color}.png`;
}
