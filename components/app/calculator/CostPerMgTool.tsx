"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { PEPTIDE_PROFILES } from "@/lib/peptide-profiles";

// Solo péptidos dosificados en mg Y con un vial numérico real tienen sentido
// aquí — los que se dosifican en UI (HGH, HCG...) no comparten la misma
// unidad de costo, y los que no vienen en vial (spray/sublingual, vialAmount
// "-") no tienen un contenido que autocompletar.
const MG_PEPTIDES = PEPTIDE_PROFILES.filter((p) => p.vialUnit === "mg" && !Number.isNaN(parseFloat(p.vialAmount)));

export function CostPerMgTool() {
  const t = useTranslations("CostoPorMg");
  const [peptideName, setPeptideName] = useState("");
  const [price, setPrice] = useState("");
  const [vialMg, setVialMg] = useState("");
  const [doseMg, setDoseMg] = useState("");

  function pickPeptide(name: string) {
    setPeptideName(name);
    const profile = MG_PEPTIDES.find((p) => p.name === name);
    if (profile) setVialMg(profile.vialAmount);
  }

  const result = useMemo(() => {
    const p = parseFloat(price);
    const v = parseFloat(vialMg);
    if (!p || !v) return null;
    const perMg = p / v;
    const d = parseFloat(doseMg);
    const perDose = d ? perMg * d : null;
    return { perMg, perDose };
  }, [price, vialMg, doseMg]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <label className="block">
        <span className="text-sm font-semibold text-foreground">{t("peptideLabel")}</span>
        <select
          value={peptideName}
          onChange={(e) => pickPeptide(e.target.value)}
          className="mt-1.5 h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">{t("peptidePlaceholder")}</option>
          {MG_PEPTIDES.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("priceLabel")}</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
            placeholder="45"
            className="h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("vialLabel")}</label>
          <input
            value={vialMg}
            onChange={(e) => setVialMg(e.target.value)}
            inputMode="decimal"
            placeholder="5"
            className="h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1.5 block text-sm font-medium text-foreground">{t("doseLabel")}</label>
        <input
          value={doseMg}
          onChange={(e) => setDoseMg(e.target.value)}
          inputMode="decimal"
          placeholder={t("doseOptional")}
          className="h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {result && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-accent p-4 text-center">
            <p className="text-xs font-medium text-accent-foreground">{t("perMgLabel")}</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-accent-foreground">
              {result.perMg.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4 text-center">
            <p className="text-xs font-medium text-muted-foreground">{t("perDoseLabel")}</p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground">
              {result.perDose != null ? result.perDose.toFixed(2) : "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
