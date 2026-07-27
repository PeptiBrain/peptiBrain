import type { LabResult } from "@/lib/app-data";

// Tendencia de un marcador de laboratorio respecto a la medición ANTERIOR del
// mismo marcador.
//
// LÍNEA ROJA (D2 del plan de producto): esto describe un hecho —"subió 12
// respecto a la vez anterior"— y NADA más. No dice si el valor es normal, alto
// o bajo, ni si la subida es buena o mala: eso es interpretar un análisis, o
// sea, ejercer de médico. Por eso `lib/lab-markers.ts` tampoco guarda rangos
// de referencia. Quien lee "testosterona 320" y quiere saber si eso es bueno
// tiene que preguntárselo a su médico, no a esta app.
//
// Consecuencia de diseño: la flecha NUNCA se pinta de verde ni de rojo. Subir
// es bueno en un marcador y malo en otro; colorearlo sería colar un juicio.

export type LabTrend = {
  delta: number; // diferencia absoluta respecto a la medición anterior
  direction: "up" | "down" | "same";
  previousValue: number;
  previousDate: string;
};

function toNumber(value: string): number {
  return parseFloat(String(value).replace(",", "."));
}

/**
 * Compara un resultado con la medición inmediatamente anterior del MISMO
 * marcador. Devuelve null si es la primera vez que se mide (no hay con qué
 * comparar) o si algún valor no es numérico.
 */
export function labTrend(result: LabResult, allResults: LabResult[]): LabTrend | null {
  const current = toNumber(result.value);
  if (!Number.isFinite(current)) return null;

  const previous = allResults
    .filter((r) => r.marker === result.marker && r.id !== result.id && r.date < result.date)
    .filter((r) => Number.isFinite(toNumber(r.value)))
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  if (!previous) return null;

  const prevValue = toNumber(previous.value);
  const delta = current - prevValue;
  return {
    delta,
    direction: delta > 0 ? "up" : delta < 0 ? "down" : "same",
    previousValue: prevValue,
    previousDate: previous.date,
  };
}
