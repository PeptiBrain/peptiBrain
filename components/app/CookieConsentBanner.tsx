"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@/i18n/navigation";
import { grantTrackingConsent, denyTrackingConsent } from "@/lib/mixpanel";

const KEY = "peptibrain_cookie_consent";

export function CookieConsentBanner() {
  const t = useTranslations("CookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem(KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    window.localStorage.setItem(KEY, "accepted");
    grantTrackingConsent();
    setVisible(false);
  }

  function reject() {
    window.localStorage.setItem(KEY, "rejected");
    denyTrackingConsent();
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          role="dialog"
          aria-label={t("message")}
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {t("message")}{" "}
              <Link href="/cookies" className="font-medium text-foreground underline underline-offset-2">
                {t("link")}
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={reject}
                className="h-10 flex-1 rounded-lg border border-border px-4 text-sm font-medium text-foreground hover:bg-secondary sm:flex-none"
              >
                {t("reject")}
              </button>
              <button
                type="button"
                onClick={accept}
                className="h-10 flex-1 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-97 sm:flex-none"
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
