// Rangos de plausibilidad para los datos de salud.
//
// El QA metió 500 kg de peso, 99 % de grasa, 999.999 kcal, 999.999 ml de agua,
// 99.999 min de ejercicio y 48 h de sueño: todo se guardó sin rechistar, y el
// toast llegó a felicitar con "-427 kg". Un dato imposible no solo ensucia las
// estadísticas: rompe los gráficos y hace que el usuario desconfíe de la app.
//
// Los topes son GENEROSOS a propósito: la idea es frenar lo imposible (un dedo
// que resbala en el teclado), no discutirle a nadie su cuerpo.

export type Range = { min: number; max: number };

export const PLAUSIBLE: Record<string, Range> = {
  weightKg: { min: 20, max: 400 },
  bodyFatPct: { min: 1, max: 70 },
  calories: { min: 1, max: 20000 },
  hydrationMl: { min: 1, max: 20000 },
  exerciseMin: { min: 1, max: 1440 }, // un día entero
  sleepHours: { min: 0.5, max: 24 },
  labValue: { min: 0, max: 1000000 },
  // Vial/dosis: el QA metió viales de 99.999 mg y agua de 99.999 mL en la
  // calculadora y se calcularon igual. 10 g es más que cualquier vial real
  // de péptidos (que se miden en mg), y 100 mL más que cualquier reconstitución.
  vialMassMg: { min: 0.001, max: 10000 },
  bacWaterMl: { min: 0.05, max: 100 },
  targetUnitsRange: { min: 0.1, max: 500 }, // 5 mL, más que cualquier jeringa
  costAmount: { min: 0, max: 100000 },
};

/** Convierte a número aceptando coma decimal ("73,5"). */
export function toNumber(value: string): number {
  return parseFloat(value.replace(",", "."));
}

/** Igual que inRange pero ya con el número calculado (no un string de un input). */
export function numberInRange(n: number, range: Range): boolean {
  return Number.isFinite(n) && n >= range.min && n <= range.max;
}

/**
 * ¿Este texto es un número dentro del rango? Un campo VACÍO se considera
 * válido: la obligatoriedad se decide aparte, aquí solo se juzga el contenido.
 */
export function inRange(value: string, range: Range): boolean {
  if (!value.trim()) return true;
  const n = toNumber(value);
  return Number.isFinite(n) && n >= range.min && n <= range.max;
}

/** Igual que inRange pero el campo es obligatorio (vacío = inválido). */
export function requiredInRange(value: string, range: Range): boolean {
  if (!value.trim()) return false;
  return inRange(value, range);
}
