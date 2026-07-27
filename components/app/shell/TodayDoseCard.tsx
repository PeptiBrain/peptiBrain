"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Check, Syringe as SyringeIcon, MapPin } from "lucide-react";
import type { AppData, Dose } from "@/lib/app-data";
import { unitsToDraw } from "@/lib/dose-math";
import { suggestNextInjectionSite } from "@/lib/injection-sites";
import { SyringeVisual, SYRINGE_CAPACITY } from "@/components/app/calculator/SyringeVisual";
import { PeptideIcon } from "@/components/app/peptidos/PeptideIcon";

// La pregunta que un usuario se hace CADA DÍA es una sola: "¿cuánto me cargo,
// hasta qué marca, y dónde me lo pongo?". Hasta ahora la respuesta estaba
// repartida en tres sitios: la dosis en Inicio, las unidades solo si ibas a la
// calculadora y la reescribías a mano, y la zona solo DESPUÉS de marcarla como
// aplicada. Esta tarjeta junta las tres cosas antes de inyectar.
export function TodayDoseCard({
  data,
  dose,
  onMarkDone,
}: {
  data: AppData;
  dose: Dose;
  onMarkDone: () => void;
}) {
  const t = useTranslations("Inicio");
  const tSite = useTranslations("InjectionSite");

  const peptide = data.peptides.find((p) => p.id === dose.peptideId);

  // Vial activo = el más reciente de ese péptido. Es el que el usuario tiene
  // abierto ahora mismo, que es de donde va a cargar.
  const vial = [...data.vials]
    .filter((v) => v.peptideId === dose.peptideId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  // Solo se puede decir "carga hasta X unidades" si el vial está reconstituido
  // (hay agua) y las unidades son químicas. Si falta el dato NO se inventa
  // nada: se muestra la dosis a secas, como antes.
  const units = (() => {
    if (!vial?.bacWater) return null;
    const vialAmount = parseFloat(vial.amount);
    const bacWater = parseFloat(vial.bacWater);
    const doseAmount = parseFloat(dose.amount);
    if (!Number.isFinite(vialAmount) || !Number.isFinite(bacWater) || !Number.isFinite(doseAmount)) return null;
    const u = unitsToDraw({
      vialAmount,
      vialUnit: vial.unit,
      bacWater,
      doseAmount,
      doseUnit: dose.unit,
    });
    return u !== null && Number.isFinite(u) && u > 0 ? u : null;
  })();

  const syringeType = vial?.syringeType || "u100";
  const overCapacity = units !== null && units > SYRINGE_CAPACITY[syringeType];
  // Por debajo de 1 unidad no hay marca fiable en una jeringa de insulina.
  const underMeasurable = units !== null && units < 1;
  const site = suggestNextInjectionSite(data.doses, dose.peptideId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mt-4 rounded-xl bg-accent p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-accent-foreground">{t("todayTitle")}</p>
        <span className="text-xs text-muted-foreground">{dose.when}</span>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <PeptideIcon peptideName={peptide?.name || ""} />
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold text-foreground">
            {peptide?.name || t("peptideFallback")}
          </p>
          <p className="text-sm text-muted-foreground">
            {dose.amount} {dose.unit}
          </p>
        </div>
      </div>

      {units !== null && (
        <div className="mt-3 rounded-lg bg-card p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <SyringeIcon className="size-3.5 text-primary" aria-hidden /> {t("todayDrawLabel")}
          </p>
          <p className="mt-0.5 font-display text-2xl font-bold tabular-nums text-primary">
            {units.toFixed(1)} <span className="text-sm font-medium text-muted-foreground">{t("units")}</span>
          </p>
          <div className="mt-2">
            <SyringeVisual syringeType={syringeType} units={units} />
          </div>
          {overCapacity && <p className="mt-1 text-center text-xs text-destructive">{t("todayOverCapacity")}</p>}
          {underMeasurable && <p className="mt-1 text-center text-xs text-destructive">{t("todayUnderMeasurable")}</p>}
        </div>
      )}

      <p className="mt-3 flex items-center gap-1.5 text-sm text-foreground">
        <MapPin className="size-4 text-primary" aria-hidden />
        {t("todaySite", { site: tSite(`site_${site}`) })}
      </p>

      <button
        type="button"
        onClick={onMarkDone}
        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
      >
        <Check className="size-4" aria-hidden /> {t("markDone")}
      </button>
    </motion.div>
  );
}
