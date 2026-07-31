// Calcula la hora habitual en la que un usuario suele aplicarse un péptido, a
// partir de su historial de dosis ya cumplidas — para poder avisarle si pasó
// esa hora y todavía no registró nada hoy. Es un recordatorio inferido, no uno
// que el usuario tenga que configurar a mano.

const MIN_SAMPLES = 3;
// Qué tan agrupadas tienen que estar las horas históricas para considerarlas un
// hábito real (0 = totalmente disperso en el día, 1 = siempre a la misma hora
// exacta). Por debajo de esto, el patrón es demasiado irregular para avisar.
const CONSISTENCY_THRESHOLD = 0.6;

export type UsualTime = { minutesOfDay: number; consistency: number };

// `timestamps`: ISO strings de dosis YA cumplidas (scheduled_at de doses.done=true)
// para un mismo usuario+péptido. Usa una media circular (no aritmética) para que
// horas cercanas a medianoche (23:50 y 00:10) promedien correctamente cerca de
// medianoche, no al mediodía.
export function computeUsualTime(timestamps: string[]): UsualTime | null {
  if (timestamps.length < MIN_SAMPLES) return null;

  let sumSin = 0;
  let sumCos = 0;
  for (const ts of timestamps) {
    const d = new Date(ts);
    const minutesOfDay = d.getUTCHours() * 60 + d.getUTCMinutes();
    const angle = (minutesOfDay / 1440) * 2 * Math.PI;
    sumSin += Math.sin(angle);
    sumCos += Math.cos(angle);
  }
  const n = timestamps.length;
  const avgSin = sumSin / n;
  const avgCos = sumCos / n;
  const meanAngle = Math.atan2(avgSin, avgCos);
  const normalizedAngle = meanAngle < 0 ? meanAngle + 2 * Math.PI : meanAngle;
  const minutesOfDay = (normalizedAngle / (2 * Math.PI)) * 1440;

  // Longitud del vector resultante: 1 = todas las horas idénticas, 0 = disperso.
  const consistency = Math.sqrt(avgSin ** 2 + avgCos ** 2);

  return { minutesOfDay, consistency };
}

export function isHabitual(usual: UsualTime | null): usual is UsualTime {
  return usual !== null && usual.consistency >= CONSISTENCY_THRESHOLD;
}

// Ventana de aviso: 30 a 90 minutos DESPUÉS de la hora habitual — ni tan pronto
// que parezca un error, ni tan tarde que ya no tenga sentido avisar hoy.
const WINDOW_START_MIN = 30;
const WINDOW_END_MIN = 90;

export function isWithinReminderWindow(nowMinutesOfDay: number, usualMinutesOfDay: number): boolean {
  const diff = (((nowMinutesOfDay - usualMinutesOfDay) % 1440) + 1440) % 1440;
  return diff >= WINDOW_START_MIN && diff <= WINDOW_END_MIN;
}
