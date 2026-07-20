import { PEPTIDE_PROFILES, type PeptideCategoryId } from "@/lib/peptide-profiles";

// Color fijo por categoría — el color del bote ahora tiene significado (no es
// decorativo): cada categoría de péptido siempre se ve del mismo color, así el
// usuario aprende a reconocerlas de un vistazo (ej. "el azul siempre es sueño").
const CATEGORY_COLORS: Record<PeptideCategoryId, string> = {
  peso: "orange",
  musculo_gh: "red",
  recuperacion: "green",
  longevidad: "gold",
  sueno: "blue",
  piel_belleza: "magenta",
  cognicion: "cyan",
  libido: "pink", // morado (guardado como bottle-pink.png)
  intestinal: "brown",
  inmunidad: "gray",
};

const FALLBACK_COLORS = Object.values(CATEGORY_COLORS);

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function colorForPeptideName(peptideName: string): string {
  const name = peptideName.trim().toLowerCase();
  const profile = PEPTIDE_PROFILES.find((p) => p.name.toLowerCase() === name);
  const category = profile?.categories[0];
  if (category && CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];
  // Péptido personalizado sin categoría conocida: color estable por nombre.
  return FALLBACK_COLORS[hashString(name) % FALLBACK_COLORS.length];
}

// Color por péptido (mismo péptido siempre muestra el mismo bote) — usado tanto
// en tarjetas de péptido como en tarjetas de vial (todos los viales de un mismo
// péptido se ven del mismo color).
export function getPeptideBottleImage(peptideName: string): string {
  return `/viales/bottle-${colorForPeptideName(peptideName || "")}.png`;
}
