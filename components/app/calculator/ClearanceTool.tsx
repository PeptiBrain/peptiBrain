"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { PEPTIDE_PROFILES, PEPTIDE_CATEGORY_IDS, type HalfLifeConfidence } from "@/lib/peptide-profiles";
import { estimateClearance } from "@/lib/clearance";

const CONFIDENCE_DOT: Record<HalfLifeConfidence, string> = {
  alto: "bg-emerald-500",
  medio: "bg-amber-500",
  bajo: "bg-muted-foreground/40",
  "sin-dato": "",
};

// Solo péptidos con un estimado real calculable — mostrar los que dicen
// "sin dato confiable" aquí sería un callejón sin salida para el usuario.
const CALCULABLE_PEPTIDES = PEPTIDE_PROFILES.filter((p) => p.halfLifeHoursEstimate != null);

export function ClearanceTool() {
  const t = useTranslations("Eliminacion");
  const tc = useTranslations("PeptideCategories");
  const [name, setName] = useState("");

  const profile = useMemo(() => CALCULABLE_PEPTIDES.find((p) => p.name === name), [name]);
  const clearance = profile?.halfLifeHoursEstimate != null ? estimateClearance(profile.halfLifeHoursEstimate) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <label className="block">
        <span className="text-sm font-semibold text-foreground">{t("selectLabel")}</span>
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">{t("selectPlaceholder")}</option>
          {PEPTIDE_CATEGORY_IDS.map((cat) => {
            const items = CALCULABLE_PEPTIDES.filter((p) => p.categories[0] === cat);
            if (items.length === 0) return null;
            return (
              <optgroup key={cat} label={tc(cat)}>
                {items.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </label>

      {profile && clearance && (
        <div className="mt-5 rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Clock className="size-3.5" aria-hidden /> {t("halfLifeLabel")}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
            <span className={`size-1.5 shrink-0 rounded-full ${CONFIDENCE_DOT[profile.halfLifeConfidence]}`} aria-hidden />
            {profile.halfLife}
          </p>

          <div className="mt-4 rounded-lg bg-accent p-4 text-center">
            <p className="text-xs font-medium text-accent-foreground">{t("estimateLabel")}</p>
            <p className="mt-1 font-display text-3xl font-bold tabular-nums text-accent-foreground">
              {clearance.label}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{t("methodNote")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
