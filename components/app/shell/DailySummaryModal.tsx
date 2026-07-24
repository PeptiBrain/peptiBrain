"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Flame, Gem, Check } from "lucide-react";
import { Mascot } from "@/components/app/shell/Mascot";
import type { AppData } from "@/lib/app-data";

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const STORAGE_PREFIX = "peptibrain_daily_summary_";
const EVENING_HOUR = 18; // solo aparece de esta hora en adelante, hora local del navegador

// Resumen de "antes de dormir" — no depende de notificaciones push ni de
// cron: aparece dentro de la app una vez por tarde/noche, usando datos que
// ya cargamos (no inventa nada nuevo). Se guarda en localStorage para no
// repetirse el mismo día.
export function DailySummaryModal({ data }: { data: AppData }) {
  const t = useTranslations("DailySummary");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (new Date().getHours() < EVENING_HOUR) return;
    const key = STORAGE_PREFIX + todayIso();
    if (localStorage.getItem(key)) return;
    setOpen(true);
  }, []);

  function close() {
    setOpen(false);
    localStorage.setItem(STORAGE_PREFIX + todayIso(), "1");
  }

  const today = todayIso();
  const doseDone = data.doses.some((d) => d.done && d.scheduledAt.slice(0, 10) === today);
  const log = data.healthLogs.find((h) => h.date === today);
  const items = [
    { key: "dose", done: doseDone },
    { key: "weight", done: Boolean(log?.weightKg) },
    { key: "hydration", done: Boolean(log?.hydrationMl) },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 18, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-xs flex-col items-center rounded-3xl bg-card p-6 text-center shadow-2xl"
          >
            <Mascot state="waving" size={100} />
            <p className="mt-3 font-display text-xl font-bold text-foreground">{t("title")}</p>

            <ul className="mt-4 w-full space-y-2">
              {items.map((item) => (
                <li key={item.key} className="flex items-center gap-2 text-sm">
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                      item.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Check className="size-3" aria-hidden />
                  </span>
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{t(item.key)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex w-full items-center justify-center gap-4 rounded-xl bg-accent p-3">
              <span className="flex items-center gap-1 text-sm font-semibold text-accent-foreground">
                <Flame className="size-4" aria-hidden /> {data.progress.currentStreak}
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-accent-foreground">
                <Gem className="size-4" aria-hidden /> {data.progress.pbTotal}
              </span>
            </div>

            <button
              type="button"
              onClick={close}
              className="mt-5 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              {t("cta")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
