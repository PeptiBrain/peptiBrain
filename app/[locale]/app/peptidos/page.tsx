"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Package, Syringe, Beaker, Calculator, Check, Lock, Droplet, Trash2, CalendarClock, Zap, Pill, Wind, ArrowRightLeft, Building2 } from "lucide-react";
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
import { UnitConverter } from "@/components/app/peptidos/UnitConverter";
import { ProviderModal } from "@/components/app/peptidos/ProviderModal";
import { SubTabs, type SubTabItem } from "@/components/app/shell/SubTabs";
import { PremiumLocked } from "@/components/app/shell/PremiumLocked";
import { DateRangeTabs } from "@/components/app/shell/DateRangeTabs";
import { isWithinRange, type CustomRange, type DateRangeKey } from "@/lib/date-range";
import { celebrate } from "@/lib/celebrate";
import { vialStatus } from "@/lib/stats";

const ROUTES = [
  { name: "Subcutánea", icon: Syringe },
  { name: "Intramuscular", icon: Zap },
  { name: "Oral", icon: Pill },
  { name: "Nasal", icon: Wind },
];

type Tab = "resumen" | "inventario" | "proveedores" | "calculadora";

export default function PeptidosPage() {
  const t = useTranslations("Peptidos");
  const [tab, setTab] = useState<Tab>("resumen");
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
    { key: "resumen", label: t("tabSummary"), subtitle: t("tabSummaryDesc"), icon: Syringe },
    { key: "inventario", label: t("tabInventory"), subtitle: t("tabInventoryDesc"), icon: Package },
    { key: "proveedores", label: t("tabProvidersTab"), subtitle: t("tabProvidersDesc"), icon: Building2 },
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

      {tab === "resumen" && (
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
        {tab === "resumen" && <UsosTab data={data} onChange={setData} range={range} customRange={customRange} />}

        {tab === "inventario" && (
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

            {/* Viales dentro del Inventario */}
            <div className="mt-4 border-t border-border pt-4">
              <ViatesTab data={data} onChange={setData} t={t} />
            </div>
          </>
        )}

        {tab === "proveedores" && <ProvidersSection data={data} onChange={setData} t={t} />}

        {tab === "calculadora" &&
          (isPremium ? (
            <CalculadoraTab data={data} t={t} />
          ) : (
            <PremiumLocked description={t("calculatorLockedDesc")} />
          ))}
      </div>
    </div>
  );
}

function CalculadoraTab({
  data,
  t,
}: {
  data: AppData;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const [tool, setTool] = useState<"recon" | "converter">("recon");
  return (
    <div>
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setTool("recon")}
          className={`flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium ${
            tool === "recon"
              ? "border-primary bg-accent text-accent-foreground"
              : "border-border bg-card text-foreground"
          }`}
        >
          <Calculator className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{t("calculatorToolRecon")}</span>
        </button>
        <button
          type="button"
          onClick={() => setTool("converter")}
          className={`flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium ${
            tool === "converter"
              ? "border-primary bg-accent text-accent-foreground"
              : "border-border bg-card text-foreground"
          }`}
        >
          <ArrowRightLeft className="size-4 shrink-0" aria-hidden />
          <span className="truncate">{t("calculatorToolConverter")}</span>
        </button>
      </div>
      {tool === "recon" ? <ReconstitutionCalculator data={data} /> : <UnitConverter />}
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

                {(() => {
                  const status = vialStatus(v, data.doses);
                  if (!status) return null;
                  const tone =
                    status.pct <= 0 ? "empty" : status.pct <= 30 ? "low" : "ok";
                  const toneClass =
                    tone === "empty"
                      ? "bg-destructive/10 text-destructive"
                      : tone === "low"
                        ? "bg-[var(--notice-bg)] text-[var(--notice-icon)]"
                        : "bg-primary/15 text-primary";
                  return (
                    <div className={`mt-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${toneClass}`}>
                      {tone === "empty"
                        ? t("vialEmpty")
                        : status.dosesLeftEstimate != null
                          ? t("vialDosesLeft", { count: status.dosesLeftEstimate })
                          : t("vialPctLeft", { pct: status.pct })}
                      {tone !== "ok" && status.daysLeftEstimate != null && (
                        <span> · {t("vialDaysLeft", { days: status.daysLeftEstimate })}</span>
                      )}
                    </div>
                  );
                })()}

                {v.sharedWithMemberId &&
                  (() => {
                    const member = data.familyMembers.find((m) => m.id === v.sharedWithMemberId);
                    if (!member) return null;
                    const mine = v.splitPercent ?? 50;
                    return (
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {t("sharedVialWith", { name: member.name, mine, theirs: 100 - mine })}
                      </p>
                    );
                  })()}

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
  const [showModal, setShowModal] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function handleRemove(id: string) {
    onChange(await removeProvider(data, id));
    setConfirmId(null);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="size-4 text-primary" aria-hidden /> {t("providersSectionTitle")}
          <span className="text-xs font-normal text-muted-foreground">
            {t("providersSectionCount", { count: data.providers.length })}
          </span>
        </p>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition-transform active:scale-97"
        >
          <Plus className="size-3.5" aria-hidden /> {t("addProviderCta")}
        </button>
      </div>

      {data.providers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-8 text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="size-5 text-primary" aria-hidden />
          </div>
          <p className="text-sm font-medium text-foreground">{t("providersEmptyTitle")}</p>
          <p className="mx-auto mt-1 max-w-[18rem] text-xs text-muted-foreground">{t("providersSectionEmpty")}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {data.providers.map((p) => (
            <li key={p.id} className="rounded-xl border border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    {p.website && <span className="truncate">🌐 {p.website}</span>}
                    {p.socialHandle && (
                      <span className="truncate">
                        {p.socialNetwork}: {p.socialHandle}
                      </span>
                    )}
                    {p.phone && <span>📞 {p.phone}</span>}
                    {p.email && <span className="truncate">✉️ {p.email}</span>}
                  </div>
                  {p.brands.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.brands.map((b) => (
                        <span key={b} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-foreground">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.notes && <p className="mt-1.5 text-xs text-muted-foreground">{p.notes}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmId(p.id)}
                  aria-label={t("deleteConfirm")}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
              {confirmId === p.id && (
                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2">
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
                      onClick={() => handleRemove(p.id)}
                      className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20"
                    >
                      {t("deleteConfirm")}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <ProviderModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={async (draft) => {
          onChange(await addProvider(data, draft));
        }}
      />
    </div>
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
  const [forMemberId, setForMemberId] = useState("");

  const sorted = [...data.doses]
    .filter((d) => isWithinRange(d.scheduledAt, range, customRange))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  const activeVial = [...data.vials]
    .filter((v) => v.peptideId === peptideId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const sharedMember = activeVial?.sharedWithMemberId
    ? data.familyMembers.find((m) => m.id === activeVial.sharedWithMemberId)
    : undefined;

  async function handleSave() {
    if (!peptideId || !amount.trim()) return;
    const label = formatWhenLabel(whenInput);
    const scheduledAt = new Date(whenInput).toISOString();
    const next = await addDose(data, {
      peptideId,
      amount,
      unit,
      when: label,
      scheduledAt,
      forMemberId: forMemberId || undefined,
    });
    onChange(next);
    setAmount("");
    setForMemberId("");
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
          {sharedMember && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t("forWhomLabel")}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForMemberId("")}
                  className={`h-10 rounded-lg border text-sm font-medium ${
                    !forMemberId
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  {t("forWhomMe")}
                </button>
                <button
                  type="button"
                  onClick={() => setForMemberId(sharedMember.id)}
                  className={`h-10 rounded-lg border text-sm font-medium ${
                    forMemberId === sharedMember.id
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-background text-foreground"
                  }`}
                >
                  {sharedMember.name}
                </button>
              </div>
            </div>
          )}
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
            const recipient = d.forMemberId ? data.familyMembers.find((m) => m.id === d.forMemberId) : undefined;
            return (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{peptide?.name || "—"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {d.when} · {d.amount} {d.unit}
                    {recipient && ` · ${t("doseForMember", { name: recipient.name })}`}
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
