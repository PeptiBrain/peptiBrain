"use client";

import { useTranslations } from "next-intl";
import type { CustomRange, DateRangeKey } from "@/lib/date-range";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function DateRangeTabs({
  value,
  onChange,
  customRange,
  onCustomRangeChange,
}: {
  value: DateRangeKey;
  onChange: (key: DateRangeKey) => void;
  customRange?: CustomRange | null;
  onCustomRangeChange?: (range: CustomRange) => void;
}) {
  const t = useTranslations("DateRange");

  const OPTIONS: { key: DateRangeKey; label: string }[] = [
    { key: "today", label: t("today") },
    { key: "7d", label: t("last7") },
    { key: "30d", label: t("last30") },
    { key: "6m", label: t("last6m") },
    { key: "all", label: t("all") },
    { key: "custom", label: t("custom") },
  ];

  const range = customRange || { start: todayIso(), end: todayIso() };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto rounded-full border border-border bg-secondary/50 p-1">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={`h-8 shrink-0 rounded-full px-3 text-xs font-medium transition-colors ${
              value === o.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {value === "custom" && onCustomRangeChange && (
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-card p-2">
          <input
            type="date"
            value={range.start}
            max={range.end}
            onChange={(e) => onCustomRangeChange({ start: e.target.value, end: range.end })}
            className="h-9 flex-1 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
          />
          <span className="text-xs text-muted-foreground">{t("customTo")}</span>
          <input
            type="date"
            value={range.end}
            min={range.start}
            onChange={(e) => onCustomRangeChange({ start: range.start, end: e.target.value })}
            className="h-9 flex-1 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
          />
        </div>
      )}
    </div>
  );
}
