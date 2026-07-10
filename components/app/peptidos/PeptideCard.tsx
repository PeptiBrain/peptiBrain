"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Beaker, ChevronDown, Plus, Printer, Lock } from "lucide-react";
import { addVial, PlanLimitError, type AppData, type Peptide, type SyringeType } from "@/lib/app-data";
import { Link } from "@/i18n/navigation";
import { PEPTIDE_PROFILES } from "@/lib/peptide-profiles";
import { unitsToDraw } from "@/lib/dose-math";
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

  const vials = data.vials.filter((v) => v.peptideId === peptide.id);
  const profile = PEPTIDE_PROFILES.find(
    (p) => p.name.toLowerCase() === peptide.name.trim().toLowerCase()
  );

  const concentration = useMemo(() => {
    const a = parseFloat(amount);
    const b = parseFloat(bacWater);
    if (!a || !b) return null;
    return (a / b).toFixed(2);
  }, [amount, bacWater]);

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
    if (!amount.trim()) return;
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
        throw err;
      }
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-2 text-left"
        aria-expanded={expanded}
      >
        <div className="flex min-w-0 items-center gap-3">
          <PeptideIcon peptideName={peptide.name} />
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-foreground">{peptide.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {peptide.route} · {vials.length} {vials.length === 1 ? t("vial") : t("vials")}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

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
              {v.bacWater && (
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
                    <span className="tabular font-semibold text-primary">{draw.toFixed(1)}</span>{" "}
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
                  disabled={!amount.trim()}
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
