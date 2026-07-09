"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Sparkles, Camera, Check, Eye, EyeOff, Download, Trash2, Mail, Globe, Smartphone, Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CancelOfferModal } from "@/components/app/cuenta/CancelOfferModal";
import { LocaleSwitcher } from "@/components/app/LocaleSwitcher";
import { ModalShell } from "@/components/app/shell/ModalShell";
import { RESTART_EVENT } from "@/components/app/shell/AppTour";
import { track } from "@/lib/mixpanel";
import { loadAppData } from "@/lib/app-data";

const COUNTRIES = [
  { flag: "🇪🇸", code: "+34" },
  { flag: "🇨🇴", code: "+57" },
  { flag: "🇲🇽", code: "+52" },
  { flag: "🇦🇷", code: "+54" },
  { flag: "🇵🇪", code: "+51" },
  { flag: "🇨🇱", code: "+56" },
  { flag: "🇪🇨", code: "+593" },
  { flag: "🇺🇸", code: "+1" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Profile = {
  name: string;
  email: string;
  plan: "free" | "premium" | "family";
  plan_status: string;
  phone: string | null;
  phone_code: string | null;
  avatar_url: string | null;
};

export default function CuentaPage() {
  const t = useTranslations("Cuenta");
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+34");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

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
        .select("name, email, plan, plan_status, phone, phone_code, avatar_url")
        .eq("id", user.id)
        .single();
      if (data) {
        const p = data as Profile;
        setProfile(p);
        setName(p.name || "");
        setEmail(p.email || "");
        setPhone(p.phone || "");
        setPhoneCode(p.phone_code || "+34");
        setAvatarUrl(p.avatar_url);
      }
    });
  }, []);

  if (!profile) return null;

  const initial = (name || profile.name || "?").trim().charAt(0).toUpperCase();
  const planLabel = { free: t("planFree"), premium: t("planPremium"), family: t("planFamily") }[profile.plan];
  const emailValid = EMAIL_RE.test(email.trim());
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneValid = phone.trim() === "" || (phoneDigits.length >= 7 && phoneDigits.length <= 15);
  const pwOk = password === "" || (password.length >= 8 && password === password2);
  const canSave = name.trim().length > 0 && emailValid && phoneValid && pwOk && !saving;

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `${user.id}/avatar.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) {
        setError(t("avatarError"));
        return;
      }
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = `${pub.publicUrl}?v=${Date.now()}`;
      await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
      setAvatarUrl(url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("profiles")
        .update({ name: name.trim(), phone: phone.trim() || null, phone_code: phoneCode })
        .eq("id", user.id);

      if (email.trim() !== profile!.email) {
        const { error: eErr } = await supabase.auth.updateUser({ email: email.trim() });
        if (eErr) {
          setError(t("emailChangeError"));
          setSaving(false);
          return;
        }
      }
      if (password) {
        const { error: pErr } = await supabase.auth.updateUser({ password });
        if (pErr) {
          setError(t("passwordChangeError"));
          setSaving(false);
          return;
        }
      }
      track("profile_updated");
      setPassword("");
      setPassword2("");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    const data = await loadAppData();
    const payload = { profile: { name, email, plan: profile!.plan }, ...data, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `peptibrain-datos.json`;
    a.click();
    URL.revokeObjectURL(url);
    track("data_exported");
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

  const inputClass =
    "h-11 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const labelClass = "mb-1.5 block text-sm font-semibold text-foreground";

  return (
    <div className="mx-auto max-w-md px-4 py-5">
      <h1 className="font-display text-2xl font-bold text-foreground">{t("editTitle")}</h1>

      {/* Mi plan */}
      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{t("myPlan")}</p>
          <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
            <Sparkles className="size-3.5 text-primary" aria-hidden /> {planLabel}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            profile.plan === "family"
              ? "planSummaryFamily"
              : profile.plan === "premium"
                ? "planSummaryPremium"
                : "planSummaryFree",
          )}
        </p>
        {profile.plan !== "family" && (
          <Link href="/paywall" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
            {t(profile.plan === "premium" ? "viewPlansFamily" : "viewPlans")}
          </Link>
        )}
        <p className="mt-2 text-center text-xs text-muted-foreground">{t("boughtOtherEmail")}</p>
      </div>

      {/* Avatar */}
      <div className="mt-5 flex justify-center">
        <div className="relative">
          <div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-accent">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              <span className="font-display text-3xl font-bold text-primary">{initial}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            aria-label={t("changePhoto")}
            className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-card disabled:opacity-50"
          >
            <Camera className="size-4" aria-hidden />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
        </div>
      </div>

      {/* Nombre */}
      <div className="mt-5">
        <label className={labelClass}>{t("nameLabel")}</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </div>

      {/* Correo */}
      <div className="mt-4">
        <label className={labelClass}>{t("emailLabel")}</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" className={inputClass} />
        {email.trim() !== "" && (
          <p className={`mt-1 flex items-center gap-1 text-xs ${emailValid ? "text-primary" : "text-destructive"}`}>
            {emailValid && <Check className="size-3.5" aria-hidden />}
            {emailValid ? t("emailValid") : t("emailInvalid")}
          </p>
        )}
      </div>

      {/* WhatsApp */}
      <div className="mt-4">
        <label className={labelClass}>WhatsApp</label>
        <div className="flex gap-2">
          <select
            value={phoneCode}
            onChange={(e) => setPhoneCode(e.target.value)}
            className="h-11 w-24 shrink-0 rounded-lg border border-input bg-background px-2 text-base text-foreground"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className={inputClass} />
        </div>
        {phone.trim() !== "" && (
          <p className={`mt-1 flex items-center gap-1 text-xs ${phoneValid ? "text-primary" : "text-destructive"}`}>
            {phoneValid && <Check className="size-3.5" aria-hidden />}
            {phoneValid ? t("phoneValid") : t("phoneInvalid")}
          </p>
        )}
      </div>

      {/* Contraseña */}
      <div className="mt-4 border-t border-border pt-4">
        <label className={labelClass}>{t("changePassword")}</label>
        <input
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("newPasswordPlaceholder")}
          className={inputClass}
        />
        <input
          type={showPw ? "text" : "password"}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder={t("confirmPasswordPlaceholder")}
          className={`${inputClass} mt-2`}
        />
        {password !== "" && !pwOk && <p className="mt-1 text-xs text-destructive">{t("passwordMismatch")}</p>}
        <label className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} />
          {showPw ? <EyeOff className="size-3.5" aria-hidden /> : <Eye className="size-3.5" aria-hidden />}
          {t("showPasswords")}
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      {saved && <p className="mt-3 flex items-center gap-1 text-sm font-medium text-primary"><Check className="size-4" aria-hidden /> {t("saved")}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          className="h-11 flex-1 rounded-lg bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {saving ? t("saving") : t("saveChanges")}
        </button>
        <Link
          href="/app"
          className="flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground"
        >
          {t("cancel")}
        </Link>
      </div>

      {/* Extras */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
            <Globe className="size-5 text-primary" aria-hidden />
          </div>
          <p className="flex-1 text-sm font-medium text-foreground">{t("languageLabel")}</p>
          <LocaleSwitcher />
        </div>

        <Link href="/descargar" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-secondary">
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
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left hover:bg-secondary"
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
            <Compass className="size-5 text-primary" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{t("restartTourLabel")}</p>
            <p className="text-xs text-muted-foreground">{t("restartTourDesc")}</p>
          </div>
        </button>

        {profile.plan !== "free" && !offerAccepted && (
          <button
            type="button"
            onClick={() => {
              track("cancel_subscription_clicked");
              setShowOffer(true);
            }}
            className="h-11 w-full rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary"
          >
            {t("cancelButton")}
          </button>
        )}
      </div>

      {/* Exportar datos */}
      <button
        type="button"
        onClick={handleExport}
        className="mt-6 flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left hover:bg-secondary"
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/15">
          <Download className="size-5 text-primary" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">{t("exportTitle")}</p>
          <p className="text-xs text-muted-foreground">{t("exportDesc")}</p>
        </div>
      </button>

      {/* Eliminar perfil */}
      <button
        type="button"
        onClick={() => {
          setShowDeleteAccount(true);
          setDeleteConfirmText("");
          setDeleteError(false);
        }}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-destructive/40 text-sm font-medium text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="size-4" aria-hidden /> {t("deleteAccountButton")}
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
        {deleteError && <p className="mt-2 text-xs text-destructive">{t("deleteAccountError")}</p>}
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
