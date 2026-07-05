"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Package } from "lucide-react";

const SUGGESTIONS = ["Semaglutida", "BPC-157", "TB-500", "Tirzepatida", "Ipamorelina"];
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
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setName(s)}
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
        onChange={(e) => setName(e.target.value)}
        placeholder={t("peptideNamePlaceholder")}
        className="mb-4 h-14 w-full rounded-lg border border-input bg-background px-4 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />

      <label className="mb-1.5 block text-sm font-medium text-foreground">{t("routeLabel")}</label>
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
