"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Check } from "lucide-react";

export function NewsletterSignup() {
  const t = useTranslations("Newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm font-medium text-foreground">
        <Check className="size-4 shrink-0 text-primary" aria-hidden />
        {t("success")}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Mail className="size-4.5 shrink-0 text-primary" aria-hidden />
        <h2 className="font-display text-base font-bold text-foreground">{t("title")}</h2>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{t("subtitle")}</p>
      <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 shrink-0 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-97 disabled:opacity-60"
        >
          {status === "loading" ? t("sending") : t("cta")}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-xs text-destructive">{t("error")}</p>}
    </div>
  );
}
