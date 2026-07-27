"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList } from "lucide-react";
import { ModalShell } from "@/components/app/shell/ModalShell";
import { track } from "@/lib/mixpanel";

const SUPPORT_EMAIL = "hello@peptibrain.com";

export const CANCEL_REASONS = [
  "no_esperaba",
  "plan_gratis_basta",
  "no_entendi",
  "miedo_cobro",
  "muy_caro",
  "no_tiempo",
  "otro",
] as const;

export type CancelReason = (typeof CANCEL_REASONS)[number];

// Encuesta de un clic antes de "cancelar de verdad": una cancelación sin
// motivo es una oportunidad perdida de aprendizaje. Ramifica solo en lo que
// la app puede cumplir de verdad (Hotmart no expone pausar/descontar por
// API) — "muy caro" recuerda la oferta ya existente, "no entendí" ofrece
// soporte; el resto solo registra el motivo y sigue.
export function CancelSurveyModal({
  open,
  onClose,
  onReviewOffer,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  /** Reabre el CancelOfferModal (motivo "muy_caro"). */
  onReviewOffer: () => void;
  /** Motivo registrado, sigue a las instrucciones de cancelar. */
  onContinue: () => void;
}) {
  const t = useTranslations("Cuenta");
  const [reason, setReason] = useState<CancelReason | null>(null);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(reason: CancelReason) {
    setSending(true);
    track("cancel_survey_answered", { reason });
    fetch("/api/account/cancel-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, note: reason === "otro" ? note.trim() : undefined }),
    }).catch(() => {});
    setSending(false);
    if (reason === "muy_caro") {
      onReviewOffer();
    } else {
      onContinue();
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={t("cancelSurveyTitle")}
      icon={<ClipboardList className="size-5 text-primary" aria-hidden />}
    >
      <p className="text-sm text-muted-foreground">{t("cancelSurveyBody")}</p>
      <div className="mt-4 space-y-2">
        {CANCEL_REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            className={`flex w-full items-center rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
              reason === r
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-background text-foreground hover:bg-secondary/60"
            }`}
          >
            {t(`cancelReason_${r}`)}
          </button>
        ))}
      </div>
      {reason === "otro" && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder={t("cancelSurveyNotePlaceholder")}
          className="mt-3 w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}
      {reason === "no_entendi" && (
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-3 block rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-semibold text-accent-foreground"
        >
          {t("cancelSurveyContactSupport")}
        </a>
      )}
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-11 flex-1 rounded-lg border border-border text-sm font-medium text-foreground"
        >
          {t("deleteAccountCancel")}
        </button>
        <button
          type="button"
          disabled={!reason || sending}
          onClick={() => reason && submit(reason)}
          className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {t("cancelSurveyContinue")}
        </button>
      </div>
    </ModalShell>
  );
}
