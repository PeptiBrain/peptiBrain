"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { todayIso, type CustomRange, type DateRangeKey } from "@/lib/date-range";

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

  // BUG DE DATOS FALSOS: al pulsar "Personalizado", los recuadros MOSTRABAN
  // hoy–hoy pero el estado del padre seguía en null, y un rango personalizado
  // vacío significa "no filtres nada" en isWithinRange(). Resultado: la
  // pantalla decía "26/07–26/07" mientras seguía contando registros de otros
  // días. Solo se corregía si el usuario tocaba una fecha a mano.
  // Aquí se sube el rango por defecto en cuanto se entra en "Personalizado",
  // para que lo que se VE y lo que se APLICA sean siempre lo mismo.
  useEffect(() => {
    if (value === "custom" && !customRange && onCustomRangeChange) {
      onCustomRangeChange({ start: todayIso(), end: todayIso() });
    }
  }, [value, customRange, onCustomRangeChange]);

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
