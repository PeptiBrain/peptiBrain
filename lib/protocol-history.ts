import type { Dose } from "@/lib/app-data";

// "Repetir mi último protocolo": rellena el formulario con lo que el usuario
// YA hizo con ese mismo péptido, para no tener que teclearlo otra vez.
//
// LÍNEA ROJA (D2): esto NO sugiere dosis. Los números salen de las dosis que
// esa persona registró con su propia mano — la app solo se acuerda por ella.
// Es exactamente la diferencia entre una plantilla ("los expertos usan 0,25
// mg") y un historial ("la última vez tú usaste 0,25 mg"). La primera es
// receta; la segunda es memoria.

export type InferredProtocol = {
  amount: string;
  unit: string;
  intervalDays: number;
  basedOnDoses: number; // en cuántas dosis se basa (para poder decirlo en pantalla)
};

const DAY_MS = 86400000;
// Los intervalos que ofrece el formulario. Se redondea al más cercano porque
// nadie se inyecta exactamente cada 168,0 horas: hay que ir al médico, se
// duerme uno, se viaja.
const KNOWN_INTERVALS = [1, 2, 3, 7, 14];

function nearestKnownInterval(days: number): number {
  return KNOWN_INTERVALS.reduce((best, candidate) =>
    Math.abs(candidate - days) < Math.abs(best - days) ? candidate : best
  );
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/**
 * Deduce el patrón que el usuario venía usando con un péptido: cuánto y cada
 * cuánto. Devuelve null si no hay historial suficiente para afirmar nada.
 */
export function inferLastProtocol(doses: Dose[], peptideId: string): InferredProtocol | null {
  const relevant = doses
    .filter((d) => d.peptideId === peptideId)
    .map((d) => ({ ...d, ts: new Date(d.scheduledAt).getTime() }))
    .filter((d) => Number.isFinite(d.ts))
    .sort((a, b) => a.ts - b.ts);

  // Con menos de 3 dosis no hay "lo que venías haciendo", hay dos datos
  // sueltos. Rellenar el formulario a partir de eso sería adivinar.
  if (relevant.length < 3) return null;

  const last = relevant[relevant.length - 1];
  const amount = String(last.amount ?? "").trim();
  const amountNum = parseFloat(amount.replace(",", "."));
  if (!amount || !Number.isFinite(amountNum) || amountNum <= 0) return null;

  const gaps: number[] = [];
  for (let i = 1; i < relevant.length; i++) {
    const gapDays = (relevant[i].ts - relevant[i - 1].ts) / DAY_MS;
    // Dos dosis el mismo día no son un intervalo (suele ser una corrección).
    if (gapDays >= 0.5) gaps.push(gapDays);
  }
  if (gaps.length === 0) return null;

  // Mediana y no media: una sola pausa larga (unas vacaciones) no debe
  // desplazar el intervalo habitual.
  const intervalDays = nearestKnownInterval(median(gaps));

  return { amount, unit: last.unit, intervalDays, basedOnDoses: relevant.length };
}
