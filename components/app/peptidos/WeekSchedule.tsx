"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import type { Dose, Peptide } from "@/lib/app-data";

const DAY_MS = 86400000;

// Lunes de la semana que contiene `d` (semana Lun–Dom).
function startOfWeek(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (x.getDay() + 6) % 7; // 0 = lunes
  x.setDate(x.getDate() - day);
  return x;
}

// Vista semanal del protocolo: qué toca cada día y qué días son de descanso.
export function WeekSchedule({ doses, peptides }: { doses: Dose[]; peptides: Peptide[] }) {
  const t = useTranslations("Peptidos");
  const locale = useLocale();
  const [offset, setOffset] = useState(0); // semanas respecto a la actual

  const { days, todayKey, rangeLabel } = useMemo(() => {
    const now = new Date();
    const todayKey = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = startOfWeek(now);
    weekStart.setDate(weekStart.getDate() + offset * 7);

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart.getTime() + i * DAY_MS);
      const key = date.getTime();
      const items = doses
        .filter((d) => {
          const dd = new Date(d.scheduledAt);
          const dk = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate()).getTime();
          return dk === key;
        })
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
      return { date, key, items };
    });

    const rangeLabel = `${weekStart.toLocaleDateString(locale, { day: "numeric", month: "short" })} – ${new Date(
      weekStart.getTime() + 6 * DAY_MS
    ).toLocaleDateString(locale, { day: "numeric", month: "short" })}`;

    return { days, todayKey, rangeLabel };
  }, [offset, doses, locale]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <CalendarDays className="size-4 text-primary" aria-hidden /> {t("weekScheduleTitle")}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOffset((o) => o - 1)}
            aria-label={t("weekPrev")}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <span className="min-w-[7.5rem] text-center text-xs font-medium text-foreground tabular-nums">
            {offset === 0 ? t("weekThis") : rangeLabel}
          </span>
          <button
            type="button"
            onClick={() => setOffset((o) => o + 1)}
            aria-label={t("weekNext")}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <ul className="space-y-1.5">
        {days.map((day) => {
          const isToday = day.key === todayKey;
          return (
            <li
              key={day.key}
              className={`flex gap-3 rounded-xl border p-2.5 ${
                isToday ? "border-primary/40 bg-primary/5" : "border-border/70"
              }`}
            >
              <div className="w-12 shrink-0 text-center">
                <p className={`text-[10px] font-semibold uppercase ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                  {day.date.toLocaleDateString(locale, { weekday: "short" })}
                </p>
                <p className={`text-base font-bold tabular-nums ${isToday ? "text-primary" : "text-foreground"}`}>
                  {day.date.getDate()}
                </p>
              </div>
              <div className="min-w-0 flex-1 self-center">
                {day.items.length === 0 ? (
                  <p className="text-xs italic text-muted-foreground">{t("weekRest")}</p>
                ) : (
                  <ul className="space-y-1">
                    {day.items.map((d) => {
                      const peptide = peptides.find((p) => p.id === d.peptideId);
                      return (
                        <li key={d.id} className="flex items-center gap-2 text-xs">
                          <span
                            className={`size-1.5 shrink-0 rounded-full ${d.done ? "bg-primary" : "bg-muted-foreground/50"}`}
                            aria-hidden
                          />
                          <span className="truncate font-medium text-foreground">{peptide?.name || "—"}</span>
                          <span className="shrink-0 text-muted-foreground">
                            {d.amount} {d.unit}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
