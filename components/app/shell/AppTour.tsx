"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Beaker, HeartPulse, Users, ArrowRight } from "lucide-react";
import { track } from "@/lib/mixpanel";

const SEEN_KEY = "peptibrain_tour_seen";
const ICONS = [Flame, Beaker, HeartPulse, Users];

export function AppTour() {
  const t = useTranslations("Tour");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(SEEN_KEY)) {
      setOpen(true);
      track("app_tour_started");
    }
  }, []);

  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
    { title: t("step4Title"), body: t("step4Body") },
  ];

  function finish() {
    window.localStorage.setItem(SEEN_KEY, "1");
    track("app_tour_completed", { last_step: step + 1 });
    setOpen(false);
  }

  const Icon = ICONS[step];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/15">
                  <Icon className="size-5.5 text-primary" aria-hidden />
                </div>
                <h2 className="mt-3 text-balance font-display text-xl font-bold text-foreground">
                  {steps[step].title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{steps[step].body}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-center gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? "w-6 bg-primary" : "w-1.5 bg-secondary"
                  }`}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={finish}
                className="text-sm text-muted-foreground underline-offset-2 hover:underline"
              >
                {t("skip")}
              </button>
              <button
                type="button"
                onClick={() => (step < steps.length - 1 ? setStep(step + 1) : finish())}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
              >
                {step < steps.length - 1 ? t("next") : t("start")}
                <ArrowRight className="size-4" aria-hidden />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
