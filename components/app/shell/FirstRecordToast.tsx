"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { PartyPopper } from "lucide-react";
import { FIRST_RECORD_CELEBRATION_EVENT, consumePendingFirstRecord } from "@/lib/celebrate";

// Aviso corto y positivo para el primer registro de la persona (péptido, vial,
// dosis, salud, comida...), en cualquiera de sus dos orígenes: en vivo (evento
// disparado por useAppData al detectar la transición de 0 a 1 registros) o
// pendiente desde el onboarding (ver markFirstRecordPending). Se cierra solo,
// sin bloquear la app — arriba, no abajo, para no solaparse con el toast de
// "dosis registrada" que vive en la parte inferior de la pantalla.
export function FirstRecordToast() {
  const t = useTranslations("FirstRecordToast");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function show() {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return timer;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (consumePendingFirstRecord()) timer = show();

    function onCelebrate() {
      if (timer) clearTimeout(timer);
      timer = show();
    }
    window.addEventListener(FIRST_RECORD_CELEBRATION_EVENT, onCelebrate);
    return () => {
      window.removeEventListener(FIRST_RECORD_CELEBRATION_EVENT, onCelebrate);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 top-[72px] z-50 mx-auto flex w-[min(22rem,calc(100vw-2rem))] items-center gap-3 rounded-2xl border border-primary/20 bg-card p-4 shadow-xl"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <PartyPopper className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{t("title")}</p>
            <p className="truncate text-xs text-muted-foreground">{t("body")}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
