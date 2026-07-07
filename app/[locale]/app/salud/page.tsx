"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Scale, Droplets, Footprints, AlertTriangle } from "lucide-react";
import { addHealthLog, loadAppData, type AppData, type HealthLog } from "@/lib/app-data";
import { SubTabs, type SubTabItem } from "@/components/app/shell/SubTabs";
import { PremiumLocked } from "@/components/app/shell/PremiumLocked";

type Tab = "peso" | "ejercicio" | "hidratacion" | "efectos";

export default function SaludPage() {
  const t = useTranslations("Salud");
  const locale = useLocale();
  const [tab, setTab] = useState<Tab>("peso");
  const [data, setData] = useState<AppData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [weightKg, setWeightKg] = useState("");
  const [hydrationMl, setHydrationMl] = useState("");
  const [exerciseMin, setExerciseMin] = useState("");
  const [sideEffect, setSideEffect] = useState("");

  useEffect(() => {
    loadAppData().then(setData);
  }, []);

  if (!data) return null;

  const TABS: SubTabItem[] = [
    { key: "peso", label: t("tabWeight"), icon: Scale },
    { key: "ejercicio", label: t("tabExercise"), icon: Footprints },
    { key: "hidratacion", label: t("tabHydration"), icon: Droplets, locked: true },
    { key: "efectos", label: t("tabSideEffects"), icon: AlertTriangle, locked: true },
  ];

  async function handleSave() {
    if (!data) return;
    if (!weightKg.trim() && !hydrationMl.trim() && !exerciseMin.trim() && !sideEffect.trim()) return;
    const next = await addHealthLog(data, {
      date: new Date().toISOString().slice(0, 10),
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

  function formatLogDate(iso: string) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(locale, { day: "numeric", month: "short" });
  }

  const weightLogs = data.healthLogs.filter((h) => h.weightKg);
  const exerciseLogs = data.healthLogs.filter((h) => h.exerciseMin);

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        {(tab === "peso" || tab === "ejercicio") && (
          <button
            type="button"
            onClick={() => setShowForm((s) => !s)}
            aria-label={t("addAria")}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
          >
            <Plus className="size-5" aria-hidden />
          </button>
        )}
      </div>

      <SubTabs items={TABS} value={tab} onChange={(k) => setTab(k as Tab)} />

      <div className="mt-4">
        {showForm && (tab === "peso" || tab === "ejercicio") && (
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
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t("exerciseLabel")}
              </label>
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
                {t("hydrationLabel")}
              </label>
              <input
                value={hydrationMl}
                onChange={(e) => setHydrationMl(e.target.value)}
                inputMode="numeric"
                placeholder="1900"
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

        {tab === "peso" && (
          <HealthList
            logs={weightLogs}
            emptyText={t("weightEmptyState")}
            formatDate={formatLogDate}
            render={(log) => (
              <span className="flex items-center gap-1">
                <Scale className="size-3.5 text-muted-foreground" aria-hidden /> {log.weightKg} kg
              </span>
            )}
          />
        )}

        {tab === "ejercicio" && (
          <HealthList
            logs={exerciseLogs}
            emptyText={t("exerciseEmptyState")}
            formatDate={formatLogDate}
            render={(log) => (
              <span className="flex items-center gap-1">
                <Footprints className="size-3.5 text-muted-foreground" aria-hidden /> {log.exerciseMin} min
              </span>
            )}
          />
        )}

        {tab === "hidratacion" && <PremiumLocked description={t("hydrationLockedDesc")} />}

        {tab === "efectos" && <PremiumLocked description={t("sideEffectsLockedDesc")} />}
      </div>
    </div>
  );
}

function HealthList({
  logs,
  emptyText,
  formatDate,
  render,
}: {
  logs: HealthLog[];
  emptyText: string;
  formatDate: (iso: string) => string;
  render: (log: HealthLog) => React.ReactNode;
}) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
      {logs.map((log) => (
        <div key={log.id} className="rounded-xl border border-border bg-card p-3">
          <span className="text-xs font-medium text-muted-foreground">{formatDate(log.date)}</span>
          <div className="mt-1 text-sm text-foreground">{render(log)}</div>
        </div>
      ))}
    </div>
  );
}
