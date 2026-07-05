"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { HeartPulse, Plus, Scale, Droplets, Footprints } from "lucide-react";
import { addHealthLog, loadAppData, type AppData } from "@/lib/app-data";

export default function SaludPage() {
  const t = useTranslations("Salud");
  const locale = useLocale();
  const [data, setData] = useState<AppData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [weightKg, setWeightKg] = useState("");
  const [hydrationMl, setHydrationMl] = useState("");
  const [exerciseMin, setExerciseMin] = useState("");
  const [sideEffect, setSideEffect] = useState("");

  useEffect(() => {
    setData(loadAppData());
  }, []);

  if (!data) return null;

  function handleSave() {
    if (!data) return;
    if (!weightKg.trim() && !hydrationMl.trim() && !exerciseMin.trim() && !sideEffect.trim()) return;
    const next = addHealthLog(data, {
      date: new Date().toLocaleDateString(locale, { day: "numeric", month: "short" }),
      weightKg: weightKg.trim() || undefined,
      hydrationMl: hydrationMl.trim() || undefined,
      exerciseMin: exerciseMin.trim() || undefined,
      sideEffect: sideEffect.trim() || undefined,
    });
    setData(next);
    setWeightKg("");
    setHydrationMl("");
    setExerciseMin("");
    setSideEffect("");
    setShowForm(false);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          aria-label={t("addAria")}
          className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
        >
          <Plus className="size-5" aria-hidden />
        </button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-3 rounded-xl border border-border bg-card p-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t("weightLabel")}</label>
            <input
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              inputMode="decimal"
              placeholder="82.5"
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t("hydrationLabel")}</label>
            <input
              value={hydrationMl}
              onChange={(e) => setHydrationMl(e.target.value)}
              inputMode="numeric"
              placeholder="1900"
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t("exerciseLabel")}</label>
            <input
              value={exerciseMin}
              onChange={(e) => setExerciseMin(e.target.value)}
              inputMode="numeric"
              placeholder="30"
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              {t("sideEffectLabel")}
            </label>
            <input
              value={sideEffect}
              onChange={(e) => setSideEffect(e.target.value)}
              placeholder={t("sideEffectPlaceholder")}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
          >
            {t("saveRecord")}
          </button>
        </div>
      )}

      {data.healthLogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <HeartPulse className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.healthLogs.map((log) => (
            <div key={log.id} className="rounded-xl border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{log.date}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground">
                {log.weightKg && (
                  <span className="flex items-center gap-1">
                    <Scale className="size-3.5 text-muted-foreground" aria-hidden /> {log.weightKg} kg
                  </span>
                )}
                {log.hydrationMl && (
                  <span className="flex items-center gap-1">
                    <Droplets className="size-3.5 text-muted-foreground" aria-hidden /> {log.hydrationMl} ml
                  </span>
                )}
                {log.exerciseMin && (
                  <span className="flex items-center gap-1">
                    <Footprints className="size-3.5 text-muted-foreground" aria-hidden /> {log.exerciseMin} min
                  </span>
                )}
              </div>
              {log.sideEffect && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("effectPrefix")} {log.sideEffect}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
