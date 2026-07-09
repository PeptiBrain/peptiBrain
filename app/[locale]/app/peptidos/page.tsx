"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Package, Syringe, Beaker, Calculator, Check, Lock, Droplet, Trash2, CalendarClock, Zap, Pill, Wind } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  addDose,
  addPeptide,
  addProtocol,
  addProvider,
  loadAppData,
  markDoseDone,
  removeProvider,
  removeVial,
  PlanLimitError,
  type AppData,
} from "@/lib/app-data";
import { PeptideCard } from "@/components/app/peptidos/PeptideCard";
import { PeptideIcon } from "@/components/app/peptidos/PeptideIcon";
import { ProtocolModal } from "@/components/app/peptidos/ProtocolModal";
import { ReconstitutionCalculator } from "@/components/app/peptidos/ReconstitutionCalculator";
import { SubTabs, type SubTabItem } from "@/components/app/shell/SubTabs";
import { PremiumLocked } from "@/components/app/shell/PremiumLocked";
import { DateRangeTabs } from "@/components/app/shell/DateRangeTabs";
import { isWithinRange, type CustomRange, type DateRangeKey } from "@/lib/date-range";
import { celebrate } from "@/lib/celebrate";

const ROUTES = [
  { name: "Subcutánea", icon: Syringe },
  { name: "Intramuscular", icon: Zap },
  { name: "Oral", icon: Pill },
  { name: "Nasal", icon: Wind },
];

type Tab = "usos" | "peptidos" | "viales" | "calculadora";

