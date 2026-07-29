export type TrtFrequency = "weekly" | "twice-weekly" | "eod";

// Inyecciones por semana según frecuencia. EOD (cada 48h) da ~3.5/semana.
const INJECTIONS_PER_WEEK: Record<TrtFrequency, number> = {
  weekly: 1,
  "twice-weekly": 2,
  eod: 3.5,
};

export type TrtDoseResult = {
  mgPerInjection: number;
  mlPerInjection: number;
  units: number; // escala U-100 (100 unidades = 1 mL), igual convención que el resto de la app
};

// A partir de una dosis semanal total (mg) y la concentración del vial (mg/mL),
// reparte la dosis entre las inyecciones de esa frecuencia. La testosterona
// inyectable ya viene disuelta en aceite a una concentración fija — no hay
// paso de reconstitución como con los péptidos liofilizados.
export function calcTrtDose({
  weeklyDoseMg,
  concentrationMgPerMl,
  frequency,
}: {
  weeklyDoseMg: number;
  concentrationMgPerMl: number;
  frequency: TrtFrequency;
}): TrtDoseResult | null {
  if (!weeklyDoseMg || !concentrationMgPerMl || weeklyDoseMg <= 0 || concentrationMgPerMl <= 0) return null;
  const perWeek = INJECTIONS_PER_WEEK[frequency];
  const mgPerInjection = weeklyDoseMg / perWeek;
  const mlPerInjection = mgPerInjection / concentrationMgPerMl;
  return { mgPerInjection, mlPerInjection, units: mlPerInjection * 100 };
}
