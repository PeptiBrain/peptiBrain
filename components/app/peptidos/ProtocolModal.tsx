"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarClock, Plus, X } from "lucide-react";
import { ModalShell } from "@/components/app/shell/ModalShell";
import type { Peptide, TitrationStep } from "@/lib/app-data";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const INTERVAL_OPTIONS = [1, 2, 3, 7, 14];
const MAX_PROTOCOL_DOSES = 60;

let stepIdCounter = 0;
function newStep(): TitrationStep & { id: string } {
  stepIdCounter += 1;
  return { id: `s${stepIdCounter}`, amount: "", weeks: 4 };
}

export function ProtocolModal({
  open,
  onClose,
  peptides,
  onSave,
  onSaveTitration,
}: {
  open: boolean;
  onClose: () => void;
  peptides: Peptide[];
  onSave: (payload: {
    peptideId: string;
    amount: string;
    unit: string;
    startDate: string;
    time: string;
    intervalDays: number;
    weeks: number;
  }) => Promise<void>;
  onSaveTitration: (payload: {
    peptideId: string;
    unit: string;
    startDate: string;
    time: string;
    intervalDays: number;
    steps: TitrationStep[];
  }) => Promise<void>;
}) {
  const t = useTranslations("Peptidos");
  const [mode, setMode] = useState<"fixed" | "titration">("fixed");
  const [peptideId, setPeptideId] = useState(peptides[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("mg");
  const [startDate, setStartDate] = useState(todayIso());
  const [time, setTime] = useState("08:00");
  const [intervalDays, setIntervalDays] = useState(1);
  const [weeks, setWeeks] = useState("4");
  const [steps, setSteps] = useState<(TitrationStep & { id: string })[]>([newStep(), newStep()]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setMode("fixed");
      setPeptideId(peptides[0]?.id || "");
      setAmount("");
      setUnit("mg");
      setStartDate(todayIso());
      setTime("08:00");
      setIntervalDays(1);
      setWeeks("4");
      setSteps([newStep(), newStep()]);
    }
  }, [open, peptides]);

  const weeksNum = Math.max(1, Math.min(24, Number(weeks) || 1));
  const doseCount = Math.min(60, Math.max(1, Math.ceil((weeksNum * 7) / intervalDays)));

  function addStep() {
    setSteps((prev) => [...prev, newStep()]);
  }
  function removeStep(id: string) {
    setSteps((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  }
  function updateStep(id: string, patch: Partial<TitrationStep>) {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  // Previsualización pura en el cliente: para cada escalón, calcula su rango de
  // semanas y cuántas dosis genera, sin escribir nada en la base de datos todavía.
  const titrationPreview = useMemo(() => {
    let weekCursor = 0;
    let doseTotal = 0;
    return steps.map((s) => {
      const fromWeek = weekCursor + 1;
      const toWeek = weekCursor + Math.max(1, s.weeks);
      weekCursor = toWeek;
      const stepDoseCount = Math.max(1, Math.ceil((Math.max(1, s.weeks) * 7) / intervalDays));
      const remaining = Math.max(0, MAX_PROTOCOL_DOSES - doseTotal);
      const cappedCount = Math.min(stepDoseCount, remaining);
      doseTotal += cappedCount;
      return { id: s.id, fromWeek, toWeek, amount: s.amount, doseCount: cappedCount };
    });
  }, [steps, intervalDays]);

  const titrationTotalDoses = titrationPreview.reduce((sum, p) => sum + p.doseCount, 0);
  const titrationValid = steps.every((s) => s.amount.trim()) && titrationTotalDoses > 0;

  async function handleSave() {
    if (!peptideId) return;
    setSaving(true);
    try {
      if (mode === "fixed") {
        if (!amount.trim()) return;
        await onSave({ peptideId, amount: amount.trim(), unit, startDate, time, intervalDays, weeks: weeksNum });
      } else {
        if (!titrationValid) return;
        await onSaveTitration({
          peptideId,
          unit,
          startDate,
          time,
          intervalDays,
          steps: steps.map((s) => ({ amount: s.amount.trim(), weeks: Math.max(1, s.weeks) })),
        });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={t("createProtocolTitle")}
      icon={<CalendarClock className="size-5 text-primary" aria-hidden />}
    >
      <div className="space-y-3">
        {peptides.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("createProtocolNoPeptides")}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("fixed")}
                className={`h-10 rounded-lg border text-sm font-medium ${
                  mode === "fixed" ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
                }`}
              >
                {t("protocolModeFixed")}
              </button>
              <button
                type="button"
                onClick={() => setMode("titration")}
                className={`h-10 rounded-lg border text-sm font-medium ${
                  mode === "titration" ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
                }`}
              >
                {t("protocolModeTitration")}
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t("selectPeptideLabel")}
              </label>
              <select
                value={peptideId}
                onChange={(e) => setPeptideId(e.target.value)}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground"
              >
                {peptides.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {mode === "fixed" ? (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t("doseLabel")}</label>
                <div className="flex gap-2">
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                    placeholder="0.25"
                    className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="h-11 w-24 rounded-lg border border-input bg-background px-2 text-base text-foreground"
                  >
                    <option value="mg">mg</option>
                    <option value="mcg">mcg</option>
                    <option value="ml">ml</option>
                    <option value="UI">UI</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">{t("titrationStepsLabel")}</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="h-8 rounded-lg border border-input bg-background px-2 text-xs text-foreground"
                  >
                    <option value="mg">mg</option>
                    <option value="mcg">mcg</option>
                    <option value="ml">ml</option>
                    <option value="UI">UI</option>
                  </select>
                </div>
                <div className="space-y-2">
                  {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 rounded-lg border border-border p-2">
                      <span className="w-6 shrink-0 text-center text-xs font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      <input
                        value={s.amount}
                        onChange={(e) => updateStep(s.id, { amount: e.target.value })}
                        inputMode="decimal"
                        placeholder={t("titrationDosePlaceholder")}
                        className="h-10 flex-1 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
                      />
                      <input
                        value={s.weeks}
                        onChange={(e) => updateStep(s.id, { weeks: Math.max(1, Number(e.target.value) || 1) })}
                        inputMode="numeric"
                        type="number"
                        min={1}
                        className="h-10 w-16 rounded-lg border border-input bg-background px-2 text-sm text-foreground"
                      />
                      <span className="shrink-0 text-xs text-muted-foreground">{t("weeksUnit")}</span>
                      {steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStep(s.id)}
                          aria-label={t("removeStepAria")}
                          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                        >
                          <X className="size-4" aria-hidden />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addStep}
                  className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary"
                >
                  <Plus className="size-3.5" aria-hidden /> {t("addStep")}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("protocolStartDate")}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-2 text-sm text-foreground"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("protocolTime")}
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-11 w-full rounded-lg border border-input bg-background px-2 text-sm text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t("protocolFrequency")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {INTERVAL_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setIntervalDays(d)}
                    className={`h-10 rounded-lg border text-xs font-medium ${
                      intervalDays === d
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    {t(d === 1 ? "protocolEveryDay" : "protocolEveryNDays", { n: d })}
                  </button>
                ))}
              </div>
            </div>

            {mode === "fixed" ? (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    {t("protocolDurationWeeks")}
                  </label>
                  <input
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    inputMode="numeric"
                    className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground"
                  />
                </div>
                <p className="rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
                  {t("protocolWillCreate", { count: doseCount })}
                </p>
              </>
            ) : (
              <div className="rounded-lg bg-accent p-3">
                <ul className="space-y-1 text-xs text-accent-foreground">
                  {titrationPreview.map((p, i) => (
                    <li key={p.id}>
                      {t("titrationPreviewLine", {
                        from: p.fromWeek,
                        to: p.toWeek,
                        amount: steps[i]?.amount || "—",
                        unit,
                        count: p.doseCount,
                      })}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 border-t border-accent-foreground/15 pt-2 text-xs font-semibold text-accent-foreground">
                  {t("protocolWillCreate", { count: titrationTotalDoses })}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={(mode === "fixed" ? !amount.trim() : !titrationValid) || saving}
                onClick={handleSave}
                className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {saving ? t("saving") : t("createProtocolCta")}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
              >
                {t("cancel")}
              </button>
            </div>
          </>
        )}
      </div>
    </ModalShell>
  );
}
