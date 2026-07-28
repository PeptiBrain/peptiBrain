"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, Shuffle } from "lucide-react";
import Image from "next/image";
import { PEPTIDE_CATEGORY_IDS, PEPTIDE_PROFILES } from "@/lib/peptide-profiles";
import { COMPAT_PEPTIDES, POPULAR_COMPAT_PAIRS, getCompatibility, type CompatStatus } from "@/lib/stack-compatibility";
import { getPeptideBottleImage } from "@/lib/vial-visual";

// Un solo veredicto por color+ícono, no una matriz de 500 celdas: la pregunta
// real del usuario es "¿puedo combinar A con B?", no "muéstrame todo".
const STATUS_STYLE: Record<
  CompatStatus,
  { icon: typeof CheckCircle2; color: string; bg: string; border: string }
> = {
  studied: { icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-300/60 dark:border-emerald-500/30" },
  caution: { icon: AlertTriangle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-300/60 dark:border-amber-500/30" },
  avoid: { icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-300/60 dark:border-red-500/30" },
  unknown: { icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted/40", border: "border-border" },
};

export function CompatibilidadTool() {
  const t = useTranslations("Compatibilidad");
  const searchParams = useSearchParams();

  const [nameA, setNameA] = useState(searchParams.get("a") ?? "");
  const [nameB, setNameB] = useState(searchParams.get("b") ?? "");

  const result = useMemo(() => {
    if (!nameA || !nameB) return null;
    return getCompatibility(nameA, nameB);
  }, [nameA, nameB]);

  const style = result ? STATUS_STYLE[result.status] : null;
  const Icon = style?.icon;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <PeptideSelect label={t("labelA")} placeholder={t("placeholder")} value={nameA} onChange={setNameA} />
        <PeptideSelect label={t("labelB")} placeholder={t("placeholder")} value={nameB} onChange={setNameB} />
      </div>

      {result && style && Icon ? (
        <div
          className={`mt-6 overflow-hidden rounded-2xl border ${style.border} ${style.bg} p-5 transition-colors sm:p-6`}
        >
          <div className="flex items-center justify-center gap-3">
            <Image src={getPeptideBottleImage(nameA)} alt="" width={26} height={38} className="h-9 w-auto shrink-0" />
            <span className="font-display text-sm font-bold text-foreground sm:text-base">{nameA}</span>
            <span className="shrink-0 text-muted-foreground">+</span>
            <span className="font-display text-sm font-bold text-foreground sm:text-base">{nameB}</span>
            <Image src={getPeptideBottleImage(nameB)} alt="" width={26} height={38} className="h-9 w-auto shrink-0" />
          </div>

          <div className="mt-4 flex items-start gap-3 border-t border-border/40 pt-4">
            <Icon className={`mt-0.5 size-6 shrink-0 ${style.color}`} aria-hidden />
            <div className="min-w-0">
              <p className={`font-display text-base font-bold sm:text-lg ${style.color}`}>{t(`status_${result.status}`)}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                {result.note || t("unknownNote")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-center text-sm text-muted-foreground">
          {t("emptyState")}
        </p>
      )}

      <div className="mt-10">
        <h2 className="font-display text-lg font-bold text-foreground">{t("popularTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("popularSubtitle")}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {POPULAR_COMPAT_PAIRS.map(([a, b]) => {
            const pairResult = getCompatibility(a, b);
            const pairStyle = STATUS_STYLE[pairResult.status];
            const PairIcon = pairStyle.icon;
            return (
              <button
                key={`${a}-${b}`}
                type="button"
                onClick={() => {
                  setNameA(a);
                  setNameB(b);
                }}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-card p-4 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <PairIcon className={`size-4 shrink-0 ${pairStyle.color}`} aria-hidden />
                <span className="min-w-0 flex-1 truncate">
                  {a} + {b}
                </span>
                <Shuffle className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
              </button>
            );
          })}
        </div>
      </div>

      {/* Leyenda: mismo lenguaje de color que el resultado, para que el
          usuario aprenda a leerlo de un vistazo sin abrir cada tarjeta. */}
      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
        {(Object.keys(STATUS_STYLE) as CompatStatus[]).map((s) => {
          const LegendIcon = STATUS_STYLE[s].icon;
          return (
            <span key={s} className="flex items-center gap-1.5">
              <LegendIcon className={`size-3.5 ${STATUS_STYLE[s].color}`} aria-hidden />
              {t(`status_${s}`)}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function PeptideSelect({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const tc = useTranslations("PeptideCategories");
  const options = PEPTIDE_PROFILES.filter((p) => (COMPAT_PEPTIDES as readonly string[]).includes(p.name));

  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-12 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground"
      >
        <option value="">{placeholder}</option>
        {PEPTIDE_CATEGORY_IDS.map((cat) => {
          const items = options.filter((p) => p.categories[0] === cat);
          if (items.length === 0) return null;
          return (
            <optgroup key={cat} label={tc(cat)}>
              {items.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </label>
  );
}
