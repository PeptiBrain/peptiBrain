"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarClock } from "lucide-react";
import { ModalShell } from "@/components/app/shell/ModalShell";
import type { Peptide } from "@/lib/app-data";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const INTERVAL_OPTIONS = [1, 2, 3, 7, 14];

export function ProtocolModal({
  open,
  onClose,
  peptides,
  onSave,
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
}) {
  const t = useTranslations("Peptidos");
  const [peptideId, setPeptideId] = useState(peptides[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("mg");
  const [startDate, setStartDate] = useState(todayIso());
  const [time, setTime] = useState("08:00");
  const [intervalDays, setIntervalDays] = useState(1);
  const [weeks, setWeeks] = useState("4");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setPeptideId(peptides[0]?.id || "");
      setAmount("");
      setUnit("mg");
      setStartDate(todayIso());
      setTime("08:00");
      setIntervalDays(1);
      setWeeks("4");
    }
  }, [open, peptides]);

  const weeksNum = Math.max(1, Math.min(24, Number(weeks) || 1));
  const doseCount = Math.min(60, Math.max(1, Math.ceil((weeksNum * 7) / intervalDays)));

  async function handleSave() {
    if (!peptideId || !amount.trim()) return;
    setSaving(true);
    try {
      await onSave({ peptideId, amount: amount.trim(), unit, startDate, time, intervalDays, weeks: weeksNum });
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

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={!amount.trim() || saving}
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
