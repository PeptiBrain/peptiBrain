"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Shuffle } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PEPTIDE_PROFILES, PEPTIDE_CATEGORY_IDS, type PeptideProfile } from "@/lib/peptide-profiles";
import { getPeptideBottleImage } from "@/lib/vial-visual";

// Comparaciones populares para precargar la herramienta — elegidas por ser las
// combinaciones más buscadas dentro de cada categoría de nuestro propio catálogo.
const POPULAR_PAIRS: [string, string][] = [
  ["Semaglutida", "Tirzepatida"],
  ["BPC-157", "TB-500"],
  ["Ipamorelina", "CJC-1295"],
];

function findProfile(name: string | null): PeptideProfile | undefined {
  if (!name) return undefined;
  return PEPTIDE_PROFILES.find((p) => p.name === name);
}

export function ComparadorTool() {
  const t = useTranslations("Comparador");
  const tc = useTranslations("PeptideCategories");
  const searchParams = useSearchParams();

  const [nameA, setNameA] = useState(searchParams.get("a") ?? "");
  const [nameB, setNameB] = useState(searchParams.get("b") ?? "");

  const profileA = useMemo(() => findProfile(nameA), [nameA]);
  const profileB = useMemo(() => findProfile(nameB), [nameB]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <PeptideSelect label={t("labelA")} placeholder={t("placeholder")} value={nameA} onChange={setNameA} />
        <PeptideSelect label={t("labelB")} placeholder={t("placeholder")} value={nameB} onChange={setNameB} />
      </div>

      {profileA && profileB ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border">
          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <ComparisonColumn profile={profileA} t={t} tc={tc} />
            <ComparisonColumn profile={profileB} t={t} tc={tc} />
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
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {POPULAR_PAIRS.map(([a, b]) => (
            <button
              key={`${a}-${b}`}
              type="button"
              onClick={() => {
                setNameA(a);
                setNameB(b);
              }}
              className="flex items-center gap-2 rounded-xl border border-border bg-card p-4 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Shuffle className="size-4 shrink-0 text-primary" aria-hidden />
              {a} vs {b}
            </button>
          ))}
        </div>
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
          const items = PEPTIDE_PROFILES.filter((p) => p.categories[0] === cat);
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

function ComparisonColumn({
  profile,
  t,
  tc,
}: {
  profile: PeptideProfile;
  t: ReturnType<typeof useTranslations<"Comparador">>;
  tc: ReturnType<typeof useTranslations<"PeptideCategories">>;
}) {
  const calcHref = `/calculadora?vial=${encodeURIComponent(profile.vialAmount)}&vialUnit=${encodeURIComponent(profile.vialUnit)}&bac=${encodeURIComponent(profile.bacWater)}&dose=${encodeURIComponent(profile.commonDose)}&doseUnit=${encodeURIComponent(profile.doseUnit)}`;

  return (
    <div className="flex flex-col p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <Image src={getPeptideBottleImage(profile.name)} alt="" width={28} height={40} className="h-10 w-auto shrink-0" />
        <h3 className="truncate font-display text-base font-bold text-foreground">{profile.name}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{profile.description}</p>
      <dl className="mt-4 space-y-2.5 text-sm">
        <Field label={t("fieldRoute")} value={profile.route} />
        <Field label={t("fieldDose")} value={`${profile.commonDose} ${profile.doseUnit}`} />
        <Field label={t("fieldFreq")} value={profile.frequency} />
        <Field label={t("fieldVial")} value={`${profile.vialAmount} ${profile.vialUnit}`} />
        <Field label={t("fieldBac")} value={`${profile.bacWater} mL`} />
        <Field label={t("fieldCategories")} value={profile.categories.map((c) => tc(c)).join(", ")} />
      </dl>

      <div className="mt-4 space-y-2.5 border-t border-border/60 pt-4 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("fieldHowItWorks")}</dt>
          <dd className="mt-0.5 leading-relaxed text-foreground">{profile.howItWorks}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("fieldMostReported")}</dt>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-foreground">
            {profile.mostReported.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("fieldEvidenceLevel")}</dt>
          <dd className="mt-0.5 leading-relaxed text-foreground">{profile.evidenceLevel}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("fieldSideEffects")}</dt>
          <dd className="mt-0.5 leading-relaxed text-foreground">{profile.commonSideEffects}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("fieldCombines")}</dt>
          <dd className="mt-0.5 leading-relaxed text-foreground">{profile.combinesWithAvoid}</dd>
        </div>
      </div>

      <Link
        href={calcHref}
        className="mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
      >
        {t("calcCta")} <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-2">
      <dt className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="truncate text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
