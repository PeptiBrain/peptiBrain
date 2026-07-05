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
