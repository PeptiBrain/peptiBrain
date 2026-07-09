"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X, Check, Clock, AlertTriangle } from "lucide-react";
import type { AppData, Dose } from "@/lib/app-data";

function toIsoDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type DoseStatus = "hecha" | "programada" | "atrasada";

function doseStatus(dose: Dose): DoseStatus {
  if (dose.done) return "hecha";
  return new Date(dose.scheduledAt).getTime() < Date.now() ? "atrasada" : "programada";
}

export function CalendarModal({
  open,
  onClose,
  data,
  peptideName,
}: {
  open: boolean;
  onClose: () => void;
  data: AppData;
  peptideName: (peptideId: string) => string;
}) {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedIso, setSelectedIso] = useState(() => toIsoDate(today));

  const dosesByDay = useMemo(() => {
    const map = new Map<string, Dose[]>();
    for (const dose of data.doses) {
      const iso = toIsoDate(new Date(dose.scheduledAt));
      const list = map.get(iso) || [];
      list.push(dose);
      map.set(iso, list);
    }
    return map;
  }, [data.doses]);

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(cursor);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // lunes = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [cursor]);

  const selectedDoses = dosesByDay.get(selectedIso) || [];
  const selectedDate = new Date(`${selectedIso}T00:00:00`);
  const selectedLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-5 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">{t("title")}</h2>
                <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                aria-label={t("prevMonth")}
                className="flex size-8 items-center justify-center rounded-full hover:bg-secondary"
              >
                <ChevronLeft className="size-4 text-foreground" aria-hidden />
              </button>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold capitalize text-foreground">{monthLabel}</p>
                <button
                  type="button"
                  onClick={() => {
                    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
                    setSelectedIso(toIsoDate(today));
                  }}
                  className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {t("today")}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                aria-label={t("nextMonth")}
                className="flex size-8 items-center justify-center rounded-full hover:bg-secondary"
              >
                <ChevronRight className="size-4 text-foreground" aria-hidden />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {t("weekdays")
                .split(",")
                .map((d, i) => (
                  <span key={i}>{d}</span>
                ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const iso = toIsoDate(new Date(cursor.getFullYear(), cursor.getMonth(), day));
                const dayDoses = dosesByDay.get(iso) || [];
                const isSelected = iso === selectedIso;
                const isToday = iso === toIsoDate(today);
                const hasAtrasada = dayDoses.some((d) => doseStatus(d) === "atrasada");
                const hasHecha = dayDoses.some((d) => doseStatus(d) === "hecha");
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setSelectedIso(iso)}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors ${
                      isSelected
                        ? "border border-primary bg-accent font-semibold text-accent-foreground"
                        : isToday
                          ? "font-semibold text-primary"
                          : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {day}
                    {dayDoses.length > 0 && (
                      <span
                        className={`absolute bottom-1 size-1.5 rounded-full ${
                          hasAtrasada
                            ? "bg-destructive"
                            : hasHecha
                              ? "bg-primary"
                              : "bg-[var(--notice-icon)]"
                        }`}
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Check className="size-3.5 text-primary" aria-hidden /> {t("legendDone")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-[var(--notice-icon)]" aria-hidden /> {t("legendScheduled")}
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle className="size-3.5 text-destructive" aria-hidden /> {t("legendLate")}
              </span>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <p className="text-sm font-semibold capitalize text-foreground">{selectedLabel}</p>
              {selectedDoses.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">{t("noDosesThisDay")}</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {selectedDoses.map((dose) => {
                    const status = doseStatus(dose);
                    return (
                      <li
                        key={dose.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm"
                      >
                        <span className="min-w-0 truncate text-foreground">
                          {peptideName(dose.peptideId)} · {dose.amount} {dose.unit}
                        </span>
                        <span
                          className={`shrink-0 text-xs font-medium ${
                            status === "hecha"
                              ? "text-primary"
                              : status === "atrasada"
                                ? "text-destructive"
                                : "text-[var(--notice-icon)]"
                          }`}
                        >
                          {status === "hecha" ? t("legendDone") : status === "atrasada" ? t("legendLate") : t("legendScheduled")}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
