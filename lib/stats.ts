import type { AppData, Dose, Peptide, Vial, HealthLog } from "@/lib/app-data";
import { rangeStart, isWithinRange, type DateRangeKey, type CustomRange } from "@/lib/date-range";

// Convierte una cantidad a mg (mcg -> mg). ml/UI no se suman como peso.
function toMg(amount: string, unit: string): number {
  const n = parseFloat(amount);
  if (!Number.isFinite(n)) return 0;
  if (unit === "mcg") return n / 1000;
  if (unit === "mg") return n;
  return 0; // ml, UI: no cuentan como peso acumulado
}

// Si el vial está repartido con uno o varios familiares, solo cuenta TU parte
// como "invertido" (el resto es de esas personas, aunque tú hayas pagado el vial).
function myShareOfCost(v: Vial): number {
  if (!v.cost) return 0;
  const cost = parseFloat(v.cost) || 0;
  const sharedPct = v.shares.reduce((sum, s) => sum + s.percent, 0);
  const myPct = Math.max(0, 100 - sharedPct);
  return (cost * myPct) / 100;
}

export function totalInvested(vials: Vial[]): number {
  return vials.reduce((sum, v) => sum + myShareOfCost(v), 0);
}

export function spendThisMonth(vials: Vial[], now: Date): number {
  const y = now.getFullYear();
  const m = now.getMonth();
  return vials.reduce((sum, v) => {
    const d = new Date(v.createdAt);
    if (d.getFullYear() === y && d.getMonth() === m) return sum + myShareOfCost(v);
    return sum;
  }, 0);
}

export function doneDoses(doses: Dose[]): Dose[] {
  return doses.filter((d) => d.done);
}

export type VialStatus = {
  totalMg: number;
  usedMg: number;
  remainingMg: number;
  pct: number; // 0-100
  dosesLeftEstimate: number | null;
  daysLeftEstimate: number | null;
  byMember: Record<string, number>; // memberId ("mine" para el dueño) -> nº de dosis
};

// Vida útil de referencia de un vial YA reconstituido (mezclado con agua), refrigerado.
// Es una ESTIMACIÓN habitual en la comunidad, no consejo médico — cada péptido varía.
export const RECON_SHELF_LIFE_DAYS = 30;
const DAY_MS = 86400000;

export type VialLifecycle = {
  reconstituted: boolean;
  expiryAt: number; // timestamp de caducidad estimada (solo si reconstituido)
  daysToExpiry: number; // puede ser negativo (ya caducó)
  depletionAt: number | null; // timestamp estimado en que se agota (según ritmo real de dosis)
  daysToDeplete: number | null;
  verdict: "expired" | "waste" | "deplete" | "ok";
};

// Cruza CADUCIDAD (por reconstitución) vs AGOTAMIENTO (por ritmo de dosis) para avisar
// si el vial vencerá antes de gastarse (desperdicio) o si te quedarás sin producto antes.
export function vialLifecycle(vial: Vial, doses: Dose[], now: Date): VialLifecycle | null {
  if (!vial.bacWater) return null; // solo aplica a viales reconstituidos
  const reconstitutedAt = new Date(vial.createdAt).getTime();
  if (!Number.isFinite(reconstitutedAt)) return null;

  const nowMs = now.getTime();
  const expiryAt = reconstitutedAt + RECON_SHELF_LIFE_DAYS * DAY_MS;
  const daysToExpiry = Math.round((expiryAt - nowMs) / DAY_MS);

  const status = vialStatus(vial, doses);
  let depletionAt: number | null = null;
  let daysToDeplete: number | null = null;
  if (status && status.daysLeftEstimate != null && status.pct > 0) {
    daysToDeplete = status.daysLeftEstimate;
    depletionAt = nowMs + status.daysLeftEstimate * DAY_MS;
  }

  let verdict: VialLifecycle["verdict"];
  if (daysToExpiry < 0) verdict = "expired";
  else if (depletionAt != null && expiryAt < depletionAt) verdict = "waste";
  else if (depletionAt != null && depletionAt <= expiryAt) verdict = "deplete";
  else verdict = "ok";

  return { reconstituted: true, expiryAt, daysToExpiry, depletionAt, daysToDeplete, verdict };
}

