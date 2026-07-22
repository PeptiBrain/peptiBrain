"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ShoppingCart, Beaker, Syringe } from "lucide-react";
import type { Dose, Peptide, Vial } from "@/lib/app-data";

const DAY_MS = 86400000;
const HORIZON_WEEKS = 4;

function toMg(amount: string, unit: string): number {
  const n = parseFloat(amount);
  if (!Number.isFinite(n)) return 0;
  if (unit === "mcg") return n / 1000;
  if (unit === "mg") return n;
  return 0;
}

type Line = {
  peptideName: string;
  doseCount: number;
  vialsNeeded: number | null;
  vialLabel: string;
  bacTotal: number | null;
};

// Lista de la compra para las próximas 4 semanas, calculada desde las dosis YA
// programadas (protocolos). Si no hay dosis programadas, invita a crear un protocolo.
export function ShoppingList({
  doses,
  peptides,
  vials,
}: {
  doses: Dose[];
  peptides: Peptide[];
  vials: Vial[];
}) {
  const t = useTranslations("Peptidos");

  const { lines, totalSyringes, totalBac } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const horizon = startOfToday + HORIZON_WEEKS * 7 * DAY_MS;

    const upcoming = doses.filter((d) => {
      const ts = new Date(d.scheduledAt).getTime();
      return ts >= startOfToday && ts <= horizon;
    });

    const byPeptide = new Map<string, Dose[]>();
    for (const d of upcoming) {
      const arr = byPeptide.get(d.peptideId) || [];
      arr.push(d);
      byPeptide.set(d.peptideId, arr);
    }

    const lines: Line[] = [];
    let totalSyringes = 0;
    let totalBac = 0;

    for (const [peptideId, items] of byPeptide) {
      const peptide = peptides.find((p) => p.id === peptideId);
      const latestVial = [...vials]
        .filter((v) => v.peptideId === peptideId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

      const mgNeeded = items.reduce((sum, d) => sum + toMg(d.amount, d.unit), 0);
      totalSyringes += items.length;

      let vialsNeeded: number | null = null;
      let bacTotal: number | null = null;
      let vialLabel = "—";
      if (latestVial) {
        const vialMg = toMg(latestVial.amount, latestVial.unit);
        vialLabel = `${latestVial.amount} ${latestVial.unit}`;
        if (vialMg > 0 && mgNeeded > 0) {
          vialsNeeded = Math.max(1, Math.ceil(mgNeeded / vialMg));
          const bacPerVial = parseFloat(latestVial.bacWater);
          if (Number.isFinite(bacPerVial) && bacPerVial > 0) {
            bacTotal = vialsNeeded * bacPerVial;
            totalBac += bacTotal;
          }
        }
      }

      lines.push({
        peptideName: peptide?.name || "—",
        doseCount: items.length,
        vialsNeeded,
        vialLabel,
        bacTotal,
      });
    }

    lines.sort((a, b) => b.doseCount - a.doseCount);
    return { lines, totalSyringes, totalBac };
  }, [doses, peptides, vials]);

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-5 text-center">
        <ShoppingCart className="mx-auto mb-2 size-7 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium text-foreground">{t("shoppingEmptyTitle")}</p>
        <p className="mx-auto mt-1 max-w-[20rem] text-xs text-muted-foreground">{t("shoppingEmptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <ShoppingCart className="size-4 text-primary" aria-hidden /> {t("shoppingTitle")}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{t("shoppingSubtitle", { weeks: HORIZON_WEEKS })}</p>

      <ul className="mt-3 space-y-2">
        {lines.map((l) => (
          <li key={l.peptideName} className="rounded-xl border border-border/70 p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-foreground">{l.peptideName}</span>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-foreground">
                {t("shoppingDoses", { count: l.doseCount })}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {l.vialsNeeded != null
                ? t("shoppingVials", { count: l.vialsNeeded, size: l.vialLabel })
                : t("shoppingVialsUnknown")}
              {l.bacTotal != null && ` · ${t("shoppingBac", { ml: +l.bacTotal.toFixed(1) })}`}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2">
          <Syringe className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="text-xs text-foreground">{t("shoppingSyringes", { count: totalSyringes })}</span>
        </div>
        {totalBac > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2">
            <Beaker className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-xs text-foreground">{t("shoppingBacTotal", { ml: +totalBac.toFixed(1) })}</span>
          </div>
        )}
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">{t("shoppingNote")}</p>
    </div>
  );
}
