export type DateRangeKey = "today" | "7d" | "30d" | "6m" | "all" | "custom";

export const DATE_RANGE_KEYS: DateRangeKey[] = ["today", "7d", "30d", "6m", "all", "custom"];

export type CustomRange = { start: string; end: string }; // ISO yyyy-mm-dd, ambos inclusive

export function rangeStart(key: DateRangeKey): Date | null {
  const now = new Date();
  if (key === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (key === "7d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (key === "30d") {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    return d;
  }
  if (key === "6m") {
    const d = new Date(now);
    d.setMonth(d.getMonth() - 6);
    return d;
  }
  return null;
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
