// Convierte mg/mcg a mg (base común). Devuelve null si la unidad no es química (ml/UI).
function toMg(amount: number, unit: string): number | null {
  if (unit === "mg") return amount;
  if (unit === "mcg") return amount / 1000;
  return null;
}

/**
 * Unidades a extraer en una jeringa de insulina (escala U-100: 100 unidades = 1 mL,
 * independientemente de la capacidad física del barril — la capacidad solo limita cuánto entra).
 */
export function unitsToDraw({
  vialAmount,
  vialUnit,
  bacWater,
  doseAmount,
  doseUnit,
}: {
  vialAmount: number;
  vialUnit: string;
  bacWater: number;
  doseAmount: number;
  doseUnit: string;
}): number | null {
  const vialMg = toMg(vialAmount, vialUnit);
  const doseMg = toMg(doseAmount, doseUnit);
  if (vialMg === null || doseMg === null || !bacWater || !vialMg) return null;
  const concentrationMgPerMl = vialMg / bacWater;
  const volumeMl = doseMg / concentrationMgPerMl;
  return volumeMl * 100;
}

/**
 * Inverso de unitsToDraw: dado cuántas unidades quieres cargar (targetUnits),
 * calcula cuánta agua bacteriostática hay que agregar al vial para que esa
 * dosis caiga exactamente en esa marca de la jeringa.
 */
export function waterForTargetUnits({
  vialAmount,
  vialUnit,
  doseAmount,
  doseUnit,
  targetUnits,
}: {
  vialAmount: number;
  vialUnit: string;
  doseAmount: number;
  doseUnit: string;
  targetUnits: number;
}): number | null {
  const vialMg = toMg(vialAmount, vialUnit);
  const doseMg = toMg(doseAmount, doseUnit);
  if (vialMg === null || doseMg === null || !targetUnits || !doseMg) return null;
  // Entradas imposibles: sin esto, "vial de 1 mg + dosis de 2000 mcg" devolvía
  // 0.10 mL como si fuera válido — pero no se pueden sacar 2 mg de un vial que
  // solo contiene 1 mg. En una app de dosificación devolver un número para algo
  // físicamente imposible es peor que no responder.
  if (vialMg <= 0 || doseMg <= 0 || targetUnits <= 0) return null;
  if (doseMg > vialMg) return null;
  const volumeMl = targetUnits / 100;
  const water = (volumeMl * vialMg) / doseMg;
  return Number.isFinite(water) && water > 0 ? water : null;
}
