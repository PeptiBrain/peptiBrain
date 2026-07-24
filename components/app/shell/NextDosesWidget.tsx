"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Syringe, Check, X, ChevronRight, AlertTriangle } from "lucide-react";
import { loadAppData, markDoseDone, type AppData, type Dose } from "@/lib/app-data";
import { celebrateDoseLogged } from "@/lib/celebrate";
import { checkStreakMilestone } from "@/lib/milestones";
import { PeptideIcon } from "@/components/app/peptidos/PeptideIcon";
import { InjectionSiteModal } from "@/components/app/shell/InjectionSiteModal";
import { suggestNextInjectionSite, lastInjectionSite, type InjectionSiteId } from "@/lib/injection-sites";

export function NextDosesWidget() {
  const t = useTranslations("NextDoses");
  const locale = useLocale();
  const [data, setData] = useState<AppData | null>(null);
  const [open, setOpen] = useState(false);
  const [siteDose, setSiteDose] = useState<Dose | null>(null);

  useEffect(() => {
    loadAppData().then(setData);
  }, []);

  if (!data) return null;

  const pending = data.doses
    .filter((d) => !d.done)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  if (pending.length === 0) return null;

  const now = Date.now();
  const overdueCount = pending.filter((d) => new Date(d.scheduledAt).getTime() < now).length;

  function peptideName(id: string) {
    return data!.peptides.find((p) => p.id === id)?.name || t("peptideFallback");
  }

  function whenLabel(d: Dose) {
    const time = new Date(d.scheduledAt);
    const diffDays = Math.floor((now - time.getTime()) / 86400000);
    const dateStr = time.toLocaleDateString(locale, { day: "numeric", month: "short" });
    const timeStr = time.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
    if (time.getTime() < now) {
      return { overdue: true, text: `${t("overdueBy", { days: diffDays })} · ${dateStr} · ${timeStr}` };
    }
    return { overdue: false, text: `${dateStr} · ${timeStr}` };
  }

  async function markDone(doseId: string, injectionSite?: string) {
    const prev = data!;
    const next = await markDoseDone(data!, doseId, injectionSite);
    setData(next);
    celebrateDoseLogged(next);
    checkStreakMilestone(prev, next);
    setSiteDose(null);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 z-40 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">{t("title")}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("close")}
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <ul className="max-h-[50vh] divide-y divide-border overflow-y-auto">
              {pending.slice(0, 8).map((d) => {
                const when = whenLabel(d);
                return (
                  <li key={d.id} className="flex items-center gap-3 px-4 py-3">
                    <PeptideIcon peptideName={peptideName(d.peptideId)} size="size-8" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {peptideName(d.peptideId)} · {d.amount} {d.unit}
                      </p>
                      <p
                        className={`flex items-center gap-1 truncate text-xs ${
                          when.overdue ? "text-destructive" : "text-muted-foreground"
                        }`}
                      >
                        {when.overdue && <AlertTriangle className="size-3 shrink-0" aria-hidden />}
                        {when.text}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSiteDose(d)}
                      aria-label={t("markDone")}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Check className="size-4" aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/app/peptidos"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1 border-t border-border py-3 text-sm font-semibold text-primary hover:bg-secondary/50"
            >
              {t("viewAll")} <ChevronRight className="size-4" aria-hidden />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("title")}
        className="fixed bottom-6 right-4 z-40 flex size-14 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-95"
        style={{ background: overdueCount > 0 ? "#ef4444" : "var(--primary)" }}
      >
        <Syringe className="size-6" aria-hidden />
        <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-white text-xs font-bold text-destructive ring-2 ring-card">
          {pending.length}
        </span>
      </button>

      {siteDose && (
        <InjectionSiteModal
          open={Boolean(siteDose)}
          onClose={() => setSiteDose(null)}
          onConfirm={(site: InjectionSiteId) => markDone(siteDose.id, site)}
          onSkip={() => markDone(siteDose.id, undefined)}
          suggested={suggestNextInjectionSite(data.doses, siteDose.peptideId)}
          lastUsed={lastInjectionSite(data.doses, siteDose.peptideId)}
        />
      )}
    </>
  );
}
