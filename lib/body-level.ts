import { PEPTIDE_PROFILES } from "@/lib/peptide-profiles";
import type { AppData, Dose } from "@/lib/app-data";

// Por debajo de este % se considera prácticamente eliminado (misma regla de
// ~5 vidas medias que usa lib/clearance.ts) — no tiene sentido mostrar un
// residuo que ya no es relevante.
const MIN_VISIBLE_PERCENT = 3;

export type BodyLevelEntry = {
  peptideId: string;
  peptideName: string;
  percentRemaining: number;
  hoursSinceLastDose: number;
};

// Estima, para cada péptido del usuario con vida media conocida, cuánto de la
// última dosis real (marcada como aplicada) sigue activo — decaimiento
// exponencial estándar de farmacocinética. No suma dosis acumuladas de días
// distintos (modelo simple, honesto): solo la última dosis real.
export function computeBodyLevels(data: AppData, now: Date): BodyLevelEntry[] {
  const entries: BodyLevelEntry[] = [];

  for (const peptide of data.peptides) {
    const normalizedName = peptide.name.trim().toLowerCase();
    const profile = PEPTIDE_PROFILES.find((p) => p.name.trim().toLowerCase() === normalizedName);
    if (!profile || profile.halfLifeHoursEstimate == null) continue;

    const lastDose = data.doses
      .filter((d) => d.peptideId === peptide.id && d.done)
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0];
    if (!lastDose) continue;

    const hoursSinceLastDose = (now.getTime() - new Date(lastDose.scheduledAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastDose < 0) continue;

    const percentRemaining = 100 * Math.pow(0.5, hoursSinceLastDose / profile.halfLifeHoursEstimate);
    if (percentRemaining < MIN_VISIBLE_PERCENT) continue;

    entries.push({
      peptideId: peptide.id,
      peptideName: peptide.name,
      percentRemaining: Math.round(percentRemaining),
      hoursSinceLastDose,
    });
  }

  return entries.sort((a, b) => b.percentRemaining - a.percentRemaining);
}

export type BodyLevelPoint = { timestamp: number; level: number };

// Curva del nivel activo estimado de un péptido a lo largo del tiempo — suma
// (superpone) la contribución de CADA dosis real aplicada, no solo la última,
// que es el modelo farmacocinético correcto cuando hay dosis seguidas antes
// de que la anterior termine de eliminarse. El nivel se expresa en la unidad
// de la dosis (mg/mcg/etc), no en % — con varias dosis superpuestas un "%"
// relativo a una sola dosis dejaría de tener sentido.
export function computeBodyLevelSeries(
  doses: Dose[],
  peptideId: string,
  halfLifeHours: number,
  days: number,
  pointsPerDay = 4
): BodyLevelPoint[] {
  const completed = doses
    .filter((d) => d.peptideId === peptideId && d.done)
    .map((d) => ({ time: new Date(d.scheduledAt).getTime(), amount: parseFloat(d.amount) || 0 }))
    .filter((d) => !Number.isNaN(d.time) && d.amount > 0);
  if (completed.length === 0) return [];

  const now = Date.now();
  const start = now - days * 24 * 60 * 60 * 1000;
  const stepMs = (24 * 60 * 60 * 1000) / pointsPerDay;
  const halfLifeMs = halfLifeHours * 60 * 60 * 1000;
  const points: BodyLevelPoint[] = [];

  for (let t = start; t <= now; t += stepMs) {
    let level = 0;
    for (const dose of completed) {
      if (dose.time > t) continue;
      level += dose.amount * Math.pow(0.5, (t - dose.time) / halfLifeMs);
    }
    points.push({ timestamp: t, level: Math.round(level * 100) / 100 });
  }
  return points;
}
