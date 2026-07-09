import type { AppData, Dose, Peptide, Vial, HealthLog } from "@/lib/app-data";

// Convierte una cantidad a mg (mcg -> mg). ml/UI no se suman como peso.
function toMg(amount: string, unit: string): number {
  const n = parseFloat(amount);
  if (!Number.isFinite(n)) return 0;
  if (unit === "mcg") return n / 1000;
  if (unit === "mg") return n;
  return 0; // ml, UI: no cuentan como peso acumulado
}

export function totalInvested(vials: Vial[]): number {
  return vials.reduce((sum, v) => sum + (v.cost ? parseFloat(v.cost) || 0 : 0), 0);
}

export function spendThisMonth(vials: Vial[], now: Date): number {
  const y = now.getFullYear();
  const m = now.getMonth();
  return vials.reduce((sum, v) => {
    if (!v.cost) return sum;
    const d = new Date(v.createdAt);
    if (d.getFullYear() === y && d.getMonth() === m) return sum + (parseFloat(v.cost) || 0);
    return sum;
  }, 0);
}

export function doneDoses(doses: Dose[]): Dose[] {
  return doses.filter((d) => d.done);
}

// Coste por dosis aplicada = total invertido / nº de dosis aplicadas
export function costPerDose(vials: Vial[], doses: Dose[]): number | null {
  const done = doneDoses(doses).length;
  if (done === 0) return null;
  const total = totalInvested(vials);
  if (total === 0) return null;
  return total / done;
}

export type PeptideUsage = {
  peptide: Peptide;
  doseCount: number;
  totalMg: number;
};

// Uso por péptido, ordenado por nº de dosis aplicadas (desc)
export function usageByPeptide(peptides: Peptide[], doses: Dose[]): PeptideUsage[] {
  const done = doneDoses(doses);
  const rows = peptides.map((peptide) => {
    const forThis = done.filter((d) => d.peptideId === peptide.id);
    return {
      peptide,
      doseCount: forThis.length,
      totalMg: forThis.reduce((sum, d) => sum + toMg(d.amount, d.unit), 0),
    };
  });
  return rows.sort((a, b) => b.doseCount - a.doseCount);
}

export function mostUsedPeptide(peptides: Peptide[], doses: Dose[]): PeptideUsage | null {
  const rows = usageByPeptide(peptides, doses).filter((r) => r.doseCount > 0);
  return rows[0] || null;
}

// Adherencia = dosis aplicadas / dosis programadas cuya fecha ya pasó
export function adherence(doses: Dose[], now: Date): { done: number; due: number; pct: number } | null {
  const due = doses.filter((d) => new Date(d.scheduledAt).getTime() <= now.getTime());
  if (due.length === 0) return null;
  const done = due.filter((d) => d.done).length;
  return { done, due: due.length, pct: Math.round((done / due.length) * 100) };
}

export type WeightTrend = {
  first: number;
  last: number;
  deltaKg: number;
};

export function weightTrend(healthLogs: HealthLog[]): WeightTrend | null {
  const weighed = healthLogs
    .filter((h) => h.weightKg && Number.isFinite(parseFloat(h.weightKg)))
    .map((h) => ({ date: h.date, kg: parseFloat(h.weightKg!) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  if (weighed.length < 2) return null;
  const first = weighed[0].kg;
  const last = weighed[weighed.length - 1].kg;
  return { first, last, deltaKg: +(last - first).toFixed(1) };
}

export function sideEffectCount(healthLogs: HealthLog[]): number {
  return healthLogs.filter((h) => h.sideEffect && h.sideEffect.trim().length > 0).length;
}

export type Stats = {
  totalInvested: number;
  spendThisMonth: number;
  costPerDose: number | null;
  totalDosesDone: number;
  mostUsed: PeptideUsage | null;
  usage: PeptideUsage[];
  adherence: ReturnType<typeof adherence>;
  weight: WeightTrend | null;
  sideEffects: number;
};

export function computeStats(data: AppData, now: Date): Stats {
  return {
    totalInvested: totalInvested(data.vials),
    spendThisMonth: spendThisMonth(data.vials, now),
    costPerDose: costPerDose(data.vials, data.doses),
    totalDosesDone: doneDoses(data.doses).length,
    mostUsed: mostUsedPeptide(data.peptides, data.doses),
    usage: usageByPeptide(data.peptides, data.doses).filter((r) => r.doseCount > 0),
    adherence: adherence(data.doses, now),
    weight: weightTrend(data.healthLogs),
    sideEffects: sideEffectCount(data.healthLogs),
  };
}
