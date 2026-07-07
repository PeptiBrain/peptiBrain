"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const t = useTranslations("ResetPassword");
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const has8 = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const passwordsMatch = confirm.length > 0 && password === confirm;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!has8 || !hasNumber) {
      setError(t("errorWeakPassword"));
      return;
    }
    if (!passwordsMatch) {
      setError(t("errorPasswordsNoMatch"));
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(t("errorGeneric"));
      return;
    }
    setDone(true);
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-md"
      >
        {done ? (
          <div className="flex flex-col items-center py-2 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-accent">
              <Check className="size-7 text-primary" aria-hidden />
            </div>
            <h1 className="font-display text-xl font-bold text-foreground">{t("successTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("successBody")}</p>
            <Link
              href="/app"
              className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              {t("goToApp")}
            </Link>
          </div>
        ) : !ready ? (
          <div className="flex flex-col items-center py-2 text-center">
            <h1 className="font-display text-xl font-bold text-foreground">{t("expiredTitle")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("expiredBody")}</p>
            <Link
              href="/login"
              className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-transform active:scale-97"
            >
              {t("goToLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="font-display text-lg font-bold text-foreground">{t("title")}</h1>
            <div>
              <label htmlFor="new-password" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Lock className="size-3.5 text-muted-foreground" aria-hidden />
                {t("newPasswordLabel")}
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-lg border border-input bg-background px-3 pr-11 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                <li className={`flex items-center gap-1.5 text-xs ${has8 ? "text-primary" : "text-muted-foreground"}`}>
                  <Check className={`size-3.5 ${has8 ? "opacity-100" : "opacity-40"}`} aria-hidden />
                  {t("req8chars")}
                </li>
                <li className={`flex items-center gap-1.5 text-xs ${hasNumber ? "text-primary" : "text-muted-foreground"}`}>
                  <Check className={`size-3.5 ${hasNumber ? "opacity-100" : "opacity-40"}`} aria-hidden />
                  {t("reqNumber")}
                </li>
              </ul>
            </div>
            <div>
              <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-foreground">
                {t("confirmPasswordLabel")}
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-12 w-full rounded-lg border border-input bg-background px-3 text-base text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {passwordsMatch && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-primary">
                  <Check className="size-3.5" aria-hidden />
                  {t("passwordsMatch")}
                </p>
              )}
            </div>
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
              {loading ? t("loading") : t("submit")}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}
