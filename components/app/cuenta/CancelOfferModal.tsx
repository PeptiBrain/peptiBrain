"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Gift, X } from "lucide-react";
import { track } from "@/lib/mixpanel";

export function CancelOfferModal({
  open,
  onClose,
  onAcceptOffer,
  onConfirmCancel,
}: {
  open: boolean;
  onClose: () => void;
  onAcceptOffer: () => void;
  onConfirmCancel: () => void;
}) {
  const t = useTranslations("Cuenta");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
                <Gift className="size-5 text-primary" aria-hidden />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
            <h2 className="mt-3 text-balance font-display text-xl font-bold text-foreground">
              {t("offerTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("offerBody")}</p>

            <button
              type="button"
              onClick={() => {
                track("retention_offer_accepted");
                onAcceptOffer();
              }}
              className="mt-5 h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              {t("offerAccept")}
            </button>
            <button
              type="button"
              onClick={() => {
                track("retention_offer_declined");
                onConfirmCancel();
              }}
              className="mt-3 block w-full text-center text-sm text-muted-foreground underline-offset-2 hover:underline"
            >
              {t("offerDecline")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
