"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Check, Flame, Package } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { loadOnboarding } from "@/lib/onboarding";
import { loadAppData, markDoseDone, type AppData } from "@/lib/app-data";
import { track } from "@/lib/mixpanel";

export default function InicioPage() {
  const t = useTranslations("Inicio");
  const [data, setData] = useState<AppData | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    setData(loadAppData());
    setName(loadOnboarding().name);
  }, []);

  if (!data) return null;

  const pendingDose = data.doses.find((d) => !d.done);
  const donePeptide = pendingDose
    ? data.peptides.find((p) => p.id === pendingDose.peptideId)
    : null;
  const streak = data.doses.filter((d) => d.done).length;

  function handleMarkDone() {
    if (!pendingDose || !data) return;
    setData(markDoseDone(data, pendingDose.id));
    track("dose_logged", { peptide: donePeptide?.name });
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-5">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-muted-foreground"
      >
        {t("greeting")}
        {name ? `, ${name}` : ""}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-1.5 font-display text-xl font-bold text-foreground"
      >
        {streak > 0 ? (
          <>
            {t("streakLine")} <Flame className="size-5 text-primary" aria-hidden />
          </>
        ) : (
          t("goodDayFallback")
        )}
      </motion.p>

      {pendingDose ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-xl bg-accent p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-accent-foreground">{t("nextDose")}</p>
            <span className="text-xs text-muted-foreground">{pendingDose.when}</span>
          </div>
          <p className="mt-1 font-display text-lg font-bold text-foreground">
            {donePeptide?.name || t("peptideFallback")}
          </p>
          <p className="text-sm text-muted-foreground">
            {pendingDose.amount} {pendingDose.unit}
          </p>
          <button
            type="button"
            onClick={handleMarkDone}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
          >
            <Check className="size-4" aria-hidden /> {t("markDone")}
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-xl border border-dashed border-border p-6 text-center"
        >
          <Package className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("noDosesPending")}</p>
          <Link
            href="/app/peptidos"
            className="mt-2 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            {t("scheduleDose")}
          </Link>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-3 grid grid-cols-2 gap-3"
      >
        <div className="rounded-xl bg-secondary p-3">
          <p className="text-xs text-muted-foreground">{t("streakLabel")}</p>
          <p className="tabular font-display text-xl font-bold text-foreground">
            {t("streakDoses", { count: streak })}
          </p>
        </div>
        <div className="rounded-xl bg-secondary p-3">
          <p className="text-xs text-muted-foreground">{t("activePeptides")}</p>
          <p className="tabular font-display text-xl font-bold text-foreground">
            {data.peptides.length}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
