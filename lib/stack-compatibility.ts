// Compatibilidad de stacks: a diferencia del comparador (specs lado a lado),
// esto responde UNA pregunta concreta — "¿puedo combinar A con B?" — con un
// solo veredicto, no con una matriz completa de 500 celdas que nadie lee.
//
// Cada entrada sale de lo que YA dice `combinesWithAvoid` en cada perfil de
// lib/peptide-profiles.ts (no se inventa nada nuevo): cuando la fuente nombra
// explícitamente la combinación se marca "studied"/"avoid"; cuando la lógica
// es solo plausible por categoría (misma familia GHRH/GHRP) pero ninguna
// fuente la nombra tal cual, se marca "caution" en vez de inflarla a un
// veredicto que no está respaldado. Todo lo que no aparece aquí es "unknown"
// a propósito — mismo principio que el resto de la app: nunca fabricar un
// dato que no se pueda sostener.

export type CompatStatus = "studied" | "caution" | "avoid" | "unknown";

// Subconjunto de PEPTIDE_PROFILES con cultura real de "stacking" (los que la
// comunidad de verdad combina). No son los 49 péptidos del catálogo: una
// matriz de 49×49 sería el mismo error de UX que el de la competencia.
export const COMPAT_PEPTIDES = [
  "BPC-157",
  "TB-500",
  "GHK-Cu",
  "KPV",
  "Semaglutida",
  "Tirzepatida",
  "Retatrutida",
  "Cagrilintide",
  "Ipamorelina",
  "CJC-1295",
  "GHRP-2",
  "GHRP-6",
  "Hexarelin",
  "Sermorelina",
  "Tesamorelina",
  "Selank",
  "Semax",
  "PT-141 (Bremelanotida)",
  "Melanotan II",
  "Epitalon",
  "MOTS-c",
  "AOD-9604",
] as const;

export type CompatPeptide = (typeof COMPAT_PEPTIDES)[number];

type CompatEntry = { status: CompatStatus; note: string };

function key(a: string, b: string): string {
  return [a, b].sort().join("|");
}

