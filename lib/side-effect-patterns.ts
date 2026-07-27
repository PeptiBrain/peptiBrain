import type { Dose, HealthLog } from "@/lib/app-data";

// Cruza los efectos secundarios registrados con lo que el usuario tenía
// apuntado esos mismos días (dosis, sueño, hidratación) y devuelve
// COINCIDENCIAS CONTADAS.
//
// LÍNEA ROJA (D2): esto cuenta hechos, no diagnostica ni aconseja. La
// diferencia importa y es toda la diferencia:
//   ✅ "De tus 6 registros de náusea, 5 cayeron el mismo día de una dosis"
//   ❌ "La náusea te la causa la dosis" / "baja la dosis"
// Correlación no es causa, y aunque lo fuera, decidir qué hacer con eso es
// del médico. La app enseña el dato para que el usuario lo lleve a consulta —
// ese es justo el valor: llegar con datos en vez de con una sensación.
//
// Por eso tampoco se ordena por "gravedad" ni se marca nada en rojo.

export type SideEffectPattern = {
  effect: string; // el texto tal y como lo escribió el usuario (primera vez)
  total: number; // veces que lo registró
  sameDayAsDose: number; // de esas, cuántas coincidieron con una dosis aplicada
  avgSleepHours: number | null; // media de sueño en esos días (si lo apuntó)
  avgHydrationMl: number | null; // media de hidratación en esos días
};

// Con menos de 3 registros no hay patrón que enseñar: dos coincidencias son
// azar, y presentarlas como "patrón" sería sugerir algo que no está ahí.
const MIN_OCCURRENCES = 3;

function normalize(effect: string): string {
  return effect.trim().toLowerCase();
}

function average(values: number[]): number | null {
  const valid = values.filter((v) => Number.isFinite(v));
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

export function sideEffectPatterns(healthLogs: HealthLog[], doses: Dose[]): SideEffectPattern[] {
  // Días en los que SÍ se aplicó una dosis (las programadas no cuentan: no
  // pasó nada en el cuerpo ese día).
  const doseDays = new Set(
    doses
      .filter((d) => d.done)
      .map((d) => {
        const date = new Date(d.scheduledAt);
        if (!Number.isFinite(date.getTime())) return null;
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
          date.getDate()
        ).padStart(2, "0")}`;
      })
      .filter((d): d is string => d !== null)
  );

  const logsByDate = new Map(healthLogs.map((h) => [h.date, h]));

  const grouped = new Map<string, { label: string; logs: HealthLog[] }>();
  for (const log of healthLogs) {
    if (!log.sideEffect?.trim()) continue;
    const key = normalize(log.sideEffect);
    const entry = grouped.get(key);
    if (entry) entry.logs.push(log);
    else grouped.set(key, { label: log.sideEffect.trim(), logs: [log] });
  }

  const patterns: SideEffectPattern[] = [];
  for (const { label, logs } of grouped.values()) {
    if (logs.length < MIN_OCCURRENCES) continue;

    const sameDayAsDose = logs.filter((l) => doseDays.has(l.date)).length;
    const sleep = logs
      .map((l) => parseFloat(logsByDate.get(l.date)?.sleepHours || ""))
      .filter((n) => Number.isFinite(n));
    const hydration = logs
      .map((l) => parseFloat(logsByDate.get(l.date)?.hydrationMl || ""))
      .filter((n) => Number.isFinite(n));

    patterns.push({
      effect: label,
      total: logs.length,
      sameDayAsDose,
      avgSleepHours: average(sleep),
      avgHydrationMl: average(hydration),
    });
  }

  // Del más registrado al menos: "lo que más te pasa" es un orden neutral,
  // a diferencia de ordenar por supuesta gravedad.
  return patterns.sort((a, b) => b.total - a.total);
}
