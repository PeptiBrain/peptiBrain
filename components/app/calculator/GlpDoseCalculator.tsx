"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { unitsToDraw } from "@/lib/dose-math";
import { SyringeVisual, SYRINGE_CAPACITY } from "@/components/app/calculator/SyringeVisual";

// Esquemas de titulación de referencia (dosis semanal en mg). NO es consejo médico:
// son las fases estándar publicadas del producto de marca; el usuario decide con su médico.
type Phase = { weeks: string; mg: number };

const SCHEDULES: Record<"sema" | "tirze", { phases: Phase[]; defaultVialMg: string; defaultBac: string }> = {
  sema: {
    // Semaglutida: 0.25 → 0.5 → 1.0 → 1.7 → 2.4 mg / semana
    phases: [
      { weeks: "1-4", mg: 0.25 },
      { weeks: "5-8", mg: 0.5 },
      { weeks: "9-12", mg: 1.0 },
      { weeks: "13-16", mg: 1.7 },
      { weeks: "17+", mg: 2.4 },
    ],
    defaultVialMg: "5",
    defaultBac: "2",
  },
  tirze: {
    // Tirzepatida: 2.5 → 5 → 7.5 → 10 → 12.5 → 15 mg / semana
    phases: [
      { weeks: "1-4", mg: 2.5 },
      { weeks: "5-8", mg: 5 },
      { weeks: "9-12", mg: 7.5 },
      { weeks: "13-16", mg: 10 },
      { weeks: "17-20", mg: 12.5 },
      { weeks: "21+", mg: 15 },
    ],
    defaultVialMg: "10",
    defaultBac: "2",
  },
};

export function GlpDoseCalculator() {
  const t = useTranslations("Semaglutida");
  const [compound, setCompound] = useState<"sema" | "tirze">("sema");
  const schedule = SCHEDULES[compound];
  const [vialMg, setVialMg] = useState(schedule.defaultVialMg);
  const [bacWater, setBacWater] = useState(schedule.defaultBac);
  const [activePhase, setActivePhase] = useState(0);

  function pickCompound(c: "sema" | "tirze") {
    setCompound(c);
    setVialMg(SCHEDULES[c].defaultVialMg);
    setBacWater(SCHEDULES[c].defaultBac);
    setActivePhase(0);
  }

  const concentration = useMemo(() => {
    const a = parseFloat(vialMg);
    const b = parseFloat(bacWater);
    if (!a || !b) return null;
    return a / b;
  }, [vialMg, bacWater]);

  const rows = useMemo(() => {
    const a = parseFloat(vialMg);
    const b = parseFloat(bacWater);
    return schedule.phases.map((p) => {
      if (!a || !b) return { ...p, units: null as number | null };
      const units = unitsToDraw({
        vialAmount: a,
        vialUnit: "mg",
        bacWater: b,
        doseAmount: p.mg,
        doseUnit: "mg",
      });
      return { ...p, units };
    });
  }, [vialMg, bacWater, schedule]);

  const active = rows[activePhase];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Selector de compuesto */}
      <div className="grid grid-cols-2 gap-2">
        {(["sema", "tirze"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => pickCompound(c)}
            className={`h-11 rounded-lg border text-sm font-semibold transition-colors ${
              compound === c
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {c === "sema" ? t("semaglutide") : t("tirzepatide")}
          </button>
        ))}
      </div>

      {/* Vial + agua */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("vialLabel")}
          </p>
          <div className="flex">
            <input
              value={vialMg}
              onChange={(e) => setVialMg(e.target.value)}
              inputMode="decimal"
              aria-label={t("vialLabel")}
              className="h-12 w-full rounded-l-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="flex h-12 items-center rounded-r-lg border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              mg
            </span>
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("bacWaterLabel")}
          </p>
          <div className="flex">
            <input
              value={bacWater}
              onChange={(e) => setBacWater(e.target.value)}
              inputMode="decimal"
              aria-label={t("bacWaterLabel")}
              className="h-12 w-full rounded-l-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <span className="flex h-12 items-center rounded-r-lg border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              mL
            </span>
          </div>
        </div>
      </div>

      {concentration && (
        <p className="mt-3 rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">
          {t("concentration")} <span className="font-semibold tabular-nums">{concentration.toFixed(2)}</span> mg/mL
        </p>
      )}

      {/* Tabla de titulación */}
      <p className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("scheduleTitle")}
      </p>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2 font-semibold">{t("colWeeks")}</th>
              <th className="px-3 py-2 font-semibold">{t("colDose")}</th>
              <th className="px-3 py-2 text-right font-semibold">{t("colUnits")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const over = r.units != null && r.units > SYRINGE_CAPACITY.u100;
              return (
                <tr
                  key={r.weeks}
                  onClick={() => setActivePhase(i)}
                  className={`cursor-pointer border-t border-border transition-colors ${
                    i === activePhase ? "bg-primary/5" : "hover:bg-muted/40"
                  }`}
                >
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {t("weeksShort")} {r.weeks}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-foreground tabular-nums">{r.mg} mg</td>
                  <td className="px-3 py-2.5 text-right font-semibold tabular-nums">
                    {r.units == null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className={over ? "text-destructive" : "text-primary"}>{r.units.toFixed(0)} U</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Jeringa de la fase activa */}
      {active?.units != null && (
        <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="text-center text-sm text-muted-foreground">
            {t("phaseDraw", { weeks: active.weeks, mg: active.mg })}
          </p>
          <p className="mt-1 text-center font-display text-4xl font-bold tabular-nums text-primary">
            {active.units.toFixed(0)}
            <span className="ml-1 text-lg font-semibold text-muted-foreground">U</span>
          </p>
          <div className="mt-3">
            <SyringeVisual syringeType="u100" units={active.units} />
          </div>
          {active.units > SYRINGE_CAPACITY.u100 && (
            <p className="mt-2 text-center text-xs font-medium text-destructive">{t("overCapacity")}</p>
          )}
        </div>
      )}
    </div>
  );
}
