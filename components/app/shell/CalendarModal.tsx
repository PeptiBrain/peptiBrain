"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X, Check, Clock, AlertTriangle, Pill, Plane, Dumbbell, Plus, Trash2 } from "lucide-react";
import type { AppData, Dose } from "@/lib/app-data";
import { addTrip, removeTrip } from "@/lib/app-data";

function toIsoDate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

type DoseStatus = "hecha" | "programada" | "atrasada";
type Filter = "peptides" | "trips" | "exercise";

function doseStatus(dose: Dose): DoseStatus {
  if (dose.done) return "hecha";
  return new Date(dose.scheduledAt).getTime() < Date.now() ? "atrasada" : "programada";
}

export function CalendarModal({
  open,
  onClose,
  data,
  peptideName,
  onDataChange,
}: {
  open: boolean;
  onClose: () => void;
  data: AppData;
  peptideName: (peptideId: string) => string;
  onDataChange?: (next: AppData) => void;
}) {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const today = new Date();
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedIso, setSelectedIso] = useState(() => toIsoDate(today));
  const [filters, setFilters] = useState<Record<Filter, boolean>>({ peptides: true, trips: true, exercise: true });
  const [addingTrip, setAddingTrip] = useState(false);
  const [tripEnd, setTripEnd] = useState("");
  const [tripDest, setTripDest] = useState("");

  function toggle(f: Filter) {
    setFilters((prev) => ({ ...prev, [f]: !prev[f] }));
  }

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

  // Días con ejercicio (desde Salud)
  const exerciseDays = useMemo(() => {
    const set = new Set<string>();
    for (const h of data.healthLogs) {
      if (h.exerciseMin && parseFloat(h.exerciseMin) > 0) set.add(h.date);
    }
    return set;
  }, [data.healthLogs]);

  // Días de viaje (rango de cada viaje)
  const tripDays = useMemo(() => {
    const map = new Map<string, string | undefined>();
    for (const tr of data.trips || []) {
      const start = new Date(`${tr.startDate}T00:00:00`);
      const end = new Date(`${tr.endDate}T00:00:00`);
      const cur = new Date(start);
      let guard = 0;
      while (cur.getTime() <= end.getTime() && guard < 400) {
        map.set(toIsoDate(cur), tr.destination);
        cur.setDate(cur.getDate() + 1);
        guard++;
      }
    }
    return map;
  }, [data.trips]);

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(cursor);

  const cells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: (number | null)[] = Array(startOffset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) result.push(d);
    return result;
  }, [cursor]);

  const selectedDoses = dosesByDay.get(selectedIso) || [];
  const selectedHasExercise = exerciseDays.has(selectedIso);
  const selectedTrip = tripDays.has(selectedIso);
  const selectedDestination = tripDays.get(selectedIso);
  const selectedDate = new Date(`${selectedIso}T00:00:00`);
  const selectedLabel = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(selectedDate);

  const selectedTripObj = (data.trips || []).find(
    (tr) => selectedIso >= tr.startDate && selectedIso <= tr.endDate
  );

  async function saveTrip() {
    if (!onDataChange) return;
    const end = tripEnd || selectedIso;
    const next = await addTrip(data, { startDate: selectedIso, endDate: end, destination: tripDest });
    onDataChange(next);
    setAddingTrip(false);
    setTripEnd("");
    setTripDest("");
  }

  async function deleteTrip(id: string) {
    if (!onDataChange) return;
    onDataChange(await removeTrip(data, id));
  }

  const CHIPS: { key: Filter; label: string; icon: typeof Pill }[] = [
    { key: "peptides", label: t("filterPeptides"), icon: Pill },
    { key: "trips", label: t("filterTrips"), icon: Plane },
    { key: "exercise", label: t("filterExercise"), icon: Dumbbell },
  ];

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
            className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-2xl bg-card p-5 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                  <ChevronRight className="hidden" aria-hidden />
                  <Pill className="size-5 text-primary" aria-hidden />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">{t("title")}</h2>
                  <p className="text-xs text-muted-foreground">{t("subtitleFull")}</p>
                </div>
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

            {/* Filtros */}
            <div className="mt-3 flex flex-wrap gap-2">
              {CHIPS.map((c) => {
                const on = filters[c.key];
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => toggle(c.key)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      on
                        ? "border-primary bg-accent text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <c.icon className="size-3.5" aria-hidden /> {c.label}
                  </button>
                );
              })}
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
                const showDose = filters.peptides && dayDoses.length > 0;
                const showTrip = filters.trips && tripDays.has(iso);
                const showEx = filters.exercise && exerciseDays.has(iso);
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
                    <span className="absolute bottom-1 flex items-center gap-0.5">
                      {showDose && (
                        <span
                          className={`size-1.5 rounded-full ${
                            hasAtrasada ? "bg-destructive" : hasHecha ? "bg-primary" : "bg-[var(--notice-icon)]"
                          }`}
                          aria-hidden
                        />
                      )}
                      {showTrip && <Plane className="size-2.5 text-sky-500" aria-hidden />}
                      {showEx && <Dumbbell className="size-2.5 text-violet-500" aria-hidden />}
                    </span>
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
              <span className="flex items-center gap-1">
                <Plane className="size-3.5 text-sky-500" aria-hidden /> {t("filterTrips")}
              </span>
              <span className="flex items-center gap-1">
                <Dumbbell className="size-3.5 text-violet-500" aria-hidden /> {t("filterExercise")}
              </span>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold capitalize text-foreground">{selectedLabel}</p>
                {onDataChange && !selectedTripObj && (
                  <button
                    type="button"
                    onClick={() => setAddingTrip((a) => !a)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Plus className="size-3.5" aria-hidden /> {t("addTrip")}
                  </button>
                )}
              </div>

              {addingTrip && (
                <div className="mt-2 space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{t("tripFrom")}:</span>
                    <span className="font-medium text-foreground">{selectedLabel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{t("tripTo")}:</span>
                    <input
                      type="date"
                      value={tripEnd}
                      min={selectedIso}
                      onChange={(e) => setTripEnd(e.target.value)}
                      className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm text-foreground"
                    />
                  </div>
                  <input
                    value={tripDest}
                    onChange={(e) => setTripDest(e.target.value)}
                    placeholder={t("tripDestPlaceholder")}
                    className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground"
                  />
                  <button
                    type="button"
                    onClick={saveTrip}
                    className="h-9 w-full rounded-md bg-primary text-xs font-semibold text-primary-foreground"
                  >
                    {t("saveTrip")}
                  </button>
                </div>
              )}

              {/* Viaje del día */}
              {filters.trips && selectedTripObj && (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 dark:border-sky-900 dark:bg-sky-950/40">
                  <span className="flex items-center gap-2 text-sm text-foreground">
                    <Plane className="size-4 text-sky-500" aria-hidden />
                    {selectedDestination || t("tripLabel")}
                  </span>
                  {onDataChange && (
                    <button
                      type="button"
                      onClick={() => deleteTrip(selectedTripObj.id)}
                      aria-label={t("deleteTrip")}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                    </button>
                  )}
                </div>
              )}

              {/* Ejercicio del día */}
              {filters.exercise && selectedHasExercise && (
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-foreground dark:border-violet-900 dark:bg-violet-950/40">
                  <Dumbbell className="size-4 text-violet-500" aria-hidden /> {t("exerciseLabel")}
                </div>
              )}

              {/* Dosis del día */}
              {filters.peptides &&
                (selectedDoses.length === 0 && !selectedTrip && !selectedHasExercise ? (
                  <p className="mt-2 text-sm text-muted-foreground">{t("noEventsThisDay")}</p>
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
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
