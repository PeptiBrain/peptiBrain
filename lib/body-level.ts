import { PEPTIDE_PROFILES } from "@/lib/peptide-profiles";
import type { AppData } from "@/lib/app-data";

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
    const profile = PEPTIDE_PROFILES.find((p) => p.name === peptide.name);
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
