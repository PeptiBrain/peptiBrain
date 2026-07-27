"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { track } from "@/lib/mixpanel";

const SEEN_KEY = "peptibrain_tour_seen";
export const RESTART_EVENT = "peptibrain:tour:restart";

// El tour anterior eran 9 pantallas de texto que decían "vamos a verlas una por
// una" y no señalaban nada (bug #29 del QA). Ahora cada paso ILUMINA el
// elemento real del que habla, usando el atributo data-tour que llevan los
// enlaces de la navegación.
//
// Reglas de overlay que este componente cumple (convenciones del proyecto):
//   · createPortal a document.body — el header tiene backdrop-blur, y un
//     `fixed` dentro de él se posiciona respecto al header, no al viewport.
//     Ese fue exactamente el bug #50 (el Centro de ayuda quedaba fuera de
//     pantalla y no se podía cerrar).
//   · Cierra con Escape, con la X visible y haciendo clic fuera. Los tres.
const STEPS = [
  { key: "home", anchor: '[data-tour="/app"]' },
  { key: "peptides", anchor: '[data-tour="/app/peptidos"]' },
  { key: "health", anchor: '[data-tour="/app/salud"]' },
  { key: "stats", anchor: '[data-tour="/app/estadisticas"]' },
  { key: "family", anchor: '[data-tour="/app/familia"]' },
] as const;

type Rect = { top: number; left: number; width: number; height: number };

export function AppTour() {
  const t = useTranslations("Tour");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(SEEN_KEY)) {
      setOpen(true);
      track("app_tour_started");
    }
    function handleRestart() {
      setStep(0);
      setOpen(true);
      track("app_tour_started", { restarted: true });
    }
    window.addEventListener(RESTART_EVENT, handleRestart);
    return () => window.removeEventListener(RESTART_EVENT, handleRestart);
  }, []);

  const finish = useCallback(() => {
    window.localStorage.setItem(SEEN_KEY, "1");
    track("app_tour_completed", { last_step: step + 1 });
    setOpen(false);
  }, [step]);

  // Escape cierra: es lo primero que intenta quien se siente atrapado.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") finish();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, finish]);

  // useLayoutEffect y no useEffect: medir después de pintar provocaría un
  // parpadeo del foco en la posición anterior.
  useLayoutEffect(() => {
    if (!open) return;
    function measure() {
      const el = document.querySelector(STEPS[step]?.anchor || "");
      if (!el) {
        // Si el elemento no está en esta pantalla, el paso se muestra centrado
        // en vez de señalar un hueco vacío.
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, step]);

  if (!mounted || !open) return null;

  const isLast = step === STEPS.length - 1;
  const stepKey = STEPS[step].key;
  const PAD = 6;

  // El globo va debajo del elemento si hay sitio, y encima si no. Sin esto,
  // en móvil el texto puede quedar fuera de pantalla.
  const balloonBelow = rect ? rect.top + rect.height + 180 < window.innerHeight : true;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60]"
        // Clic fuera del globo cierra. El propio globo detiene la propagación.
        onClick={finish}
        role="dialog"
        aria-modal="true"
        aria-label={t("navLabelA11y")}
      >
        {/* El "foco": un recuadro transparente con una sombra enorme alrededor.
            Así se oscurece todo MENOS el elemento señalado, sin recortar nada. */}
        {rect ? (
          <motion.div
            initial={false}
            animate={{
              top: rect.top - PAD,
              left: rect.left - PAD,
              width: rect.width + PAD * 2,
              height: rect.height + PAD * 2,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute rounded-xl ring-2 ring-primary"
            style={{ boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)" }}
          />
        ) : (
          <div className="absolute inset-0 bg-black/60" />
        )}

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute left-1/2 w-[min(20rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl bg-card p-5 shadow-xl"
          style={
            rect
              ? balloonBelow
                ? { top: rect.top + rect.height + 16 }
                : { top: Math.max(16, rect.top - 190) }
              : { top: "50%", transform: "translate(-50%, -50%)" }
          }
        >
          <button
            type="button"
            onClick={finish}
            aria-label={t("skip")}
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <X className="size-4" aria-hidden />
          </button>

          <h2 className="pr-8 text-balance font-display text-lg font-bold text-foreground">
            {t(`${stepKey}Title` as never)}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{t(`${stepKey}Body` as never)}</p>

          <div className="mt-4 flex items-center justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-secondary"
                }`}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            {/* Faltaba poder volver atrás (bug #29). */}
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-secondary"
              >
                <ArrowLeft className="size-4" aria-hidden /> {t("back")}
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                className="text-sm text-muted-foreground underline-offset-2 hover:underline"
              >
                {t("skip")}
              </button>
            )}
            <button
              type="button"
              onClick={() => (isLast ? finish() : setStep(step + 1))}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              {isLast ? t("start") : t("next")}
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
