"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Smile, X } from "lucide-react";

// Escala roja→verde: excepción deliberada a "tokens CSS para todo color" (como
// PLATFORM_COLOR en el panel de admin) — el significado de la escala ES el
// color, no hay token semántico de "muy feliz" en el sistema de diseño.
const SCALE = [
  { emoji: "😞", color: "#EF4444" },
  { emoji: "🙁", color: "#F97316" },
  { emoji: "😐", color: "#9CA3AF" },
  { emoji: "🙂", color: "#84CC16" },
  { emoji: "😄", color: "#22C55E" },
] as const;

// Espera unos segundos tras cargar Inicio antes de aparecer — que no compita
// con lo primero que el usuario ve al entrar.
const SHOW_DELAY_MS = 4000;

// Solo aparece en Inicio (nunca en un formulario, el onboarding o el pago,
// que ya viven fuera de este layout) — cumple "no interrumpir acciones
// importantes" sin tener que rastrear si hay otro modal abierto en pantalla.
export function SatisfactionSurveyModal({ eligible }: { eligible: boolean }) {
  const t = useTranslations("SatisfactionSurvey");
  const pathname = usePathname();
  const isHome = pathname === "/app";

  const [visible, setVisible] = useState(false);
  const [level, setLevel] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [thanked, setThanked] = useState(false);

  useEffect(() => {
    if (!eligible || !isHome) return;
    const timer = setTimeout(() => {
      setVisible(true);
      fetch("/api/account/satisfaction-survey/shown", { method: "POST" }).catch(() => {});
    }, SHOW_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible, isHome]);

  async function selectLevel(n: number) {
    if (saving || level != null) return;
    setLevel(n);
    setSaving(true);
    try {
      await fetch("/api/account/satisfaction-survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: n }),
      });
    } catch {
      // Encuesta opcional, no una acción crítica: si falla el guardado no hay
      // reintento ni bloqueo — simplemente esta respuesta no se cuenta.
    } finally {
      setSaving(false);
      setThanked(true);
      setTimeout(() => setVisible(false), 1800);
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] flex items-end justify-center bg-black/30 p-4 sm:items-center"
          onClick={() => setVisible(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xs rounded-3xl bg-card p-6 text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label={t("close")}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
            >
              <X className="size-4" aria-hidden />
            </button>

            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/15">
              <Smile className="size-6 text-primary" aria-hidden />
            </div>

            {!thanked ? (
              <>
                <h2 className="mt-3 text-balance font-display text-lg font-bold text-foreground">
                  {t("title")}
                </h2>
                <div className="mt-5 grid grid-cols-5 gap-2">
                  {SCALE.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled={saving}
                      onClick={() => selectLevel(i + 1)}
                      aria-label={t(`level_${i + 1}` as never)}
                      className="flex aspect-square items-center justify-center rounded-2xl text-2xl transition-transform active:scale-90 disabled:opacity-60 sm:text-3xl"
                      style={{ background: `${s.color}26` }}
                    >
                      {s.emoji}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-balance font-display text-lg font-bold text-foreground">
                  {t("thanksTitle")}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t("thanksBody")}</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