export default function PeptidosPage() {
  const t = useTranslations("Peptidos");
  const [tab, setTab] = useState<Tab>("usos");
  const [data, setData] = useState<AppData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [route, setRoute] = useState("Subcutánea");
  const [limitReached, setLimitReached] = useState(false);
  const [range, setRange] = useState<DateRangeKey>("all");
  const [customRange, setCustomRange] = useState<CustomRange | null>(null);

  useEffect(() => {
    loadAppData().then(setData);
  }, []);

  if (!data) return null;

  const isPremium = data.plan !== "free";

  const TABS: SubTabItem[] = [
    { key: "usos", label: t("tabUses"), subtitle: t("tabUsesDesc"), icon: Syringe },
    { key: "peptidos", label: t("title"), subtitle: t("tabPeptidesDesc"), icon: Package },
    { key: "viales", label: t("tabVials"), subtitle: t("tabVialsDesc"), icon: Beaker },
    {
      key: "calculadora",
      label: t("tabCalculator"),
      subtitle: t("tabCalculatorDesc"),
      icon: Calculator,
      locked: !isPremium,
    },
  ];

  async function handleAdd() {
    if (!name.trim() || !data) return;
    const wasFirstPeptide = data.peptides.length === 0;
    try {
      const next = await addPeptide(data, { name: name.trim(), route, typicalDose: "", typicalUnit: "mg" });
      setData(next);
      setName("");
      setShowForm(false);
      setLimitReached(false);
      if (wasFirstPeptide) celebrate();
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

      {tab === "usos" && (
        <div className="mt-3">
          <DateRangeTabs
            value={range}
            onChange={setRange}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
        </div>
      )}

      <div className="mt-4">
        {tab === "usos" && <UsosTab data={data} onChange={setData} range={range} customRange={customRange} />}

        {tab === "peptidos" && (
          <>
            {data.plan === "free" && data.peptides.length >= 1 ? (
              <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-dashed border-border bg-secondary/40 p-3">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="size-3.5 shrink-0" aria-hidden /> {t("planLimitReached")}
                </p>
                <Link
                  href="/paywall"
                  className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  {t("planLimitCta")}
                </Link>
              </div>
            ) : (
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
            )}

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
                      key={r.name}
                      type="button"
                      onClick={() => setRoute(r.name)}
                      className={`flex h-10 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium ${
                        route === r.name
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-border bg-background text-foreground"
                      }`}
                    >
                      <r.icon className="size-4" aria-hidden />
                      {r.name}
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

        {tab === "viales" && <ViatesTab data={data} onChange={setData} t={t} />}

        {tab === "calculadora" &&
          (isPremium ? (
            <ReconstitutionCalculator data={data} />
          ) : (
            <PremiumLocked description={t("calculatorLockedDesc")} />
          ))}
      </div>
    </div>
  );
}

function ViatesTab({
  data,
  onChange,
  t,
}: {
  data: AppData;
  onChange: (next: AppData) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const locale = useLocale();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleDelete(vialId: string) {
    const next = await removeVial(data, vialId);
    onChange(next);
    setConfirmId(null);
  }

  const reconstitutedVials = data.vials.filter((v) => v.bacWater);

  return (
    <div className="space-y-4">
      {data.vials.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-8 text-center">
          <Beaker className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">{t("vialsEmptyState")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("vialsHint")}</p>
        </div>
      ) : (
        <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
          {data.vials.map((v) => {
            const peptide = data.peptides.find((p) => p.id === v.peptideId);
            const reconstituted = Boolean(v.bacWater);
            const openedOn = new Date(v.createdAt).toLocaleDateString(locale, {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            return (
              <div key={v.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                      reconstituted ? "bg-primary/15" : "bg-[var(--notice-bg)]"
                    }`}
                  >
                    <PeptideIcon peptideName={peptide?.name || ""} size="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{peptide?.name || "—"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t("vialOpenedOn", { date: openedOn })}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {v.amount} {v.unit}
                      {v.bacWater &&
                        ` · ${(parseFloat(v.amount) / parseFloat(v.bacWater)).toFixed(2)} ${v.unit}/mL`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmId(v.id)}
                    aria-label={t("deleteVialAria")}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
                <span
                  className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    reconstituted
                      ? "bg-primary/15 text-primary"
                      : "bg-[var(--notice-bg)] text-[var(--notice-icon)]"
                  }`}
                >
                  <Droplet className="size-3" aria-hidden />
                  {reconstituted ? t("vialReconstituted") : t("vialNotReconstituted")}
                </span>

                {confirmId === v.id && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2">
                    <p className="text-xs text-foreground">{t("confirmDeleteVial")}</p>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.id)}
                        className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20"
                      >
                        {t("deleteConfirm")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <CollapsibleSection
        icon={<Droplet className="size-4 text-primary" aria-hidden />}
        title={t("bacWaterSectionTitle")}
        count={t("bacWaterSectionCount", { count: reconstitutedVials.length })}
      >
        {reconstitutedVials.length === 0 ? (
          <p className="py-2 text-sm text-muted-foreground">{t("bacWaterSectionEmpty")}</p>
        ) : (
          <ul className="space-y-2">
            {reconstitutedVials.map((v) => {
              const peptide = data.peptides.find((p) => p.id === v.peptideId);
              return (
                <li key={v.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{peptide?.name || "—"}</span>
                  <span className="text-xs text-muted-foreground">
                    {v.bacWater} mL · {(parseFloat(v.amount) / parseFloat(v.bacWater)).toFixed(2)} {v.unit}/mL
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CollapsibleSection>

      <ProvidersSection data={data} onChange={onChange} t={t} />
    </div>
  );
}

function CollapsibleSection({
  icon,
  title,
  count,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  count: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 p-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {icon} {title}
        </span>
        <span className="text-xs text-muted-foreground">{count}</span>
      </button>
      {open && <div className="border-t border-border px-3 pb-3">{children}</div>}
    </div>
  );
}

function ProvidersSection({
  data,
  onChange,
  t,
}: {
  data: AppData;
  onChange: (next: AppData) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");

  async function handleAdd() {
    if (!name.trim()) return;
    const next = await addProvider(data, { name: name.trim() });
    onChange(next);
    setName("");
    setShowForm(false);
  }

  async function handleRemove(id: string) {
    onChange(await removeProvider(data, id));
  }

  return (
    <CollapsibleSection
      icon={<Package className="size-4 text-primary" aria-hidden />}
      title={t("providersSectionTitle")}
      count={t("providersSectionCount", { count: data.providers.length })}
    >
      {data.providers.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">{t("providersSectionEmpty")}</p>
      ) : (
        <ul className="space-y-1.5">
          {data.providers.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="min-w-0 truncate text-foreground">{p.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(p.id)}
                aria-label={t("deleteConfirm")}
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
              >
                <Trash2 className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <div className="mt-2 flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("providerNamePlaceholder")}
            className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="button"
            disabled={!name.trim()}
            onClick={handleAdd}
            className="h-10 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground disabled:opacity-50"
          >
            {t("saveVial")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          <Plus className="size-3.5" aria-hidden /> {t("addProviderCta")}
        </button>
      )}
    </CollapsibleSection>
  );
}

function UsosTab({
  data,
  onChange,
  range,
  customRange,
}: {
  data: AppData;
  onChange: (next: AppData) => void;
  range: DateRangeKey;
  customRange: CustomRange | null;
}) {
  const t = useTranslations("Peptidos");
  const [showForm, setShowForm] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [peptideId, setPeptideId] = useState(data.peptides[0]?.id || "");
  const [whenInput, setWhenInput] = useState(() => toLocalInputValue(new Date()));
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("mg");

  const sorted = [...data.doses]
    .filter((d) => isWithinRange(d.scheduledAt, range, customRange))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  async function handleSave() {
    if (!peptideId || !amount.trim()) return;
    const label = formatWhenLabel(whenInput);
    const scheduledAt = new Date(whenInput).toISOString();
    const next = await addDose(data, { peptideId, amount, unit, when: label, scheduledAt });
    onChange(next);
    setAmount("");
    setShowForm(false);
  }

  async function markDone(doseId: string) {
    onChange(await markDoseDone(data, doseId));
  }

  return (
    <div>
      <div className="mb-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowProtocol(true)}
          className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-transform active:scale-97"
        >
          <CalendarClock className="size-4" aria-hidden /> {t("createProtocol")}
        </button>
        <button
          type="button"
          onClick={() => setShowForm((s) => !s)}
          className="flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
        >
          <Plus className="size-4" aria-hidden /> {t("registerUse")}
        </button>
      </div>

      <ProtocolModal
        open={showProtocol}
        onClose={() => setShowProtocol(false)}
        peptides={data.peptides}
        onSave={async (payload) => {
          const next = await addProtocol(data, payload);
          onChange(next);
          setShowProtocol(false);
        }}
      />

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
