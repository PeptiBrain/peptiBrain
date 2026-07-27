"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { LifeBuoy, Search, ChevronDown, X } from "lucide-react";
import { Link } from "@/i18n/navigation";

const SUPPORT_EMAIL = "hello@peptibrain.com";

// Cada artículo: categoría + claves de pregunta/respuesta en el namespace "Help".
const ARTICLES: { cat: string; q: string; a: string }[] = [
  { cat: "catStart", q: "start1Q", a: "start1A" },
  { cat: "catStart", q: "start2Q", a: "start2A" },
  { cat: "catVials", q: "vials1Q", a: "vials1A" },
  { cat: "catTools", q: "tools1Q", a: "tools1A" },
  { cat: "catStats", q: "stats1Q", a: "stats1A" },
  { cat: "catFamily", q: "family1Q", a: "family1A" },
  { cat: "catPlan", q: "plan1Q", a: "plan1A" },
  { cat: "catPlan", q: "plan2Q", a: "plan2A" },
  { cat: "catPrivacy", q: "privacy1Q", a: "privacy1A" },
  { cat: "catPrivacy", q: "privacy2Q", a: "privacy2A" },
  { cat: "catAccount", q: "account1Q", a: "account1A" },
  { cat: "catInstall", q: "install1Q", a: "install1A" },
  { cat: "catContact", q: "contact1Q", a: "contact1A" },
];

export function HelpCenter({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("Help");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const items = useMemo(() => {
    const list = ARTICLES.map((a) => ({
      ...a,
      question: t(a.q),
      answer: t(a.a),
      category: t(a.cat),
    }));
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (i) =>
        i.question.toLowerCase().includes(q) ||
        i.answer.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }, [query, t]);

  // Escape cierra: antes NO cerraba de ninguna forma (ni X, ni clic fuera, ni
  // Escape) y el usuario quedaba atrapado hasta recargar la página.
  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // El modal se monta en <body>, NO donde vive el componente. Este panel se
  // renderizaba dentro del <header sticky backdrop-blur>, y `backdrop-filter`
  // crea un containing block para `position:fixed`: por eso `inset-0` medía los
  // 57px del header en vez del viewport, el panel quedaba en top:-264px (X y
  // título fuera de pantalla) y el fondo solo tapaba la franja del header, así
  // que los clics lo atravesaban y activaban lo de debajo.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-card shadow-xl sm:rounded-2xl"
          >
            {/* Cabecera fija */}
            <div className="shrink-0 border-b border-border p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <LifeBuoy className="size-5 text-primary" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-bold text-foreground">{t("title")}</h2>
                  <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t("close")}
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-input bg-background px-3">
                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="h-11 w-full bg-transparent text-sm text-foreground outline-none"
                />
              </div>
            </div>

            {/* Lista con scroll */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">{t("noResults")}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="h-10 rounded-full border border-border px-4 text-xs font-semibold text-foreground"
                    >
                      {t("clearSearch")}
                    </button>
                    <a
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="flex h-10 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground"
                    >
                      {t("contactSupportCta")}
                    </a>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {items.map((i) => {
                    const isOpen = openId === i.q;
                    return (
                      <li key={i.q} className="rounded-xl border border-border">
                        <button
                          type="button"
                          onClick={() => setOpenId(isOpen ? null : i.q)}
                          className="flex w-full items-start justify-between gap-3 p-3.5 text-left"
                        >
                          <span className="min-w-0">
                            <span className="block text-[11px] font-semibold tracking-wide text-primary uppercase">
                              {i.category}
                            </span>
                            <span className="mt-0.5 block text-sm font-medium text-foreground">
                              {i.question}
                            </span>
                          </span>
                          <ChevronDown
                            className={`mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <p className="px-3.5 pb-3.5 text-sm leading-relaxed text-muted-foreground">
                                {i.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Pie fijo */}
            <div className="shrink-0 border-t border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  {t("stillStuck")}{" "}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-primary hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <Link href="/terminos" className="hover:text-foreground hover:underline">
                    {t("terms")}
                  </Link>
                  <Link href="/privacidad" className="hover:text-foreground hover:underline">
                    {t("privacy")}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
