"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Check, ShieldCheck, Smartphone } from "lucide-react";
import { saveOnboarding } from "@/lib/onboarding";
import { Turnstile } from "@/components/app/Turnstile";
import { createClient } from "@/lib/supabase/client";
import { track, identifyUser } from "@/lib/mixpanel";

const COUNTRIES = [
  { flag: "🇪🇸", code: "+34", name: "España" },
  { flag: "🇨🇴", code: "+57", name: "Colombia" },
  { flag: "🇲🇽", code: "+52", name: "México" },
  { flag: "🇦🇷", code: "+54", name: "Argentina" },
  { flag: "🇵🇪", code: "+51", name: "Perú" },
  { flag: "🇨🇱", code: "+56", name: "Chile" },
  { flag: "🇪🇨", code: "+593", name: "Ecuador" },
  { flag: "🇺🇸", code: "+1", name: "EE.UU." },
];

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const [tab, setTab] = useState<"ingresar" | "registrarte" | "olvide">("registrarte");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+34");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [justRegistered, setJustRegistered] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = phone.replace(/\D/g, "").length >= 7;
  const has8 = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = confirm.length > 0 && password === confirm;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !emailValid || !has8 || !hasNumber) {
      setError(t("errorFixFields"));
      return;
    }
    if (password !== confirm) {
      setError(t("errorPasswordsNoMatch"));
      return;
    }
    if (!accepted) {
      setError(t("errorAcceptTerms"));
      return;
    }
    if (!captchaToken) {
      setError(t("errorCaptcha"));
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, captchaToken },
    });
    if (signUpError) {
      setLoading(false);
      setError(signUpError.message === "User already registered" ? t("errorEmailTaken") : t("errorGeneric"));
      return;
    }
    if (data.user) {
      await supabase.from("profiles").update({ phone_code: phoneCode, phone }).eq("id", data.user.id);
      identifyUser(data.user.id, { email, name, plan: "free" });
      track("sign_up_completed", { method: "email" });
    }
    saveOnboarding({ name, email, phoneCode, phone });
    setLoading(false);
    if (!data.session) {
      setJustRegistered(true);
      return;
    }
    router.push("/onboarding");
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/restablecer-password`,
    });
    setLoading(false);
    if (resetError) {
      setError(t("errorGeneric"));
      return;
    }
    setResetLinkSent(true);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    if (signInError) {
      setError(t("errorInvalidCredentials"));
      return;
    }
    if (data.user) {
      identifyUser(data.user.id, { email: loginEmail });
      track("login_completed", { method: "email" });
    }
    router.push("/app");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link href="/" className="flex flex-col items-center">
          <Image src="/peptibrain-isotipo.svg" alt="" width={60} height={60} priority />
          <span className="mt-3 font-display text-2xl font-bold tracking-tight text-primary">
            PeptiBrain
          </span>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{t("tagline")}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-md"
      >
        {justRegistered ? (
          <div className="flex flex-col items-center py-2 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-accent">
              <Check className="size-7 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">{t("almostThereTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("almostThereBody", { email })}</p>
            <button
              type="button"
              onClick={() => {
                setJustRegistered(false);
                setTab("ingresar");
              }}
              className="mt-5 h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              {t("goToLogin")}
            </button>
          </div>
        ) : tab === "olvide" ? (
          <div>
            <button
              type="button"
              onClick={() => {
                setTab("ingresar");
                setResetLinkSent(false);
                setError("");
              }}
              className="mb-4 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {t("backToLogin")}
            </button>
            {resetLinkSent ? (
              <div className="flex flex-col items-center py-2 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-accent">
                  <Check className="size-7 text-primary" aria-hidden />
                </div>
                <h1 className="font-display text-xl font-bold text-foreground">{t("resetLinkSentTitle")}</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("resetLinkSentBody", { email: forgotEmail })}
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <h1 className="font-display text-lg font-bold text-foreground">{t("forgotPasswordTitle")}</h1>
                <p className="-mt-2 text-sm text-muted-foreground">{t("forgotPasswordBody")}</p>
                <Field label={t("emailLabel")} htmlFor="forgot-email" icon={Mail}>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className={inputClass}
                  />
                </Field>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97 disabled:opacity-60"
                >
                  {loading ? t("loading") : t("sendResetLink")}
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
        <div className="mb-5 flex rounded-lg bg-secondary p-1">
          <button
            type="button"
            onClick={() => setTab("ingresar")}
            className={`h-10 flex-1 rounded-md text-sm font-medium transition-colors ${
              tab === "ingresar" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t("tabLogin")}
          </button>
          <button
            type="button"
            onClick={() => setTab("registrarte")}
            className={`h-10 flex-1 rounded-md text-sm font-medium transition-colors ${
              tab === "registrarte" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t("tabRegister")}
          </button>
        </div>

        {tab === "registrarte" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <Field label={t("nameLabel")} htmlFor="name" icon={User}>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className={inputClass}
              />
            </Field>

            <Field label={t("emailLabel")} htmlFor="email" icon={Mail}>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className={inputClass}
              />
              {emailValid && <ValidHint>{t("emailValid")}</ValidHint>}
            </Field>

            <Field label={t("whatsappLabel")} htmlFor="phone" icon={Phone}>
              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                    aria-label={t("phoneCodeLabel")}
                    className="h-12 rounded-lg border border-input bg-background pl-3 pr-7 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code + c.name} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                  placeholder={t("phonePlaceholder")}
                  className={`${inputClass} flex-1`}
                />
              </div>
              {phoneValid && <ValidHint>{t("phoneValid")}</ValidHint>}
            </Field>

            <Field label={t("passwordLabel")} htmlFor="password" icon={Lock}>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                </button>
              </div>
              <ul className="mt-2 space-y-1">
                <Requirement met={has8}>{t("req8chars")}</Requirement>
                <Requirement met={hasNumber}>{t("reqNumber")}</Requirement>
              </ul>
            </Field>

            <Field label={t("confirmPasswordLabel")} htmlFor="confirm">
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
              />
              {passwordsMatch && <ValidHint>{t("passwordsMatch")}</ValidHint>}
            </Field>

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <span>
                {t("acceptPrefix")}{" "}
                <Link href="/terminos" className="text-primary underline-offset-2 hover:underline">
                  {t("termsLink")}
                </Link>{" "}
                {t("and")}{" "}
                <Link href="/privacidad" className="text-primary underline-offset-2 hover:underline">
                  {t("privacyLink")}
                </Link>
                . {t("understandPrefix")}{" "}
                <span className="font-medium text-foreground">{t("noMedicalAdvice")}</span>.
              </span>
            </label>

            <Turnstile onVerify={setCaptchaToken} />

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97 disabled:opacity-60"
            >
              {loading ? t("loading") : t("createAccount")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label={t("emailLabel")} htmlFor="login-email" icon={Mail}>
              <input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className={inputClass}
              />
            </Field>
            <Field label={t("passwordLabel")} htmlFor="login-password" icon={Lock}>
              <input
                id="login-password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            <button
              type="button"
              onClick={() => {
                setTab("olvide");
                setError("");
              }}
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              {t("forgotPasswordLink")}
            </button>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97 disabled:opacity-60"
            >
              {loading ? t("loading") : t("loginCta")}
            </button>
          </form>
        )}
        </>
        )}
      </motion.div>

      <div className="mt-5 flex flex-col items-center gap-1.5 text-xs text-muted-foreground">
        <p className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden /> {t("encryptedData")}
          </span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Smartphone className="size-3.5 text-primary" aria-hidden /> {t("multiDevice")}
          </span>
        </p>
        <p className="flex items-center gap-2">
          <Link href="/terminos" className="hover:text-foreground hover:underline">
            {t("termsLink")}
          </Link>
          <span aria-hidden>·</span>
          <Link href="/privacidad" className="hover:text-foreground hover:underline">
            {t("privacyLink")}
          </Link>
        </p>
      </div>
    </main>
  );
}

const inputClass =
  "h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({
  label,
  htmlFor,
  icon: Icon,
  children,
}: {
  label: string;
  htmlFor: string;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
        {Icon && <Icon className="size-3.5 text-muted-foreground" aria-hidden />}
        {label}
      </label>
      {children}
    </div>
  );
}

function ValidHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-primary">
      <Check className="size-3.5" aria-hidden />
      {children}
    </p>
  );
}

function Requirement({ met, children }: { met: boolean; children: React.ReactNode }) {
  return (
    <li className={`flex items-center gap-1.5 text-xs ${met ? "text-primary" : "text-muted-foreground"}`}>
      <Check className={`size-3.5 ${met ? "opacity-100" : "opacity-40"}`} aria-hidden />
      {children}
    </li>
  );
}
