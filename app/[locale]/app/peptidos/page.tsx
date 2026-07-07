"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Package, Syringe, Beaker, Calculator, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { addDose, addPeptide, loadAppData, markDoseDone, PlanLimitError, type AppData } from "@/lib/app-data";
import { PeptideCard } from "@/components/app/peptidos/PeptideCard";
import { SubTabs, type SubTabItem } from "@/components/app/shell/SubTabs";
import { PremiumLocked } from "@/components/app/shell/PremiumLocked";

const ROUTES = ["Subcutánea", "Intramuscular", "Oral", "Nasal"];

type Tab = "usos" | "peptidos" | "viales" | "calculadora";

export default function PeptidosPage() {
  const t = useTranslations("Peptidos");
  const [tab, setTab] = useState<Tab>("usos");
  const [data, setData] = useState<AppData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [route, setRoute] = useState("Subcutánea");
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    loadAppData().then(setData);
  }, []);

  if (!data) return null;

  const TABS: SubTabItem[] = [
    { key: "usos", label: t("tabUses"), icon: Syringe },
    { key: "peptidos", label: t("title"), icon: Package },
    { key: "viales", label: t("tabVials"), icon: Beaker },
    { key: "calculadora", label: t("tabCalculator"), icon: Calculator, locked: true },
  ];

  async function handleAdd() {
    if (!name.trim() || !data) return;
    try {
      const next = await addPeptide(data, { name: name.trim(), route, typicalDose: "", typicalUnit: "mg" });
      setData(next);
      setName("");
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
    <div className="mx-auto max-w-3xl px-4 py-5">
      <div className="mb-4">
        <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <SubTabs items={TABS} value={tab} onChange={(k) => setTab(k as Tab)} />

      <div className="mt-4">
        {tab === "usos" && <UsosTab data={data} onChange={setData} />}

        {tab === "peptidos" && (
          <>
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm((s) => !s)}
                aria-label={t("addPeptideAria")}
                className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-97"
              >
                <Plus className="size-5" aria-hidden />
              </button>
            </div>

            {showForm && (
              <div className="mb-4 rounded-xl border border-border bg-card p-4">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("peptideNameLabel")}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("peptideNamePlaceholder")}
                  className="mb-3 h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <label className="mb-1.5 block text-sm font-medium text-foreground">{t("routeLabel")}</label>
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {ROUTES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRoute(r)}
                      className={`h-10 rounded-lg border text-sm font-medium ${
                        route === r
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-background text-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {limitReached && (
                  <div className="mb-3 rounded-lg bg-accent px-3 py-2 text-xs text-accent-foreground">
                    {t("planLimitReached")}{" "}
                    <Link href="/paywall" className="font-semibold underline underline-offset-2">
                      {t("planLimitCta")}
                    </Link>
                  </div>
                )}
                <button
                  type="button"
                  disabled={!name.trim()}
                  onClick={handleAdd}
                  className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {t("savePeptide")}
                </button>
              </div>
            )}

            {data.peptides.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <Package className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
                <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
              </div>
            ) : (
              <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
                {data.peptides.map((p) => (
                  <PeptideCard key={p.id} peptide={p} data={data} onChange={setData} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "viales" && <ViatesTab data={data} t={t} />}

        {tab === "calculadora" && <PremiumLocked description={t("calculatorLockedDesc")} />}
      </div>
    </div>
  );
}

function ViatesTab({ data, t }: { data: AppData; t: (key: string) => string }) {
  if (data.vials.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <Beaker className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">{t("vialsEmptyState")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("vialsHint")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
      {data.vials.map((v) => {
        const peptide = data.peptides.find((p) => p.id === v.peptideId);
        return (
          <div key={v.id} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3">
            <Beaker className="size-4 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{peptide?.name || "—"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {v.amount} {v.unit}
                {v.bacWater && ` · ${(parseFloat(v.amount) / parseFloat(v.bacWater)).toFixed(2)} ${v.unit}/mL`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UsosTab({ data, onChange }: { data: AppData; onChange: (next: AppData) => void }) {
  const t = useTranslations("Peptidos");
  const [showForm, setShowForm] = useState(false);
  const [peptideId, setPeptideId] = useState(data.peptides[0]?.id || "");
  const [whenInput, setWhenInput] = useState(() => toLocalInputValue(new Date()));
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("mg");

  const sorted = [...data.doses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  async function handleSave() {
    if (!peptideId || !amount.trim()) return;
    const label = formatWhenLabel(whenInput);
    const next = await addDose(data, { peptideId, amount, unit, when: label });
    onChange(next);
    setAmount("");
    setShowForm(false);
  }

  async function markDone(doseId: string) {
    onChange(await markDoseDone(data, doseId));
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
        >
          <Plus className="size-4" aria-hidden /> {t("registerUse")}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-3 rounded-xl border border-border bg-card p-4">
          {data.peptides.length > 0 && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {t("selectPeptideLabel")}
              </label>
              <select
                value={peptideId}
                onChange={(e) => setPeptideId(e.target.value)}
                className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground"
              >
                {data.peptides.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t("whenLabel")}</label>
            <input
              type="datetime-local"
              value={whenInput}
              onChange={(e) => setWhenInput(e.target.value)}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{t("doseLabel")}</label>
            <div className="flex gap-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="0.25"
                className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-base text-foreground"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="h-11 w-24 rounded-lg border border-input bg-background px-2 text-base text-foreground"
              >
                <option value="mg">mg</option>
                <option value="mcg">mcg</option>
                <option value="ml">ml</option>
                <option value="UI">UI</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            disabled={!peptideId || !amount.trim()}
            onClick={handleSave}
            className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {t("saveUse")}
          </button>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <Syringe className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("usesEmptyState")}</p>
        </div>
      ) : (
        <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
          {sorted.map((d) => {
            const peptide = data.peptides.find((p) => p.id === d.peptideId);
            return (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{peptide?.name || "—"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {d.when} · {d.amount} {d.unit}
                  </p>
                </div>
                {d.done ? (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                    <Check className="size-3.5" aria-hidden /> {t("done")}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => markDone(d.id)}
                    className="shrink-0 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
                  >
                    {t("pending")}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatWhenLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
