export type DateRangeKey = "today" | "7d" | "30d" | "all";

export const DATE_RANGE_KEYS: DateRangeKey[] = ["today", "7d", "30d", "all"];

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
  return null;
}

export function isWithinRange(isoDate: string, key: DateRangeKey): boolean {
  const start = rangeStart(key);
  if (!start) return true;
  const value = new Date(isoDate);
  return value.getTime() >= start.getTime();
}