// Estima cuánto queda de un vial a partir de las dosis aplicadas desde que se abrió.
// Solo funciona para unidades de peso (mg/mcg); ml/UI no se pueden sumar así.
export function vialStatus(vial: Vial, doses: Dose[]): VialStatus | null {
  if (vial.unit !== "mg" && vial.unit !== "mcg") return null;
  const totalMg = toMg(vial.amount, vial.unit);
  if (totalMg <= 0) return null;

  const vialOpenedAt = new Date(vial.createdAt).getTime();
  const relevant = doneDoses(doses).filter(
    (d) => d.peptideId === vial.peptideId && new Date(d.scheduledAt).getTime() >= vialOpenedAt
  );
  const usedMg = relevant.reduce((sum, d) => sum + toMg(d.amount, d.unit), 0);
  const remainingMg = Math.max(0, totalMg - usedMg);
  const pct = Math.max(0, Math.min(100, Math.round((remainingMg / totalMg) * 100)));

  let dosesLeftEstimate: number | null = null;
  let daysLeftEstimate: number | null = null;
  if (relevant.length >= 2) {
    const avgDoseMg = usedMg / relevant.length;
    if (avgDoseMg > 0) dosesLeftEstimate = Math.floor(remainingMg / avgDoseMg);
    const times = relevant.map((d) => new Date(d.scheduledAt).getTime()).sort((a, b) => a - b);
    const spanDays = (times[times.length - 1] - times[0]) / 86400000;
    const avgIntervalDays = spanDays / (relevant.length - 1);
    if (dosesLeftEstimate != null && avgIntervalDays > 0) {
      daysLeftEstimate = Math.max(0, Math.round(dosesLeftEstimate * avgIntervalDays));
    }
  }

  const byMember: Record<string, number> = {};
  for (const d of relevant) {
    const key = d.forMemberId || "mine";
    byMember[key] = (byMember[key] || 0) + 1;
  }

  return { totalMg, usedMg, remainingMg, pct, dosesLeftEstimate, daysLeftEstimate, byMember };
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

// Filtra los datos por el rango de fecha seleccionado (para las estadísticas).
export function filterDataByRange(data: AppData, key: DateRangeKey, custom: CustomRange | null): AppData {
  return {
    ...data,
    doses: data.doses.filter((d) => isWithinRange(d.scheduledAt, key, custom)),
    healthLogs: data.healthLogs.filter((h) => isWithinRange(h.date, key, custom)),
    vials: data.vials.filter((v) => isWithinRange(v.createdAt, key, custom)),
    meals: data.meals.filter((m) => isWithinRange(m.date, key, custom)),
  };
}

export type Bucket = { label: string; value: number };

type Granularity = "hour" | "day" | "week" | "month" | "year";

function pickGranularity(spanDays: number): Granularity {
  if (spanDays <= 2) return "hour";
  if (spanDays <= 45) return "day";
  if (spanDays <= 130) return "week";
  if (spanDays <= 900) return "month";
  return "year";
}

function bucketKey(d: Date, g: Granularity): string {
  const y = d.getFullYear();
  const m = d.getMonth();
  if (g === "year") return `${y}`;
  if (g === "month") return `${y}-${m}`;
  if (g === "week") {
    const onejan = new Date(y, 0, 1);
    const week = Math.floor((d.getTime() - onejan.getTime()) / (7 * 86400000));
    return `${y}-w${week}`;
  }
  if (g === "day") return `${y}-${m}-${d.getDate()}`;
  return `${y}-${m}-${d.getDate()}-${d.getHours()}`;
}

function bucketLabel(d: Date, g: Granularity, locale: string): string {
  if (g === "year") return `${d.getFullYear()}`;
  if (g === "month")
    return d.toLocaleDateString(locale, { month: "short" }).replace(".", "");
  if (g === "hour") return `${d.getHours()}h`;
  // day / week
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" }).replace(".", "");
}

// Agrupa las dosis APLICADAS en barras a lo largo del rango elegido.
export function doseBuckets(
  data: AppData,
  key: DateRangeKey,
  custom: CustomRange | null,
  now: Date,
  locale: string
): Bucket[] {
  const done = doneDoses(data.doses).filter((d) => isWithinRange(d.scheduledAt, key, custom));

  let start: Date | null =
    key === "custom" && custom ? new Date(`${custom.start}T00:00:00`) : rangeStart(key);
  const end = key === "custom" && custom ? new Date(`${custom.end}T23:59:59`) : now;

  if (!start) {
    // "all": usar la fecha de la dosis más antigua
    const times = done.map((d) => new Date(d.scheduledAt).getTime());
    start = times.length ? new Date(Math.min(...times)) : new Date(now);
  }

  const spanDays = Math.max(1, (end.getTime() - start.getTime()) / 86400000);
  const g = pickGranularity(spanDays);

  // Genera los buckets vacíos en orden
  const buckets: { key: string; label: string; value: number }[] = [];
  const seen = new Map<string, number>();
  const cursor = new Date(start);
  let guard = 0;
  while (cursor.getTime() <= end.getTime() && guard < 400) {
    const k = bucketKey(cursor, g);
    if (!seen.has(k)) {
      seen.set(k, buckets.length);
      buckets.push({ key: k, label: bucketLabel(cursor, g, locale), value: 0 });
    }
    if (g === "hour") cursor.setHours(cursor.getHours() + 1);
    else if (g === "day" || g === "week") cursor.setDate(cursor.getDate() + (g === "week" ? 7 : 1));
    else if (g === "month") cursor.setMonth(cursor.getMonth() + 1);
    else cursor.setFullYear(cursor.getFullYear() + 1);
    guard++;
  }

  for (const d of done) {
    const k = bucketKey(new Date(d.scheduledAt), g);
    const idx = seen.get(k);
    if (idx != null) buckets[idx].value += 1;
  }

  return buckets.map((b) => ({ label: b.label, value: b.value }));
}

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
