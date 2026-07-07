"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Package, Info, ChevronRight } from "lucide-react";
import { PEPTIDE_PROFILES } from "@/lib/peptide-profiles";

const QUICK_CHIPS = ["BPC-157", "TB-500", "Semaglutida", "Tirzepatida", "Retatrutida", "Cagrilintide"];
const ROUTES = ["Subcutánea", "Intramuscular", "Oral", "Nasal"];

export function StepPeptide({
  initialName,
  initialRoute,
  onContinue,
}: {
  initialName: string;
  initialRoute: string;
  onContinue: (name: string, route: string) => void;
}) {
  const t = useTranslations("Onboarding");
  const [name, setName] = useState(initialName);
  const [route, setRoute] = useState(initialRoute || "Subcutánea");
  const [suggestionsHidden, setSuggestionsHidden] = useState(false);

  const matches =
    name.trim().length >= 2 && !suggestionsHidden
      ? PEPTIDE_PROFILES.filter((p) => p.name.toLowerCase().includes(name.trim().toLowerCase()))
      : [];

  function pickProfile(profileName: string, profileRoute: string) {
    setName(profileName);
    setRoute(profileRoute);
    setSuggestionsHidden(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-sm px-4 py-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
          <Package className="size-5 text-primary" aria-hidden />
        </div>
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t("step1Eyebrow")}
          </p>
          <h1 className="text-balance font-display text-2xl font-bold leading-tight text-foreground">
            {t("step1Title")}
          </h1>
        </div>
      </div>

      <p className="mb-2 text-sm text-muted-foreground">{t("step1Hint")}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {QUICK_CHIPS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => pickProfile(s, PEPTIDE_PROFILES.find((p) => p.name === s)?.route ?? route)}
            className={`h-9 rounded-full border px-3 text-sm font-medium transition-colors active:scale-97 ${
              name === s
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setSuggestionsHidden(false);
        }}
        placeholder={t("peptideNamePlaceholder")}
        className="h-14 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      {matches.length > 0 && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-accent/40 p-3">
          <div className="mb-1 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <Info className="size-4" aria-hidden />
              {t("suggestionsFound", { count: matches.length })}
            </p>
            <button
              type="button"
              onClick={() => setSuggestionsHidden(true)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {t("hideSuggestions")}
            </button>
          </div>
          <p className="mb-2 text-xs text-muted-foreground">{t("suggestionsHint")}</p>
          <ul className="space-y-2">
            {matches.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  onClick={() => pickProfile(p.name, p.route)}
                  className="flex w-full items-start justify-between gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary"
                >
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{p.name}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{p.description}</span>
                  </span>
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <label className="mt-4 mb-1.5 block text-sm font-medium text-foreground">{t("routeLabel")}</label>
      <div className="mb-6 grid grid-cols-2 gap-2">
        {ROUTES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRoute(r)}
            className={`h-12 rounded-lg border text-sm font-medium transition-colors active:scale-97 ${
              route === r
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-foreground"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!name.trim()}
        onClick={() => onContinue(name.trim(), route)}
        className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97 disabled:opacity-50"
      >
        {t("continueBtn")}
      </button>
    </motion.div>
  );
}
