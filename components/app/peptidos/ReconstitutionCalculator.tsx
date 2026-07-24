"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Printer, Plus, X, Save, Trash2, FolderOpen } from "lucide-react";
import type { AppData } from "@/lib/app-data";
import {
  listCalculatorProtocols,
  saveCalculatorProtocol,
  deleteCalculatorProtocol,
  type CalculatorProtocol,
  type CalculatorProtocolEntry,
} from "@/lib/app-data";
import { unitsToDraw, waterForTargetUnits } from "@/lib/dose-math";
import { SyringeVisual, SYRINGE_CAPACITY } from "@/components/app/calculator/SyringeVisual";
import type { SyringeType } from "@/lib/app-data";

const SYRINGE_OPTIONS: { value: SyringeType; label: string }[] = [
  { value: "u30", label: "U30 (0.3 mL)" },
  { value: "u50", label: "U50 (0.5 mL)" },
  { value: "u100", label: "U100 (1 mL)" },
];

let entryIdCounter = 0;
function newEntry(): CalculatorProtocolEntry & { id: string } {
  entryIdCounter += 1;
  return { id: `e${entryIdCounter}`, peptideName: "", doseAmount: "", doseUnit: "mcg" };
}

export function ReconstitutionCalculator({ data }: { data: AppData }) {
  const t = useTranslations("Peptidos");
  const [mode, setMode] = useState<"draw" | "water">("draw");
  const [vialId, setVialId] = useState("");
  const [vialAmount, setVialAmount] = useState("");
  const [vialUnit, setVialUnit] = useState("mg");
  const [bacWater, setBacWater] = useState("");
  const [syringeType, setSyringeType] = useState<SyringeType>("u100");
  const [entries, setEntries] = useState<(CalculatorProtocolEntry & { id: string })[]>([newEntry()]);
  const [targetUnits, setTargetUnits] = useState("");

  const [protocols, setProtocols] = useState<CalculatorProtocol[]>([]);
  const [loadingProtocols, setLoadingProtocols] = useState(true);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [protocolName, setProtocolName] = useState("");
  const [protocolNotes, setProtocolNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    listCalculatorProtocols()
      .then(setProtocols)
      .finally(() => setLoadingProtocols(false));
  }, []);

  function pickVial(id: string) {
    setVialId(id);
    const vial = data.vials.find((v) => v.id === id);
    if (!vial) return;
    setVialAmount(vial.amount);
    setVialUnit(vial.unit);
    setBacWater(vial.bacWater || "");
    if (vial.syringeType) setSyringeType(vial.syringeType);
    const peptide = data.peptides.find((p) => p.id === vial.peptideId);
    if (peptide) setEntries([{ ...newEntry(), peptideName: peptide.name }]);
  }

  function addEntry() {
    setEntries((prev) => [...prev, newEntry()]);
  }
  function removeEntry(id: string) {
    setEntries((prev) => (prev.length > 1 ? prev.filter((e) => e.id !== id) : prev));
  }
  function updateEntry(id: string, patch: Partial<CalculatorProtocolEntry>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  const concentration = useMemo(() => {
    const a = parseFloat(vialAmount);
    const b = parseFloat(bacWater);
    if (!a || !b) return null;
    return (a / b).toFixed(2);
  }, [vialAmount, bacWater]);

  const draws = useMemo(() => {
    const a = parseFloat(vialAmount);
    const b = parseFloat(bacWater);
    if (!a || !b) return [];
    return entries.map((e) => {
      const d = parseFloat(e.doseAmount);
      if (!d) return { id: e.id, draw: null as number | null };
      return {
        id: e.id,
        draw: unitsToDraw({ vialAmount: a, vialUnit, bacWater: b, doseAmount: d, doseUnit: e.doseUnit }),
      };
    });
  }, [entries, vialAmount, vialUnit, bacWater]);

  const hasAnyDraw = draws.some((d) => d.draw !== null);

  const waterSolved = useMemo(() => {
    const a = parseFloat(vialAmount);
    const target = parseFloat(targetUnits);
    const d = parseFloat(entries[0]?.doseAmount || "");
    if (!a || !target || !d) return null;
    return waterForTargetUnits({
      vialAmount: a,
      vialUnit,
      doseAmount: d,
      doseUnit: entries[0].doseUnit,
      targetUnits: target,
    });
  }, [vialAmount, vialUnit, targetUnits, entries]);

  async function handleSaveProtocol() {
    if (!protocolName.trim()) return;
    setSaving(true);
    try {
      const next = await saveCalculatorProtocol({
        name: protocolName.trim(),
        notes: protocolNotes.trim() || undefined,
        vialAmount,
        vialUnit,
        bacWater,
        syringeType,
        entries: entries.map((e) => ({ peptideName: e.peptideName, doseAmount: e.doseAmount, doseUnit: e.doseUnit })),
      });
      setProtocols(next);
      setShowSaveForm(false);
      setProtocolName("");
      setProtocolNotes("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  function handleLoadProtocol(p: CalculatorProtocol) {
    setMode("draw");
    setVialId("");
    setVialAmount(p.vialAmount);
    setVialUnit(p.vialUnit);
    setBacWater(p.bacWater);
    setSyringeType(p.syringeType);
    setEntries(p.entries.map((e) => ({ ...newEntry(), ...e })));
  }

  async function handleDeleteProtocol(id: string) {
    const next = await deleteCalculatorProtocol(id);
    setProtocols(next);
    setConfirmDeleteId(null);
  }

  const inputClass =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setMode("draw")}
          className={`h-10 rounded-lg border text-sm font-medium ${
            mode === "draw" ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
          }`}
        >
          {t("calculatorModeDraw")}
        </button>
        <button
          type="button"
          onClick={() => setMode("water")}
          className={`h-10 rounded-lg border text-sm font-medium ${
            mode === "water" ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
          }`}
        >
          {t("calculatorModeWater")}
        </button>
      </div>

      {data.vials.length > 0 && (
        <div className="mb-3">
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("calculatorUseVialLabel")}</label>
          <select
            value={vialId}
            onChange={(e) => pickVial(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground"
          >
            <option value="">{t("calculatorManualEntry")}</option>
            {data.vials.map((v) => {
              const peptide = data.peptides.find((p) => p.id === v.peptideId);
              return (
                <option key={v.id} value={v.id}>
                  {peptide?.name || "—"} · {v.amount} {v.unit}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <p className="mb-1.5 text-xs font-medium text-foreground">{t("vialLabel")}</p>
      <div className="flex gap-2">
        <input
          value={vialAmount}
          onChange={(e) => setVialAmount(e.target.value)}
          inputMode="decimal"
          placeholder={t("amountPlaceholder")}
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <select
          value={vialUnit}
          onChange={(e) => setVialUnit(e.target.value)}
          className="h-11 w-20 rounded-lg border border-input bg-background px-2 text-base text-foreground"
        >
          <option value="mg">mg</option>
          <option value="mcg">mcg</option>
          <option value="ml">ml</option>
          <option value="UI">UI</option>
        </select>
      </div>

      {mode === "draw" && (
        <>
          <input
            value={bacWater}
            onChange={(e) => setBacWater(e.target.value)}
            inputMode="decimal"
            placeholder={t("bacWaterPlaceholder")}
            className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {concentration && (
            <p className="mt-2 rounded-lg bg-accent px-3 py-1.5 text-xs text-accent-foreground">
              {t("concentration")} <span className="tabular font-semibold">{concentration}</span> {vialUnit}/mL
            </p>
          )}
        </>
      )}

      <p className="mt-3 mb-1.5 text-xs font-medium text-foreground">{t("syringeTypeLabel")}</p>
      <div className="grid grid-cols-3 gap-2">
        {SYRINGE_OPTIONS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setSyringeType(s.value)}
            className={`h-10 rounded-lg border text-xs font-medium ${
              syringeType === s.value ? "border-primary bg-accent text-accent-foreground" : "border-border bg-background text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {mode === "draw" ? (
        <>
          <div className="mt-3 space-y-3">
            {entries.map((entry, i) => (
              <div key={entry.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <input
                    value={entry.peptideName}
                    onChange={(e) => updateEntry(entry.id, { peptideName: e.target.value })}
                    placeholder={t("peptideNamePlaceholder")}
                    className={`${inputClass} flex-1`}
                  />
                  {entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      aria-label={t("removeEntryAria")}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-destructive"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    value={entry.doseAmount}
                    onChange={(e) => updateEntry(entry.id, { doseAmount: e.target.value })}
                    inputMode="decimal"
                    placeholder={t("dosePlaceholder")}
                    className={`${inputClass} flex-1`}
                  />
                  <select
                    value={entry.doseUnit}
                    onChange={(e) => updateEntry(entry.id, { doseUnit: e.target.value })}
                    className="h-11 w-24 rounded-lg border border-input bg-background px-2 text-base text-foreground"
                  >
                    <option value="mcg">mcg</option>
                    <option value="mg">mg</option>
                  </select>
                </div>

                {draws[i]?.draw != null && (
                  <div className="mt-3 rounded-lg bg-secondary/60 p-3">
                    <p className="text-center text-sm text-foreground">
                      {t("drawUpTo")} <span className="tabular font-semibold text-primary">{draws[i].draw!.toFixed(1)}</span> {t("units")}
                    </p>
                    <div className="mt-2">
                      <SyringeVisual syringeType={syringeType} units={draws[i].draw!} />
                    </div>
                    {draws[i].draw! > SYRINGE_CAPACITY[syringeType] && (
                      <p className="mt-1 text-center text-xs text-destructive">{t("overCapacity")}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addEntry}
            className="mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Plus className="size-4" aria-hidden /> {t("addPeptideEntry")}
          </button>

          {hasAnyDraw && (
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-border text-xs font-medium text-foreground"
            >
              <Printer className="size-3.5" aria-hidden /> {t("pdf")}
            </button>
          )}

          {hasAnyDraw && (
            <div className="mt-3 border-t border-border pt-3">
              {showSaveForm ? (
                <div className="rounded-lg border border-border p-3">
                  <label className="mb-1.5 block text-xs font-medium text-foreground">{t("protocolNameLabel")}</label>
                  <input
                    value={protocolName}
                    onChange={(e) => setProtocolName(e.target.value)}
                    placeholder={t("protocolNamePlaceholder")}
                    className={inputClass}
                  />
                  <label className="mt-2 mb-1.5 block text-xs font-medium text-foreground">{t("protocolNotesLabel")}</label>
                  <textarea
                    value={protocolNotes}
                    onChange={(e) => setProtocolNotes(e.target.value)}
                    placeholder={t("protocolNotesPlaceholder")}
                    rows={2}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSaveForm(false)}
                      className="h-10 flex-1 rounded-lg border border-border text-xs font-medium text-foreground"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="button"
                      disabled={!protocolName.trim() || saving}
                      onClick={handleSaveProtocol}
                      className="h-10 flex-1 rounded-lg bg-primary text-xs font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      {saving ? t("saving") : t("saveProtocolConfirm")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSaveForm(true)}
                  className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
                >
                  <Save className="size-4" aria-hidden /> {t("saveProtocolCta")}
                </button>
              )}
              {saved && <p className="mt-2 text-center text-xs font-medium text-primary">{t("protocolSaved")}</p>}
            </div>
          )}
        </>
      ) : (
        <div className="mt-3 rounded-lg border border-border p-3">
          <input
            value={entries[0]?.peptideName || ""}
            onChange={(e) => updateEntry(entries[0].id, { peptideName: e.target.value })}
            placeholder={t("peptideNamePlaceholder")}
            className={inputClass}
          />
          <div className="mt-2 flex gap-2">
            <input
              value={entries[0]?.doseAmount || ""}
              onChange={(e) => updateEntry(entries[0].id, { doseAmount: e.target.value })}
              inputMode="decimal"
              placeholder={t("dosePlaceholder")}
              className={`${inputClass} flex-1`}
            />
            <select
              value={entries[0]?.doseUnit}
              onChange={(e) => updateEntry(entries[0].id, { doseUnit: e.target.value })}
              className="h-11 w-24 rounded-lg border border-input bg-background px-2 text-base text-foreground"
            >
              <option value="mcg">mcg</option>
              <option value="mg">mg</option>
            </select>
          </div>
          <label className="mt-3 mb-1.5 block text-xs font-medium text-foreground">{t("targetUnitsLabel")}</label>
          <input
            value={targetUnits}
            onChange={(e) => setTargetUnits(e.target.value)}
            inputMode="decimal"
            placeholder={t("targetUnitsPlaceholder")}
            className={inputClass}
          />

          {waterSolved != null && (
            <div className="mt-3 rounded-lg bg-accent p-4 text-center">
              <p className="text-xs font-medium text-accent-foreground">{t("waterResultLabel")}</p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums text-accent-foreground">
                {waterSolved.toFixed(2)} mL
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-border pt-3">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <FolderOpen className="size-4 text-primary" aria-hidden /> {t("savedProtocolsTitle")}
        </p>
        {loadingProtocols ? null : protocols.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t("noSavedProtocols")}</p>
        ) : (
          <ul className="space-y-2">
            {protocols.map((p) => (
              <li key={p.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {p.entries.map((e) => e.peptideName || "—").join(" + ")}
                    </p>
                    {p.notes && <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.notes}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => handleLoadProtocol(p)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-primary hover:bg-accent"
                    >
                      {t("loadProtocol")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(p.id)}
                      aria-label={t("deleteProtocolAria")}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
                {confirmDeleteId === p.id && (
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2">
                    <p className="text-xs text-foreground">{t("confirmDeleteProtocol")}</p>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProtocol(p.id)}
                        className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20"
                      >
                        {t("deleteConfirm")}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
