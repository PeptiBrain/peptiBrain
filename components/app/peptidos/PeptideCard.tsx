"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Beaker, ChevronDown, Plus, Printer, Lock, Trash2 } from "lucide-react";
import { addVial, deletePeptide, PlanLimitError, type AppData, type Peptide, type SyringeType } from "@/lib/app-data";
import { Link } from "@/i18n/navigation";
import { PEPTIDE_PROFILES } from "@/lib/peptide-profiles";
import { unitsToDraw, toMg } from "@/lib/dose-math";
import { PLAUSIBLE, numberInRange, inRange } from "@/lib/plausible";
import { logError } from "@/lib/error-log";
import { SyringeVisual, SYRINGE_CAPACITY } from "@/components/app/calculator/SyringeVisual";
import { PeptideIcon } from "@/components/app/peptidos/PeptideIcon";

const SYRINGE_OPTIONS: { value: SyringeType; label: string }[] = [
  { value: "u30", label: "U30 (0.3 mL)" },
  { value: "u50", label: "U50 (0.5 mL)" },
  { value: "u100", label: "U100 (1 mL)" },
];

export function PeptideCard({
  peptide,
  data,
  onChange,
}: {
  peptide: Peptide;
  data: AppData;
  onChange: (next: AppData) => void;
}) {
  const t = useTranslations("Peptidos");
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("mg");
  const [bacWater, setBacWater] = useState("");
  const [cost, setCost] = useState("");
  const [syringeType, setSyringeType] = useState<SyringeType>("u100");
  const [doseAmount, setDoseAmount] = useState("");
  const [doseUnit, setDoseUnit] = useState("mcg");
  const [limitReached, setLimitReached] = useState(false);
  const [savingVial, setSavingVial] = useState(false);
  const [vialError, setVialError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const vials = data.vials.filter((v) => v.peptideId === peptide.id);
  const profile = PEPTIDE_PROFILES.find(
    (p) => p.name.toLowerCase() === peptide.name.trim().toLowerCase()
  );

  // La "concentración" solo tiene sentido si la cantidad del vial es una MASA
  // (mg/mcg/UI) disuelta en un volumen de agua. Si el vial ya viene líquido
  // (unidad "ml", p.ej. Cerebrolysin), dividir volumen entre volumen daba
  // cosas como "1.00 ml/mL", que no significa nada — y en una app de dosis eso
  // es peligroso, no solo feo.
  const isVolumeUnit = (u: string) => u.trim().toLowerCase() === "ml";

  // Validación del vial. Con agua = 0 se guardaba en base una concentración
  // literal "Infinity mg/mL" (cantidad ÷ 0) — lo más grave del QA: un número
  // sin sentido en la pantalla que la gente usa para calcular su dosis.
  const vialAmountNum = parseFloat(amount.replace(",", "."));
  const vialWaterNum = parseFloat(bacWater.replace(",", "."));
  // Más allá de "es un número positivo": un vial de 99.999 mg o 99.999 mL de
  // agua se aceptaba igual en la calculadora del QA. Cuando la unidad es una
  // masa (mg/mcg) se compara contra un tope generoso; si es ml/UI (vial ya
  // líquido) no hay conversión posible y se deja pasar sin este chequeo extra.
  const vialAmountMg = isVolumeUnit(unit) ? null : toMg(vialAmountNum, unit);
  const vialAmountOk =
    Number.isFinite(vialAmountNum) &&
    vialAmountNum > 0 &&
    (vialAmountMg === null || numberInRange(vialAmountMg, PLAUSIBLE.vialMassMg));
  // El agua es opcional (un vial sin reconstituir es válido), pero si se
  // escribe algo tiene que ser un número mayor que 0 y dentro de rango.
  const vialWaterOk =
    !bacWater.trim() ||
    (Number.isFinite(vialWaterNum) && vialWaterNum > 0 && numberInRange(vialWaterNum, PLAUSIBLE.bacWaterMl));
  const vialCostOk = inRange(cost, PLAUSIBLE.costAmount);
  const vialIsValid = vialAmountOk && vialWaterOk && vialCostOk;

  const concentration = useMemo(() => {
    if (isVolumeUnit(unit)) return null;
    const a = parseFloat(amount);
    const b = parseFloat(bacWater);
    // Number.isFinite descarta 0, NaN e Infinity de una vez: nunca se pinta
    // "Infinity" ni "NaN" en pantalla.
    if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) return null;
    const c = a / b;
    return Number.isFinite(c) ? c.toFixed(2) : null;
  }, [amount, bacWater, unit]);

  const draw = useMemo(() => {
    const a = parseFloat(amount);
    const b = parseFloat(bacWater);
    const d = parseFloat(doseAmount);
    if (!a || !b || !d) return null;
    return unitsToDraw({
      vialAmount: a,
      vialUnit: unit,
      bacWater: b,
      doseAmount: d,
      doseUnit,
    });
  }, [amount, bacWater, doseAmount, unit, doseUnit]);

  function applyProfile() {
    if (!profile) return;
    setAmount(profile.vialAmount);
    setUnit(profile.vialUnit);
    setBacWater(profile.bacWater);
    setDoseAmount(profile.commonDose);
    setDoseUnit(profile.doseUnit);
  }

  async function handleAddVial() {
    if (!vialIsValid || savingVial) return;
    setSavingVial(true);
    try {
      const next = await addVial(data, {
        peptideId: peptide.id,
        amount,
        unit,
        bacWater,
        syringeType,
        cost,
      });
      onChange(next);
      setAmount("");
      setBacWater("");
      setCost("");
      setShowForm(false);
      setLimitReached(false);
    } catch (err) {
      if (err instanceof PlanLimitError) {
        setLimitReached(true);
      } else {
        // Antes relanzaba y la pantalla se quedaba muda: el formulario seguía
        // abierto y el usuario creía que había guardado.
        setVialError(true);
        logError(err instanceof Error ? err : new Error(String(err)), "PeptideCard.handleAddVial");
      }
    } finally {
      setSavingVial(false);
    }
  }

  async function handleDeletePeptide() {
    setDeleting(true);
    try {
      const next = await deletePeptide(data, peptide.id);
      onChange(next);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex w-full items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-expanded={expanded}
        >
          <PeptideIcon peptideName={peptide.name} />
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-foreground">{peptide.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {peptide.route} · {vials.length} {vials.length === 1 ? t("vial") : t("vials")}
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          aria-label={t("deletePeptideAria")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? t("collapse") : t("expand")}
          className="flex size-8 shrink-0 items-center justify-center"
        >
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </div>

      {confirmDelete && (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2">
          <p className="text-xs text-foreground">{t("confirmDeletePeptide")}</p>
          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary"
            >
              {t("cancel")}
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={handleDeletePeptide}
              className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-50"
            >
              {t("deleteConfirm")}
            </button>
          </div>
        </div>
      )}

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          {vials.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("noVialsYet")}</p>
          )}
          {vials.map((v) => (
            <div key={v.id} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm">
              <Beaker className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="text-foreground">
                {v.amount} {v.unit}
              </span>
              {v.bacWater && !isVolumeUnit(v.unit) && (
                <span className="text-muted-foreground">
                  · {(parseFloat(v.amount) / parseFloat(v.bacWater)).toFixed(2)} {v.unit}/mL
                </span>
              )}
              {v.syringeType && (
                <span className="text-muted-foreground">
                  · {t("syringeLabel")} {v.syringeType.toUpperCase()}
                </span>
              )}
            </div>
          ))}

          {showForm ? (
            <div className="rounded-lg border border-border p-3">
              {profile && (
                <button
                  type="button"
                  onClick={applyProfile}
                  className="mb-3 flex w-full items-center justify-between rounded-lg bg-accent px-3 py-2 text-left text-xs text-accent-foreground"
                >
                  <span>
                    {t("useProfile", {
                      name: profile.name,
                      dose: profile.commonDose,
                      unit: profile.doseUnit,
                      frequency: profile.frequency,
                    })}
                  </span>
                  <span className="font-semibold whitespace-nowrap">{t("useThisProfile")}</span>
                </button>
              )}

              <p className="mb-1.5 text-xs font-medium text-foreground">{t("vialLabel")}</p>
              <div className="flex gap-2">
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder={t("amountPlaceholder")}
                  className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="h-11 w-20 rounded-lg border border-input bg-background px-2 text-base text-foreground"
                >
                  <option value="mg">mg</option>
                  <option value="mcg">mcg</option>
                  <option value="ml">ml</option>
                  <option value="UI">UI</option>
                </select>
              </div>
              <input
                value={bacWater}
                onChange={(e) => setBacWater(e.target.value)}
                inputMode="decimal"
                placeholder={t("bacWaterPlaceholder")}
                className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                inputMode="decimal"
                placeholder={t("costPlaceholder")}
                className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {!vialCostOk && <p className="mt-2 text-xs text-destructive">{t("vialCostInvalid")}</p>}
              {concentration && (
                <p className="mt-2 rounded-lg bg-accent px-3 py-1.5 text-xs text-accent-foreground">
                  {t("concentration")} <span className="tabular font-semibold">{concentration}</span> {unit}/mL
                </p>
              )}

              <p className="mt-3 mb-1.5 text-xs font-medium text-foreground">{t("syringeTypeLabel")}</p>
              <div className="grid grid-cols-3 gap-2">
                {SYRINGE_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setSyringeType(s.value)}
                    className={`h-10 rounded-lg border text-xs font-medium ${
                      syringeType === s.value
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <p className="mt-3 mb-1.5 text-xs font-medium text-foreground">{t("desiredDoseLabel")}</p>
              <div className="flex gap-2">
                <input
                  value={doseAmount}
                  onChange={(e) => setDoseAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder={t("dosePlaceholder")}
                  className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <select
                  value={doseUnit}
                  onChange={(e) => setDoseUnit(e.target.value)}
                  className="h-11 w-20 rounded-lg border border-input bg-background px-2 text-base text-foreground"
                >
                  <option value="mcg">mcg</option>
                  <option value="mg">mg</option>
                </select>
              </div>

              {draw !== null && (
                <div className="mt-3 rounded-lg border border-border p-3">
                  <p className="text-center text-sm text-foreground">
                    {t("drawUpTo")}{" "}
                    <span
                      className={`tabular font-semibold ${
                        draw > SYRINGE_CAPACITY[syringeType] ? "text-destructive" : "text-primary"
                      }`}
                    >
                      {draw.toFixed(1)}
                    </span>{" "}
                    {t("units")}
                  </p>
                  <div className="mt-2">
                    <SyringeVisual syringeType={syringeType} units={draw} />
                  </div>
                  {draw > SYRINGE_CAPACITY[syringeType] && (
                    <p className="mt-1 text-center text-xs text-destructive">{t("overCapacity")}</p>
                  )}
                </div>
              )}

              {limitReached && (
                <div className="mt-3 rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
                  {t("planLimitReached")}{" "}
                  <Link href="/paywall" className="font-semibold underline underline-offset-2">
                    {t("planLimitCta")}
                  </Link>
                </div>
              )}

              {amount.trim() && !vialAmountOk && (
                <p className="mt-2 text-xs text-destructive">{t("vialAmountInvalid")}</p>
              )}
              {!vialWaterOk && <p className="mt-2 text-xs text-destructive">{t("vialWaterInvalid")}</p>}
              {vialError && <p className="mt-2 text-xs text-destructive">{t("saveError")}</p>}

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-10 flex-1 rounded-lg border border-border text-xs font-medium text-foreground"
                >
                  {t("cancel")}
                </button>
                {draw !== null && (
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex h-10 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-foreground"
                  >
                    <Printer className="size-3.5" aria-hidden /> {t("pdf")}
                  </button>
                )}
                <button
                  type="button"
                  disabled={!vialIsValid || savingVial}
                  onClick={handleAddVial}
                  className="h-10 flex-1 rounded-lg bg-primary text-xs font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {t("saveVial")}
                </button>
              </div>
            </div>
          ) : data.plan === "free" && data.vials.length >= 1 ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-secondary/40 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5 shrink-0" aria-hidden /> {t("planLimitReached")}
              </p>
              <Link
                href="/paywall"
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                {t("planLimitCta")}
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Plus className="size-4" aria-hidden /> {t("addVial")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
