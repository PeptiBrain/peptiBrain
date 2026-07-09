"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Scale, Droplets, Footprints, AlertTriangle, Apple, Trash2 } from "lucide-react";
import {
  addHealthLog,
  addMeal,
  removeMeal,
  loadAppData,
  type AppData,
  type HealthLog,
  type Meal,
} from "@/lib/app-data";
import { SubTabs, type SubTabItem } from "@/components/app/shell/SubTabs";
import { PremiumLocked } from "@/components/app/shell/PremiumLocked";
import { ModalShell } from "@/components/app/shell/ModalShell";

type Tab = "peso" | "ejercicio" | "comidas" | "hidratacion" | "efectos";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function SaludPage() {
  const t = useTranslations("Salud");
  const locale = useLocale();
  const [tab, setTab] = useState<Tab>("peso");
  const [data, setData] = useState<AppData | null>(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseMin, setExerciseMin] = useState("");
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showHydrationModal, setShowHydrationModal] = useState(false);
  const [showSideEffectModal, setShowSideEffectModal] = useState(false);

  useEffect(() => {
    loadAppData().then(setData);
  }, []);

  if (!data) return null;

  const isPremium = data.plan !== "free";

  const TABS: SubTabItem[] = [
    { key: "peso", label: t("tabWeight"), icon: Scale },
    { key: "ejercicio", label: t("tabExercise"), icon: Footprints },
    { key: "comidas", label: t("tabMeals"), icon: Apple },
    { key: "hidratacion", label: t("tabHydration"), icon: Droplets, locked: !isPremium },
    { key: "efectos", label: t("tabSideEffects"), icon: AlertTriangle, locked: !isPremium },
  ];

  async function handleSaveExercise() {
    if (!data || !exerciseMin.trim()) return;
    const next = await addHealthLog(data, { date: todayIso(), exerciseMin: exerciseMin.trim() });
    setData(next);
    setExerciseMin("");
    setShowExerciseForm(false);
  }

  function formatLogDate(iso: string) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString(locale, { day: "numeric", month: "short" });
  }

  const weightLogs = data.healthLogs.filter((h) => h.weightKg);
  const exerciseLogs = data.healthLogs.filter((h) => h.exerciseMin);
  const hydrationLogs = data.healthLogs.filter((h) => h.hydrationMl);
  const sideEffectLogs = data.healthLogs.filter((h) => h.sideEffect);

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        {tab === "peso" && (
          <button
            type="button"
            onClick={() => setShowWeightModal(true)}
            aria-label={t("registerWeightAria")}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
          >
            <Plus className="size-5" aria-hidden />
          </button>
        )}
        {tab === "ejercicio" && (
          <button
            type="button"
            onClick={() => setShowExerciseForm((s) => !s)}
            aria-label={t("addAria")}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
          >
            <Plus className="size-5" aria-hidden />
          </button>
        )}
        {tab === "comidas" && (
          <button
            type="button"
            onClick={() => setShowMealModal(true)}
            aria-label={t("registerMealAria")}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
          >
            <Plus className="size-5" aria-hidden />
          </button>
        )}
        {tab === "hidratacion" && isPremium && (
          <button
            type="button"
            onClick={() => setShowHydrationModal(true)}
            aria-label={t("registerHydrationAria")}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
          >
            <Plus className="size-5" aria-hidden />
          </button>
        )}
        {tab === "efectos" && isPremium && (
          <button
            type="button"
            onClick={() => setShowSideEffectModal(true)}
            aria-label={t("registerSideEffectAria")}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
          >
            <Plus className="size-5" aria-hidden />
          </button>
        )}
      </div>

      <SubTabs items={TABS} value={tab} onChange={(k) => setTab(k as Tab)} />

      <div className="mt-4">
        {tab === "ejercicio" && showExerciseForm && (
          <div className="mb-4 space-y-3 rounded-xl border border-border bg-card p-4">
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
            <button
              type="button"
              onClick={handleSaveExercise}
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
            emptyCta={t("registerWeightAria")}
            onEmptyCta={() => setShowWeightModal(true)}
            formatDate={formatLogDate}
            render={(log) => (
              <div>
                <span className="flex items-center gap-1">
                  <Scale className="size-3.5 text-muted-foreground" aria-hidden /> {log.weightKg} kg
                </span>
                {log.notes && <p className="mt-1 text-xs text-muted-foreground">{log.notes}</p>}
              </div>
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

        {tab === "comidas" && (
          <MealsList
            meals={data.meals}
            emptyText={t("mealsEmptyState")}
            emptyCta={t("registerMealAria")}
            onEmptyCta={() => setShowMealModal(true)}
            formatDate={formatLogDate}
            onDelete={async (id) => {
              const next = await removeMeal(data, id);
              setData(next);
            }}
          />
        )}

        {tab === "hidratacion" &&
          (isPremium ? (
            <HealthList
              logs={hydrationLogs}
              emptyText={t("hydrationEmptyState")}
              emptyCta={t("registerHydrationAria")}
              onEmptyCta={() => setShowHydrationModal(true)}
              formatDate={formatLogDate}
              render={(log) => (
                <span className="flex items-center gap-1">
                  <Droplets className="size-3.5 text-muted-foreground" aria-hidden /> {log.hydrationMl} ml
                </span>
              )}
            />
          ) : (
            <PremiumLocked description={t("hydrationLockedDesc")} />
          ))}

        {tab === "efectos" &&
          (isPremium ? (
            <HealthList
              logs={sideEffectLogs}
              emptyText={t("sideEffectsEmptyState")}
              emptyCta={t("registerSideEffectAria")}
              onEmptyCta={() => setShowSideEffectModal(true)}
              formatDate={formatLogDate}
              render={(log) => (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="size-3.5 text-[var(--notice-icon)]" aria-hidden /> {log.sideEffect}
                </span>
              )}
            />
          ) : (
            <PremiumLocked description={t("sideEffectsLockedDesc")} />
          ))}
      </div>

      <WeightModal
        open={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        onSave={async (payload) => {
          const next = await addHealthLog(data, payload);
          setData(next);
          setShowWeightModal(false);
        }}
      />

      <MealModal
        open={showMealModal}
        onClose={() => setShowMealModal(false)}
        onSave={async (payload) => {
          const next = await addMeal(data, payload);
          setData(next);
          setShowMealModal(false);
        }}
      />

      <HydrationModal
        open={showHydrationModal}
        onClose={() => setShowHydrationModal(false)}
        onSave={async (payload) => {
          const next = await addHealthLog(data, payload);
          setData(next);
          setShowHydrationModal(false);
        }}
      />

      <SideEffectModal
        open={showSideEffectModal}
        onClose={() => setShowSideEffectModal(false)}
        onSave={async (payload) => {
          const next = await addHealthLog(data, payload);
          setData(next);
          setShowSideEffectModal(false);
        }}
      />
    </div>
  );
}

function HealthList({
  logs,
  emptyText,
  emptyCta,
  onEmptyCta,
  formatDate,
  render,
}: {
  logs: HealthLog[];
  emptyText: string;
  emptyCta?: string;
  onEmptyCta?: () => void;
  formatDate: (iso: string) => string;
  render: (log: HealthLog) => React.ReactNode;
}) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">{emptyText}</p>
        {emptyCta && onEmptyCta && (
          <button
            type="button"
            onClick={onEmptyCta}
            className="mt-3 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            {emptyCta}
          </button>
        )}
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

function MealsList({
  meals,
  emptyText,
  emptyCta,
  onEmptyCta,
  formatDate,
  onDelete,
}: {
  meals: Meal[];
  emptyText: string;
  emptyCta?: string;
  onEmptyCta?: () => void;
  formatDate: (iso: string) => string;
  onDelete: (id: string) => void;
}) {
  if (meals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">{emptyText}</p>
        {emptyCta && onEmptyCta && (
          <button
            type="button"
            onClick={onEmptyCta}
            className="mt-3 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            {emptyCta}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {meals.map((meal) => (
        <div key={meal.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
            <Apple className="size-4 text-primary" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{meal.description}</p>
            <p className="text-xs text-muted-foreground">
              {formatDate(meal.date)}
              {meal.calories ? ` · ${meal.calories} kcal` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onDelete(meal.id)}
            aria-label="Eliminar"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}

function WeightModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Omit<HealthLog, "id">) => void;
}) {
  const t = useTranslations("Salud");
  const [date, setDate] = useState(todayIso());
  const [weightKg, setWeightKg] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setDate(todayIso());
      setWeightKg("");
      setNotes("");
    }
  }, [open]);

  return (
    <ModalShell open={open} onClose={onClose} title={t("registerWeightTitle")} icon={<Scale className="size-5 text-primary" aria-hidden />}>
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("dateLabel")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
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
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("notesLabel")}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            disabled={!weightKg.trim()}
            onClick={() => onSave({ date, weightKg: weightKg.trim(), notes: notes.trim() || undefined })}
            className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {t("saveRecord")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function MealModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Omit<Meal, "id" | "createdAt">) => void;
}) {
  const t = useTranslations("Salud");
  const [date, setDate] = useState(todayIso());
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");

  useEffect(() => {
    if (open) {
      setDate(todayIso());
      setDescription("");
      setCalories("");
    }
  }, [open]);

  return (
    <ModalShell open={open} onClose={onClose} title={t("registerMealTitle")} icon={<Apple className="size-5 text-primary" aria-hidden />}>
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("dateLabel")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("mealDescriptionLabel")}</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("mealDescriptionPlaceholder")}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("caloriesLabel")}</label>
          <input
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            inputMode="numeric"
            placeholder="450"
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            disabled={!description.trim()}
            onClick={() =>
              onSave({ date, description: description.trim(), calories: calories.trim() || undefined })
            }
            className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {t("saveRecord")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function HydrationModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Omit<HealthLog, "id">) => void;
}) {
  const t = useTranslations("Salud");
  const [date, setDate] = useState(todayIso());
  const [hydrationMl, setHydrationMl] = useState("");

  useEffect(() => {
    if (open) {
      setDate(todayIso());
      setHydrationMl("");
    }
  }, [open]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={t("registerHydrationTitle")}
      icon={<Droplets className="size-5 text-primary" aria-hidden />}
    >
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("dateLabel")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            disabled={!hydrationMl.trim()}
            onClick={() => onSave({ date, hydrationMl: hydrationMl.trim() })}
            className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {t("saveRecord")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function SideEffectModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Omit<HealthLog, "id">) => void;
}) {
  const t = useTranslations("Salud");
  const [date, setDate] = useState(todayIso());
  const [sideEffect, setSideEffect] = useState("");

  useEffect(() => {
    if (open) {
      setDate(todayIso());
      setSideEffect("");
    }
  }, [open]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={t("registerSideEffectTitle")}
      icon={<AlertTriangle className="size-5 text-primary" aria-hidden />}
    >
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("dateLabel")}</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{t("sideEffectLabel")}</label>
          <input
            value={sideEffect}
            onChange={(e) => setSideEffect(e.target.value)}
            placeholder={t("sideEffectPlaceholder")}
            className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            disabled={!sideEffect.trim()}
            onClick={() => onSave({ date, sideEffect: sideEffect.trim() })}
            className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {t("saveRecord")}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-lg border border-border px-4 text-sm font-medium text-foreground"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
