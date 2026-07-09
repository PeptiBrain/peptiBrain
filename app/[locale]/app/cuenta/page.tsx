"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { CreditCard, User, Globe, Smartphone, Sparkles, Compass, Mail, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CancelOfferModal } from "@/components/app/cuenta/CancelOfferModal";
import { LocaleSwitcher } from "@/components/app/LocaleSwitcher";
import { ModalShell } from "@/components/app/shell/ModalShell";
import { RESTART_EVENT } from "@/components/app/shell/AppTour";
import { track } from "@/lib/mixpanel";

type Profile = {
  name: string;
  email: string;
  plan: "free" | "premium" | "family";
  plan_status: string;
};

export default function CuentaPage() {
  const t = useTranslations("Cuenta");
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showOffer, setShowOffer] = useState(false);
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [showCancelInstructions, setShowCancelInstructions] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("name, email, plan, plan_status")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data as Profile);
    });
  }, []);

  if (!profile) return null;

  const planLabel = { free: t("planFree"), premium: t("planPremium"), family: t("planFamily") }[
    profile.plan
  ];
  const statusLabel =
    {
      active: t("statusActive"),
      canceled: t("statusCanceled"),
      past_due: t("statusPastDue"),
      refunded: t("statusCanceled"),
    }[profile.plan_status] || profile.plan_status;

  function handleCancelClick() {
    track("cancel_subscription_clicked");
    setShowOffer(true);
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText.trim().toUpperCase() !== t("deleteConfirmWord")) return;
    setDeleting(true);
    setDeleteError(false);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      if (!res.ok) {
        setDeleteError(true);
        setDeleting(false);
        return;
      }
      track("account_deleted");
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setDeleteError(true);
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-5">
      <h1 className="text-balance font-display text-xl font-bold text-foreground">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-5 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
            <User className="size-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-foreground">{profile.name}</p>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
            <CreditCard className="size-5 text-primary" aria-hidden />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("currentPlan")}</p>
            <p className="font-display text-base font-bold text-foreground">
              {planLabel} · <span className="text-sm font-normal text-muted-foreground">{statusLabel}</span>
            </p>
          </div>
        </div>

        {profile.plan === "free" ? (
          <>
            <p className="mt-4 text-sm text-muted-foreground">{t("freeNote")}</p>
            <Link
              href="/paywall"
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              <Sparkles className="size-4" aria-hidden /> {t("upgradeButton")}
            </Link>
          </>
        ) : offerAccepted ? (
          <p className="mt-4 rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">
            {t("offerAccept")} ✓
          </p>
        ) : (
          <>
            <p className="mt-4 text-xs text-muted-foreground">{t("manageBilling")}</p>
            <button
              type="button"
              onClick={handleCancelClick}
              className="mt-3 h-11 w-full rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary"
            >
              {t("cancelButton")}
            </button>
          </>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
            <Globe className="size-5 text-primary" aria-hidden />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{t("languageLabel")}</p>
          </div>
          <LocaleSwitcher />
        </div>
      </div>

      <Link
        href="/descargar"
        className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-secondary"
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
          <Smartphone className="size-5 text-primary" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{t("installAppLabel")}</p>
          <p className="text-xs text-muted-foreground">{t("installAppDesc")}</p>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(RESTART_EVENT))}
        className="mt-3 flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left hover:bg-secondary"
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
          <Compass className="size-5 text-primary" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{t("restartTourLabel")}</p>
          <p className="text-xs text-muted-foreground">{t("restartTourDesc")}</p>
        </div>
      </button>

      <CancelOfferModal
        open={showOffer}
        onClose={() => setShowOffer(false)}
        onAcceptOffer={() => {
          setShowOffer(false);
          setOfferAccepted(true);
        }}
        onConfirmCancel={() => {
          setShowOffer(false);
          setShowCancelInstructions(true);
        }}
      />

      <ModalShell
        open={showCancelInstructions}
        onClose={() => setShowCancelInstructions(false)}
        title={t("cancelInstructionsTitle")}
        icon={<Mail className="size-5 text-primary" aria-hidden />}
      >
        <p className="text-sm text-muted-foreground">{t("cancelInstructions")}</p>
        <button
          type="button"
          onClick={() => setShowCancelInstructions(false)}
          className="mt-4 h-11 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
        >
          {t("cancelInstructionsCta")}
        </button>
      </ModalShell>

      <button
        type="button"
        onClick={() => {
          setShowDeleteAccount(true);
          setDeleteConfirmText("");
          setDeleteError(false);
        }}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-destructive/40 text-sm font-medium text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" aria-hidden /> {t("deleteAccountButton")}
      </button>

      <ModalShell
        open={showDeleteAccount}
        onClose={() => setShowDeleteAccount(false)}
        title={t("deleteAccountTitle")}
        icon={<Trash2 className="size-5 text-destructive" aria-hidden />}
      >
        <p className="text-sm text-muted-foreground">{t("deleteAccountBody")}</p>
        <label className="mt-4 mb-1.5 block text-sm font-medium text-foreground">
          {t("deleteConfirmLabel", { word: t("deleteConfirmWord") })}
        </label>
        <input
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          placeholder={t("deleteConfirmWord")}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
        />
        {deleteError && (
          <p className="mt-2 text-xs text-destructive">{t("deleteAccountError")}</p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteAccount(false)}
            className="h-11 flex-1 rounded-lg border border-border text-sm font-medium text-foreground"
          >
            {t("deleteAccountCancel")}
          </button>
          <button
            type="button"
            disabled={deleteConfirmText.trim().toUpperCase() !== t("deleteConfirmWord") || deleting}
            onClick={handleDeleteAccount}
            className="h-11 flex-1 rounded-lg bg-destructive text-sm font-semibold text-white disabled:opacity-50"
          >
            {deleting ? t("deleting") : t("deleteAccountCta")}
          </button>
        </div>
      </ModalShell>
    </div>
  );
}
