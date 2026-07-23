"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Search, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getPeptideBottleImage } from "@/lib/vial-visual";
import {
  PEPTIDE_PROFILES,
  PEPTIDE_CATEGORY_IDS,
  type PeptideCategoryId,
  type HalfLifeConfidence,
} from "@/lib/peptide-profiles";

const CONFIDENCE_DOT: Record<HalfLifeConfidence, string> = {
  alto: "bg-emerald-500",
  medio: "bg-amber-500",
  bajo: "bg-muted-foreground/40",
  "sin-dato": "",
};

export function PeptideLibraryGrid() {
  const t = useTranslations("Protocolos");
  const tc = useTranslations("PeptideCategories");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PeptideCategoryId | "all">("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleExpanded(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PEPTIDE_PROFILES.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.categories.includes(activeCategory);
      const matchesQuery = !q || p.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div>
      <div className="relative mt-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <FilterPill active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
          {t("filterAll")}
        </FilterPill>
        {PEPTIDE_CATEGORY_IDS.map((cat) => (
          <FilterPill key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
            {tc(cat)}
          </FilterPill>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {t("showingCount", { count: filtered.length, total: PEPTIDE_PROFILES.length })}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center text-sm text-muted-foreground">
          {t("noResults")}
        </p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => {
            const calcHref = `/calculadora?vial=${encodeURIComponent(p.vialAmount)}&vialUnit=${encodeURIComponent(p.vialUnit)}&bac=${encodeURIComponent(p.bacWater)}&dose=${encodeURIComponent(p.commonDose)}&doseUnit=${encodeURIComponent(p.doseUnit)}`;
            return (
              <article key={p.name} className="flex flex-col rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={getPeptideBottleImage(p.name)}
                    alt=""
                    width={28}
                    height={40}
                    className="h-10 w-auto shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-bold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.route}</p>
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                  <Field label={t("fieldDose")} value={`${p.commonDose} ${p.doseUnit}`} />
                  <Field label={t("fieldFreq")} value={p.frequency} />
                  <Field label={t("fieldVial")} value={`${p.vialAmount} ${p.vialUnit}`} />
                  <Field label={t("fieldBac")} value={`${p.bacWater} mL`} />
                </dl>
                <div className="mt-2 border-t border-border/60 pt-2">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("fieldHalfLife")}
                  </dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-xs text-foreground">
                    {p.halfLifeConfidence !== "sin-dato" && (
                      <span className={`size-1.5 shrink-0 rounded-full ${CONFIDENCE_DOT[p.halfLifeConfidence]}`} aria-hidden />
                    )}
                    <span className={p.halfLifeConfidence === "sin-dato" ? "italic text-muted-foreground" : ""}>
                      {p.halfLife}
                    </span>
                  </dd>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpanded(p.name)}
                  className="mt-2 flex items-center justify-center gap-1 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  aria-expanded={expanded.has(p.name)}
                >
                  {expanded.has(p.name) ? t("collapseCta") : t("expandCta")}
                  <ChevronDown
                    className={`size-3.5 transition-transform ${expanded.has(p.name) ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>

                {expanded.has(p.name) && (
                  <div className="mt-1 space-y-2.5 border-t border-border/60 pt-2.5 text-xs">
                    <ExpandedField label={t("fieldHowItWorks")}>{p.howItWorks}</ExpandedField>
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("fieldMostReported")}
                      </dt>
                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-foreground">
                        {p.mostReported.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <ExpandedField label={t("fieldEvidenceLevel")}>{p.evidenceLevel}</ExpandedField>
                    <ExpandedField label={t("fieldSideEffects")}>{p.commonSideEffects}</ExpandedField>
                    <ExpandedField label={t("fieldCombines")}>{p.combinesWithAvoid}</ExpandedField>
                  </div>
                )}

                <Link
                  href={calcHref}
                  className="mt-3 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  {t("calcCta")} <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 shrink-0 whitespace-nowrap rounded-full border px-3.5 text-xs font-semibold transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function ExpandedField({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 leading-relaxed text-foreground">{children}</dd>
    </div>
  );
}