const PAIRS: [string, string, CompatStatus, string][] = [
  ["BPC-157", "TB-500", "studied", "Combo clásico de recuperación — el más reportado de toda la comunidad."],
  ["BPC-157", "GHK-Cu", "studied", "Parte del blend popular \"GLOW\" (BPC-157 + GHK-Cu + TB-500) para piel y recuperación."],
  ["TB-500", "GHK-Cu", "studied", "Parte del blend popular \"GLOW\" (BPC-157 + GHK-Cu + TB-500) para piel y recuperación."],
  ["BPC-157", "KPV", "studied", "Se usan juntos para salud intestinal; sin interacciones graves conocidas."],

  // GLP-1 × péptidos de recuperación/piel: mecanismos completamente distintos
  // (metabólico vs. reparación tisular) y el propio perfil de BPC-157 ya dice
  // "sin interacciones graves conocidas con otros péptidos de esta lista" —
  // por eso "caution" (informativo) y no "unknown" en blanco. Sigue sin ser
  // un estudio formal de la combinación en sí, así que tampoco es "studied".
  ["Semaglutida", "BPC-157", "caution", "Mecanismos distintos (metabólico vs. reparación tisular) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual. Stack común en protocolos de recomposición corporal."],
  ["Semaglutida", "TB-500", "caution", "Mecanismos distintos (metabólico vs. reparación tisular) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual. Stack común en protocolos de recomposición corporal."],
  ["Semaglutida", "GHK-Cu", "caution", "Mecanismos distintos (metabólico vs. piel/reparación) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual."],
  ["Tirzepatida", "BPC-157", "caution", "Mecanismos distintos (metabólico vs. reparación tisular) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual. Stack común en protocolos de recomposición corporal."],
  ["Tirzepatida", "TB-500", "caution", "Mecanismos distintos (metabólico vs. reparación tisular) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual. Stack común en protocolos de recomposición corporal."],
  ["Tirzepatida", "GHK-Cu", "caution", "Mecanismos distintos (metabólico vs. piel/reparación) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual."],
  ["Retatrutida", "BPC-157", "caution", "Mecanismos distintos (metabólico vs. reparación tisular) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual."],
  ["Retatrutida", "TB-500", "caution", "Mecanismos distintos (metabólico vs. reparación tisular) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual."],
  ["Retatrutida", "GHK-Cu", "caution", "Mecanismos distintos (metabólico vs. piel/reparación) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual."],
  ["Cagrilintide", "BPC-157", "caution", "Mecanismos distintos (metabólico vs. reparación tisular) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual."],
  ["Cagrilintide", "TB-500", "caution", "Mecanismos distintos (metabólico vs. reparación tisular) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual."],
  ["Cagrilintide", "GHK-Cu", "caution", "Mecanismos distintos (metabólico vs. piel/reparación) — sin conflicto conocido, pero tampoco hay un estudio formal de esta combinación puntual."],

  ["Semaglutida", "Tirzepatida", "avoid", "Dos agonistas GLP-1/GIP a la vez no se recomienda combinarlos."],
  ["Semaglutida", "Retatrutida", "avoid", "No se recomienda combinar dos agonistas GLP-1/GIP/glucagón a la vez."],
  ["Tirzepatida", "Retatrutida", "avoid", "No se recomienda combinar dos agonistas GLP-1/GIP/glucagón a la vez."],
  ["Semaglutida", "Cagrilintide", "studied", "Combinación estudiada en ensayos clínicos bajo el nombre \"CagriSema\"."],
  ["Tirzepatida", "Cagrilintide", "caution", "Cagrilintide pide precaución al sumarse a cualquier supresor de apetito fuerte; no hay un protocolo formal documentado junto a tirzepatida."],
  ["Retatrutida", "Cagrilintide", "caution", "Cagrilintide pide precaución al sumarse a cualquier supresor de apetito fuerte; no hay un protocolo formal documentado junto a retatrutida."],

  ["Ipamorelina", "CJC-1295", "studied", "Combo clásico GHRH + GHRP — el más reportado de esta categoría."],
  ["CJC-1295", "GHRP-2", "studied", "Sinergia GHRH + GHRP nombrada explícitamente en ambos perfiles."],
  ["CJC-1295", "GHRP-6", "studied", "Sinergia GHRH + GHRP nombrada explícitamente en ambos perfiles."],
  ["Sermorelina", "Ipamorelina", "studied", "Sinergia GHRH + GHRP nombrada explícitamente en ambos perfiles."],
  ["Sermorelina", "GHRP-2", "studied", "Sinergia GHRH + GHRP nombrada explícitamente en ambos perfiles."],
  ["Tesamorelina", "Ipamorelina", "studied", "Tesamorelina indica combinarse con GHRP para potenciar el pulso de GH."],
  ["Tesamorelina", "GHRP-2", "studied", "Tesamorelina indica combinarse con GHRP para potenciar el pulso de GH."],
  ["Tesamorelina", "GHRP-6", "studied", "Tesamorelina indica combinarse con GHRP para potenciar el pulso de GH."],
  ["Tesamorelina", "Hexarelin", "studied", "Tesamorelina indica combinarse con GHRP para potenciar el pulso de GH."],

  ["Ipamorelina", "GHRP-2", "avoid", "No se recomienda combinar dos GHRP a la vez."],
  ["Ipamorelina", "GHRP-6", "avoid", "No se recomienda combinar dos GHRP a la vez."],
  ["Ipamorelina", "Hexarelin", "avoid", "No se recomienda combinar dos GHRP a la vez."],
  ["GHRP-2", "GHRP-6", "avoid", "No se recomienda combinar dos GHRP a la vez."],
  ["GHRP-2", "Hexarelin", "avoid", "No se recomienda combinar dos GHRP a la vez."],
  ["GHRP-6", "Hexarelin", "avoid", "No se recomienda combinar dos GHRP a la vez."],

  ["CJC-1295", "Sermorelina", "avoid", "No se recomienda combinar dos análogos de GHRH a la vez."],
  ["CJC-1295", "Tesamorelina", "avoid", "No se recomienda combinar dos análogos de GHRH a la vez."],
  ["Sermorelina", "Tesamorelina", "avoid", "No se recomienda combinar dos análogos de GHRH a la vez."],

  ["CJC-1295", "Hexarelin", "caution", "Sinergia GHRH + GHRP plausible por categoría, pero ninguna fuente la nombra explícitamente junto a Hexarelin."],
  ["Sermorelina", "Hexarelin", "caution", "Sinergia GHRH + GHRP plausible por categoría, pero ninguna fuente la nombra explícitamente junto a Hexarelin."],
  ["Sermorelina", "GHRP-6", "caution", "Sinergia GHRH + GHRP plausible por categoría, pero el perfil de Sermorelina solo nombra Ipamorelina/GHRP-2 explícitamente."],

  ["Selank", "Semax", "studied", "Combo clásico nootrópico: calma (Selank) + enfoque (Semax)."],

  ["PT-141 (Bremelanotida)", "Melanotan II", "avoid", "Mecanismo similar (receptores de melanocortina): combinarlos el mismo día aumenta el riesgo de náuseas."],

  ["AOD-9604", "CJC-1295", "caution", "Se usan juntos por su origen común en la hormona de crecimiento, pero sin evidencia sólida de que sumarlos aporte más."],
  ["AOD-9604", "Ipamorelina", "caution", "Se usan juntos por su origen común en la hormona de crecimiento, pero sin evidencia sólida de que sumarlos aporte más."],

  ["Epitalon", "MOTS-c", "caution", "El perfil de Epitalon recomienda ciclos aislados, sin combinarlo con otros péptidos de longevidad al mismo tiempo."],
];

const COMPAT_MAP = new Map<string, CompatEntry>(
  PAIRS.map(([a, b, status, note]) => [key(a, b), { status, note }])
);

export function getCompatibility(a: string, b: string): CompatEntry {
  if (a === b) return { status: "unknown", note: "" };
  return COMPAT_MAP.get(key(a, b)) || { status: "unknown", note: "" };
}

// Pares sugeridos para precargar la herramienta (mezcla de los 4 estados,
// para que el usuario vea de entrada que no todo es rojo/verde).
export const POPULAR_COMPAT_PAIRS: [string, string][] = [
  ["BPC-157", "TB-500"],
  ["Semaglutida", "Tirzepatida"],
  ["Ipamorelina", "CJC-1295"],
  ["GHRP-2", "GHRP-6"],
];
