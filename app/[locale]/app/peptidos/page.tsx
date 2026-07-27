"use client";

import { Suspense, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Package, Syringe, Beaker, Calculator, Check, Lock, Droplet, Trash2, CalendarClock, Zap, Pill, Wind, ArrowRightLeft, Shuffle, Building2, Users, X } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getPeptideBottleImage } from "@/lib/vial-visual";
import {
  addDose,
  addPeptide,
  addProtocol,
  addTitrationProtocol,
  addProvider,
  markDoseDone,
  removeDose,
  removeProvider,
  removeVial,
  addVialShare,
  removeVialShare,
  PlanLimitError,
  type AppData,
  type Vial,
} from "@/lib/app-data";
import { USER_DATA_CURRENCY, type Locale } from "@/i18n/routing";
import { PeptideCard } from "@/components/app/peptidos/PeptideCard";
import { ProtocolModal } from "@/components/app/peptidos/ProtocolModal";
import { ReconstitutionCalculator } from "@/components/app/peptidos/ReconstitutionCalculator";
import { UnitConverter } from "@/components/app/peptidos/UnitConverter";
import { GlpDoseCalculator } from "@/components/app/calculator/GlpDoseCalculator";
import { ComparadorTool } from "@/components/app/calculator/ComparadorTool";
import { ProviderModal } from "@/components/app/peptidos/ProviderModal";
import { WeekSchedule } from "@/components/app/peptidos/WeekSchedule";
import { ShoppingList } from "@/components/app/peptidos/ShoppingList";
import { SubTabs, type SubTabItem } from "@/components/app/shell/SubTabs";
import { PremiumLocked } from "@/components/app/shell/PremiumLocked";
import { PageSkeleton } from "@/components/app/shell/PageSkeleton";
import { PEPTIDE_PROFILES } from "@/lib/peptide-profiles";
import { DateRangeTabs } from "@/components/app/shell/DateRangeTabs";
import { isWithinRange, type CustomRange, type DateRangeKey } from "@/lib/date-range";
import { toMg } from "@/lib/dose-math";
import { PLAUSIBLE, numberInRange } from "@/lib/plausible";
import { logError } from "@/lib/error-log";
import { useSaveAction } from "@/lib/hooks/useSaveAction";
import { useAppData } from "@/lib/hooks/useAppData";
import { celebrate } from "@/lib/celebrate";
import { vialStatus, vialLifecycle } from "@/lib/stats";

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
  const { data, setData } = useAppData();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [route, setRoute] = useState("Subcutánea");
  const [limitReached, setLimitReached] = useState(false);
  const [savingPeptide, setSavingPeptide] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);
  const [range, setRange] = useState<DateRangeKey>("all");
  const [customRange, setCustomRange] = useState<CustomRange | null>(null);

  // Sugerencias de la base de 48 péptidos a partir de 2 letras. Busca por
  // nombre Y por etiquetas: nadie escribe "Semaglutida" cuando lo que tiene en
  // la cabeza es "GLP-1", ni "Testosterona Cipionato" cuando piensa "TRT" —
  // que son justo los términos con los que se anuncia la app.
  // Se ocultan al elegir una para no tapar el resto del formulario.
  const nameMatches =
    name.trim().length >= 2 && !suggestionsHidden
      ? PEPTIDE_PROFILES.filter((p) => {
          const q = name.trim().toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.tags.some((tag) => tag.toLowerCase().includes(q))
          );
        }).slice(0, 8)
      : [];

  if (!data) return <PageSkeleton tabs cards={3} />;

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

  // Se podían crear dos péptidos idénticos ("Semaglutida" y "Semaglutida"),
  // indistinguibles en el desplegable de "Registrar uso" — el usuario no sabe
  // en cuál está registrando, y las estadísticas se parten en dos.
  const duplicateName =
    !!data &&
    name.trim().length > 0 &&
    data.peptides.some((p) => p.name.trim().toLowerCase() === name.trim().toLowerCase());

  async function handleAdd() {
    // Sin este guard, 3 clics rápidos disparaban 3 POST y creaban 3 péptidos
    // idénticos — es el origen REAL de los "Semaglutida" duplicados. La
    // comprobación por nombre no basta: el estado no se actualiza entre clics.
    if (!name.trim() || !data || duplicateName || savingPeptide) return;
    setSavingPeptide(true);
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
        // Antes esto relanzaba el error y la pantalla se quedaba muda: el modal
        // seguía abierto y el usuario creía que había guardado (bug #4).
        setSaveError(true);
        logError(err instanceof Error ? err : new Error(String(err)), "peptidos/handleAdd");
      }
    } finally {
      setSavingPeptide(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-5">
      {/* La acción principal vive ARRIBA DEL TODO, junto al título y visible
          desde cualquier pestaña — no escondida dentro de "Inventario".
          "Péptidos > Inventario > Agregar" eran 3 niveles para la acción más
          básica de la app, y nadie asocia "Inventario" con "crear". Al pulsarlo
          desde otra pestaña salta a Inventario y abre el formulario. */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        {!(data.plan === "free" && data.peptides.length >= 1) && (
          <button
            type="button"
            onClick={() => {
              setTab("inventario");
              setShowForm(true);
            }}
            className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition-transform active:scale-97 sm:px-4 sm:text-sm"
          >
            <Plus className="size-4" aria-hidden /> {t("addPeptideAria")}
          </button>
        )}
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
        {tab === "resumen" && (
          <UsosTab
            data={data}
            onChange={setData}
            range={range}
            customRange={customRange}
            onAddPeptide={() => {
              setTab("inventario");
              setShowForm(true);
            }}
          />
        )}

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
            ) : null}

            {showForm && (
              <div className="mb-4 rounded-xl border border-border bg-card p-4">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  {t("peptideNameLabel")}
                </label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSuggestionsHidden(false);
                    setSaveError(false);
                  }}
                  // Sin tope, un nombre de 229 caracteres llegaba al servidor,
                  // lo rechazaba con 400 y la pantalla no decía nada.
                  maxLength={60}
                  placeholder={t("peptideNameRequiredPlaceholder")}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />

                {/* Sugerencias mientras escribe: no hay que saber deletrear
                    "Tirzepatida" ni "Testosterona Cipionato". Al elegir una se
                    rellena también la vía de administración. Mismo criterio
                    (≥2 letras, coincidencia por substring) que el paso de
                    péptido del onboarding, que ya lo tenía y este no. */}
                {nameMatches.length > 0 && (
                  <div className="mt-2 overflow-hidden rounded-lg border border-border">
                    <p className="border-b border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                      {t("suggestionsFound", { count: nameMatches.length })}
                    </p>
                    <ul className="max-h-52 overflow-y-auto">
                      {nameMatches.map((p) => (
                        <li key={p.name}>
                          <button
                            type="button"
                            onClick={() => {
                              setName(p.name);
                              setRoute(p.route);
                              setSuggestionsHidden(true);
                            }}
                            className="flex w-full flex-col items-start gap-0.5 border-b border-border px-3 py-2 text-left last:border-b-0 hover:bg-secondary/60"
                          >
                            <span className="text-sm font-medium text-foreground">{p.name}</span>
                            <span className="line-clamp-1 text-xs text-muted-foreground">
                              {p.route} · {p.commonDose} {p.doseUnit}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <label className="mb-1.5 mt-3 block text-sm font-medium text-foreground">{t("routeLabel")}</label>
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
                {duplicateName && (
                  <p className="mb-2 text-xs text-destructive">{t("duplicatePeptide")}</p>
                )}
                {saveError && <p className="mb-2 text-xs text-destructive">{t("saveError")}</p>}
                <button
                  type="button"
                  disabled={!name.trim() || duplicateName || savingPeptide}
                  onClick={handleAdd}
                  className="h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {t("savePeptide")}
                </button>
              </div>
            )}

            {data.peptides.length === 0 ? (
              /* Segunda vía de entrada: el estado vacío es JUSTO el momento en
                 que el usuario necesita el botón, y antes solo mostraba un
                 icono y una frase, sin nada que pulsar. */
              <div className="rounded-xl bg-accent p-6 text-center">
                <Package className="mx-auto mb-2 size-8 text-primary" aria-hidden />
                <p className="text-sm font-semibold text-foreground">{t("emptyPeptidesTitle")}</p>
                <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
                  {t("emptyPeptidesBody")}
                </p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-4 inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
                >
                  <Plus className="size-4" aria-hidden /> {t("addPeptideAria")}
                </button>
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

            {/* Lista de la compra para las próximas semanas */}
            {data.peptides.length > 0 && (
              <div className="mt-4">
                <ShoppingList doses={data.doses} peptides={data.peptides} vials={data.vials} />
              </div>
            )}
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
  const [tool, setTool] = useState<"recon" | "glp" | "converter" | "compare">("recon");
  const TOOLS = [
    { key: "recon" as const, label: t("calculatorToolRecon"), icon: Calculator },
    { key: "glp" as const, label: t("calculatorToolGlp"), icon: Syringe },
    { key: "converter" as const, label: t("calculatorToolConverter"), icon: ArrowRightLeft },
    { key: "compare" as const, label: t("calculatorToolCompare"), icon: Shuffle },
  ];
  return (
    <div>
      <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {TOOLS.map((tl) => (
          <button
            key={tl.key}
            type="button"
            onClick={() => setTool(tl.key)}
            className={`flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium sm:text-sm ${
              tool === tl.key
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground"
            }`}
          >
            <tl.icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{tl.label}</span>
          </button>
        ))}
      </div>
      {tool === "recon" ? (
        <ReconstitutionCalculator data={data} />
      ) : tool === "glp" ? (
        <GlpDoseCalculator />
      ) : tool === "converter" ? (
        <UnitConverter />
      ) : (
        <Suspense fallback={null}>
          <ComparadorTool />
        </Suspense>
      )}
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
                  <div className="flex size-12 shrink-0 items-center justify-center">
                    <Image
                      src={getPeptideBottleImage(peptide?.name || "")}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 object-contain"
                    />
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

                {(() => {
                  const life = vialLifecycle(v, data.doses, new Date());
                  if (!life) return null;
                  const fmt = (ts: number) =>
                    new Date(ts).toLocaleDateString(locale, { day: "numeric", month: "short" });
                  const alert = life.verdict === "waste" || life.verdict === "expired";
                  return (
                    <div
                      className={`mt-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
                        alert
                          ? "bg-[var(--notice-bg)] text-[var(--notice-icon)]"
                          : "bg-secondary/60 text-muted-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <CalendarClock className="size-3 shrink-0" aria-hidden />
                        {life.verdict === "expired"
                          ? t("vialLifeExpired")
                          : t("vialLifeExpires", { days: Math.max(0, life.daysToExpiry), date: fmt(life.expiryAt) })}
                      </span>
                      {life.verdict === "waste" && (
                        <span className="mt-1 block">{t("vialLifeWaste")}</span>
                      )}
                      {life.verdict === "deplete" && life.depletionAt != null && (
                        <span className="mt-1 block">
                          {t("vialLifeDeplete", { date: fmt(life.depletionAt) })}
                        </span>
                      )}
                    </div>
                  );
                })()}

                {data.familyMembers.length > 0 && (
                  <VialShareControl vial={v} data={data} onChange={onChange} t={t} />
                )}

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

function VialShareControl({
  vial,
  data,
  onChange,
  t,
}: {
  vial: Vial;
  data: AppData;
  onChange: (next: AppData) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}) {
  const locale = useLocale();
  const symbol = USER_DATA_CURRENCY.symbol;
  const [adding, setAdding] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [pct, setPct] = useState(20);
  const [error, setError] = useState("");

  const cost = vial.cost ? parseFloat(vial.cost) : null;
  const alreadySharedIds = new Set(vial.shares.map((s) => s.memberId));
  const availableMembers = data.familyMembers.filter((m) => !alreadySharedIds.has(m.id));
  const sharedSoFar = vial.shares.reduce((sum, s) => sum + s.percent, 0);
  const maxPct = Math.max(1, 99 - sharedSoFar);

  async function save() {
    if (!memberId) return;
    setError("");
    try {
      const next = await addVialShare(data, vial.id, memberId, Math.min(pct, maxPct));
      onChange(next);
      setAdding(false);
      setMemberId("");
      setPct(20);
    } catch {
      setError(t("shareError"));
    }
  }

  async function remove(memberId: string) {
    setError("");
    try {
      const next = await removeVialShare(data, vial.id, memberId);
      onChange(next);
    } catch {
      setError(t("shareError"));
    }
  }

  return (
    <div className="mt-2 space-y-1.5">
      {vial.shares.length > 0 && (
        <ul className="space-y-1.5">
          {vial.shares.map((s) => {
            const member = data.familyMembers.find((m) => m.id === s.memberId);
            return (
              <li key={s.memberId} className="flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-2.5 py-1.5 text-[11px]">
                <span className="text-foreground">
                  {member?.name || "—"} {s.percent}%
                  {cost != null && (
                    <span className="text-muted-foreground"> · {symbol}{((cost * s.percent) / 100).toFixed(0)}</span>
                  )}
                </span>
                <button type="button" onClick={() => remove(s.memberId)} className="text-muted-foreground hover:text-destructive">
                  <X className="size-3.5" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {adding ? (
        <div className="rounded-lg border border-dashed border-border p-3">
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-2 text-sm text-foreground"
          >
            <option value="">{t("chooseVial") /* reutilizado como "elige a quién" */}</option>
            {availableMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          {memberId && (
            <div className="mt-2">
              <p className="mb-1 text-xs text-muted-foreground">{t("theirPercentLabel", { pct: Math.min(pct, maxPct) })}</p>
              <input
                type="range"
                min={1}
                max={maxPct}
                value={Math.min(pct, maxPct)}
                onChange={(e) => setPct(Number(e.target.value))}
                className="w-full"
              />
              {sharedSoFar > 0 && (
                <p className="mt-1 text-[11px] text-muted-foreground">{t("remainingPct", { pct: maxPct })}</p>
              )}
            </div>
          )}
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => setAdding(false)} className="h-9 flex-1 rounded-lg border border-border text-xs font-medium text-foreground">
              {t("cancel")}
            </button>
            <button type="button" disabled={!memberId} onClick={save} className="h-9 flex-1 rounded-lg bg-primary text-xs font-semibold text-primary-foreground disabled:opacity-50">
              {t("saveShare")}
            </button>
          </div>
        </div>
      ) : availableMembers.length > 0 ? (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-primary text-xs font-semibold text-primary-foreground transition-transform active:scale-97"
        >
          <Users className="size-3.5" aria-hidden /> {vial.shares.length > 0 ? t("shareVialWithAnother") : t("shareVialCta")}
        </button>
      ) : null}
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
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-transform active:scale-97"
          >
            <Plus className="size-3.5" aria-hidden /> {t("addProviderCta")}
          </button>
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
                  <p className="text-xs text-foreground">{t("confirmDeleteProvider")}</p>
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
  onAddPeptide,
}: {
  data: AppData;
  onChange: (next: AppData) => void;
  range: DateRangeKey;
  customRange: CustomRange | null;
  /** Sin péptidos no se puede registrar un uso: esto lleva a crear el primero
      en vez de dejar la pantalla en un callejón sin salida. */
  onAddPeptide: () => void;
}) {
  const t = useTranslations("Peptidos");
  const [showForm, setShowForm] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [peptideId, setPeptideId] = useState(data.peptides[0]?.id || "");
  const [whenInput, setWhenInput] = useState(() => toLocalInputValue(new Date()));
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("mg");
  const [forMemberId, setForMemberId] = useState("");
  const [confirmDeleteDoseId, setConfirmDeleteDoseId] = useState<string | null>(null);
  const [deletingDose, setDeletingDose] = useState(false);

  const sorted = [...data.doses]
    .filter((d) => isWithinRange(d.scheduledAt, range, customRange))
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());

  const activeVial = [...data.vials]
    .filter((v) => v.peptideId === peptideId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const sharedMembers = (activeVial?.shares || [])
    .map((s) => data.familyMembers.find((m) => m.id === s.memberId))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  // Una dosis negativa o cero no existe. Antes solo se comprobaba que el campo
  // no estuviera vacío, así que "-5" se podía guardar — en una app de
  // dosificación eso contamina las estadísticas y el nivel estimado en el
  // cuerpo con datos imposibles.
  const amountValue = parseFloat(amount.replace(",", "."));
  // Más allá de "positivo": el QA metió una dosis de 999.999 mg y se guardó
  // igual. Cuando la unidad es una masa (mg/mcg) se compara contra un tope
  // generoso; "ml"/"UI" no tienen conversión y se dejan pasar sin este chequeo.
  const amountMg = toMg(amountValue, unit);
  const amountIsValid =
    Number.isFinite(amountValue) &&
    amountValue > 0 &&
    (amountMg === null || numberInRange(amountMg, PLAUSIBLE.vialMassMg));

  const save = useSaveAction(async () => {
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
  }, "peptidos/UsosTab.handleSave");
  const saving = save.saving;
  const saveError = save.error;

  function handleSave() {
    if (!peptideId || !amountIsValid) return;
    save.run();
  }

  async function markDone(doseId: string) {
    onChange(await markDoseDone(data, doseId));
  }

  async function handleDeleteDose(doseId: string) {
    if (deletingDose) return;
    setDeletingDose(true);
    try {
      onChange(await removeDose(data, doseId));
      setConfirmDeleteDoseId(null);
    } catch (err) {
      logError(err instanceof Error ? err : new Error(String(err)), "peptidos/handleDeleteDose");
    } finally {
      setDeletingDose(false);
    }
  }

  return (
    <div>
      {data.doses.length > 0 && (
        <div className="mb-4">
          <WeekSchedule doses={data.doses} peptides={data.peptides} />
        </div>
      )}

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
        onSaveTitration={async (payload) => {
          const next = await addTitrationProtocol(data, payload);
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
          {sharedMembers.length > 0 && (
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
                {sharedMembers.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setForMemberId(m.id)}
                    className={`h-10 rounded-lg border text-sm font-medium ${
                      forMemberId === m.id
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-background text-foreground"
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {amount.trim() && !amountIsValid && (
            <p className="mt-2 text-xs text-destructive">{t("amountInvalid")}</p>
          )}
          {saveError && <p className="mt-2 text-xs text-destructive">{t("saveError")}</p>}
          <button
            type="button"
            disabled={!peptideId || !amountIsValid || saving}
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
          <button
            type="button"
            onClick={data.peptides.length > 0 ? () => setShowForm(true) : onAddPeptide}
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-transform active:scale-97"
          >
            <Plus className="size-3.5" aria-hidden />
            {data.peptides.length > 0 ? t("registerUse") : t("addPeptideAria")}
          </button>
        </div>
      ) : (
        <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
          {sorted.map((d) => {
            const peptide = data.peptides.find((p) => p.id === d.peptideId);
            const recipient = d.forMemberId ? data.familyMembers.find((m) => m.id === d.forMemberId) : undefined;
            return (
              <div key={d.id} className="rounded-xl border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{peptide?.name || "—"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {d.when} · {d.amount} {d.unit}
                      {recipient && ` · ${t("doseForMember", { name: recipient.name })}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {d.done ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-primary">
                        <Check className="size-3.5" aria-hidden /> {t("done")}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markDone(d.id)}
                        className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary"
                      >
                        {t("pending")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteDoseId(d.id)}
                      aria-label={t("deleteDoseAria")}
                      className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
                {confirmDeleteDoseId === d.id && (
                  <div className="mt-2 flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2">
                    <p className="text-xs text-foreground">{t("confirmDeleteDose")}</p>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteDoseId(null)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        type="button"
                        disabled={deletingDose}
                        onClick={() => handleDeleteDose(d.id)}
                        className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-50"
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
