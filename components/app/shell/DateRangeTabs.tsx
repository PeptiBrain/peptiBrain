"use client";

import { useTranslations } from "next-intl";
import type { DateRangeKey } from "@/lib/date-range";

export function DateRangeTabs({
  value,
  onChange,
}: {
  value: DateRangeKey;
  onChange: (key: DateRangeKey) => void;
}) {
  const t = useTranslations("DateRange");

  const OPTIONS: { key: DateRangeKey; label: string }[] = [
    { key: "today", label: t("today") },
    { key: "7d", label: t("last7") },
    { key: "30d", label: t("last30") },
    { key: "all", label: t("all") },
  ];

  return (
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
  );
}
