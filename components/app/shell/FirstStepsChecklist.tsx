"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, ChevronUp, X, Rocket } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { computeFirstSteps, type FirstStepKey } from "@/lib/first-steps";
import type { AppData } from "@/lib/app-data";
import { celebrate } from "@/lib/celebrate";

const DISMISSED_KEY = "peptibrain_first_steps_dismissed";
const COLLAPSED_KEY = "peptibrain_first_steps_collapsed";

const STEP_HREF: Record<FirstStepKey, string> = {
  peptide: "/app/peptidos",
  vial: "/app/peptidos",
  dose: "/app/peptidos",
  doneDose: "/app",
  health: "/app/salud",
};

// Checklist persistente de primeros pasos: 5 acciones clave derivadas de datos reales
// (no de flags manuales). Se puede minimizar o cerrar sin perder el progreso — el
// cierre es del widget, no de las acciones ya hechas, que siguen contando siempre.
export function FirstStepsChecklist({ data }: { data: AppData }) {
  const t = useTranslations("FirstSteps");
  // Este widget solo se monta en cliente (tras cargar AppData), así que leer
  // localStorage en el inicializador es seguro y evita el parpadeo inicial.
  const [dismissed, setDismissed] = useState(() => window.localStorage.getItem(DISMISSED_KEY) === "1");
  const [collapsed, setCollapsed] = useState(() => window.localStorage.getItem(COLLAPSED_KEY) === "1");
  const celebratedRef = useRef(false);

  const steps = computeFirstSteps(data);
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;

  useEffect(() => {
    if (allDone && !celebratedRef.current) {
      celebratedRef.current = true;
      celebrate();
    }
  }, [allDone]);

  function close() {
    window.localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  function toggleCollapsed() {
    const next = !collapsed;
    window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
    setCollapsed(next);
  }

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 overflow-hidden rounded-2xl border border-primary/25 bg-primary/5"
    >
      <div className="flex items-center gap-3 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Rocket className="size-4.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {allDone ? t("doneTitle") : t("title")}
          </p>
          <p className="text-xs text-muted-foreground">{t("progress", { done: doneCount, total: steps.length })}</p>
        </div>
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? t("expandAria") : t("collapseAria")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
        >
          {collapsed ? <ChevronDown className="size-4" aria-hidden /> : <ChevronUp className="size-4" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={close}
          aria-label={t("closeAria")}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>

      <div className="px-4 pb-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${(doneCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {steps.map((s) => (
              <li key={s.key} className="border-t border-primary/10 first:border-t-0">
                {s.done ? (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
                      {t(`step_${s.key}`)}
                    </span>
                  </div>
                ) : (
                  <Link
                    href={STEP_HREF[s.key]}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/10"
                  >
                    <span className="size-6 shrink-0 rounded-full border-2 border-border" aria-hidden />
                    <span className="text-sm font-medium text-foreground">{t(`step_${s.key}`)}</span>
                  </Link>
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
