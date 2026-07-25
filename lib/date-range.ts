// Fecha de HOY en la hora local del navegador, formato yyyy-mm-dd.
// `new Date().toISOString().slice(0,10)` (usado antes en varios sitios) da
// la fecha UTC: para cualquier huso al oeste de UTC, por la tarde/noche ya
// cae en "mañana" — un formulario de peso/comida/protocolo se abría con la
// fecha equivocada precargada.
export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export type DateRangeKey =
  | "today"
  | "7d"
  | "30d"
  | "3m"
  | "6m"
  | "1y"
  | "2y"
  | "3y"
  | "5y"
  | "10y"
  | "all"
  | "custom";

// Tabs compactas usadas en Inicio/Péptidos/Salud (no cambian).
export const DATE_RANGE_KEYS: DateRangeKey[] = ["today", "7d", "30d", "6m", "all", "custom"];

// Lista completa para la página de Estadísticas (diario → últimos 10 años).
export const STATS_RANGE_KEYS: DateRangeKey[] = [
  "today",
  "7d",
  "30d",
  "3m",
  "6m",
  "1y",
  "2y",
  "3y",
  "5y",
  "10y",
  "all",
  "custom",
];

export type CustomRange = { start: string; end: string }; // ISO yyyy-mm-dd, ambos inclusive

export function rangeStart(key: DateRangeKey): Date | null {
  const now = new Date();
  if (key === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  const d = new Date(now);
  switch (key) {
    case "7d":
      d.setDate(d.getDate() - 7);
      return d;
    case "30d":
      d.setDate(d.getDate() - 30);
      return d;
    case "3m":
      d.setMonth(d.getMonth() - 3);
      return d;
    case "6m":
      d.setMonth(d.getMonth() - 6);
      return d;
    case "1y":
      d.setFullYear(d.getFullYear() - 1);
      return d;
    case "2y":
      d.setFullYear(d.getFullYear() - 2);
      return d;
    case "3y":
      d.setFullYear(d.getFullYear() - 3);
      return d;
    case "5y":
      d.setFullYear(d.getFullYear() - 5);
      return d;
    case "10y":
      d.setFullYear(d.getFullYear() - 10);
      return d;
    default:
      return null; // all / custom
  }
}

// Los campos "solo fecha" (yyyy-mm-dd, sin hora — peso/comidas/salud) se
// interpretan como medianoche LOCAL, no UTC: `new Date("2026-07-25")` cae en
// medianoche UTC, que para cualquier huso horario al oeste de UTC (América)
// sigue siendo "ayer" en la hora local, así que un registro de "hoy" se
// clasificaba mal en los rangos "Hoy"/"7 días" mientras que las dosis (que sí
// llevan hora completa) se clasificaban bien — inconsistencia entre pantallas.
function parseIsoLocal(isoDate: string): number {
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(isoDate);
  if (dateOnly) {
    const [y, m, d] = isoDate.split("-").map(Number);
    return new Date(y, m - 1, d).getTime();
  }
  return new Date(isoDate).getTime();
}

export function isWithinRange(isoDate: string, key: DateRangeKey, custom?: CustomRange | null): boolean {
  if (key === "custom") {
    if (!custom) return true;
    const value = parseIsoLocal(isoDate);
    const start = new Date(`${custom.start}T00:00:00`).getTime();
    const end = new Date(`${custom.end}T23:59:59`).getTime();
    return value >= start && value <= end;
  }
  const start = rangeStart(key);
  if (!start) return true; // "all": sin límite, ni pasado ni futuro
  const value = parseIsoLocal(isoDate);
  // "today"/"7d"/"30d"/etc. representan actividad YA ocurrida hasta ahora —
  // sin este límite superior, una dosis con fecha futura (reloj adelantado,
  // dato de prueba, edición manual) contaba como "de hoy" o "de esta semana"
  // en cualquier pantalla que usara estos rangos.
  return value >= start.getTime() && value <= Date.now();
}
