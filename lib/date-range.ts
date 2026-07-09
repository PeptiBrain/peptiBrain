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

export function isWithinRange(isoDate: string, key: DateRangeKey, custom?: CustomRange | null): boolean {
  if (key === "custom") {
    if (!custom) return true;
    const value = new Date(isoDate).getTime();
    const start = new Date(`${custom.start}T00:00:00`).getTime();
    const end = new Date(`${custom.end}T23:59:59`).getTime();
    return value >= start && value <= end;
  }
  const start = rangeStart(key);
  if (!start) return true;
  const value = new Date(isoDate);
  return value.getTime() >= start.getTime();
}
