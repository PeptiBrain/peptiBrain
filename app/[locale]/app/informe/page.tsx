"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Printer, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { computeStreak, loadAppData, type AppData } from "@/lib/app-data";
import { computeStats } from "@/lib/stats";
import { CURRENCY, type Locale } from "@/i18n/routing";

export default function InformePage() {
  const t = useTranslations("Informe");
  const locale = useLocale();
  const [data, setData] = useState<AppData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadAppData().then(setData);
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("name, email").eq("id", user.id).single();
      if (profile) {
        setName(profile.name || "");
        setEmail(profile.email || user.email || "");
      }
    });
  }, []);

  if (!data) return null;

  const symbol = CURRENCY[locale as Locale].symbol;
  const stats = computeStats(data, new Date());
  const streak = computeStreak(data.doses);
  const generatedOn = new Date().toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  const planLabel = { free: "Free", premium: "Premium", family: "Family" }[data.plan];
  const recentDoses = [...data.doses]
    .filter((d) => d.done)
    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
    .slice(0, 15);

  function peptideName(id: string) {
    return data!.peptides.find((p) => p.id === id)?.name || "—";
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 print:max-w-none print:px-0 print:py-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link href="/app" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> {t("back")}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          <Printer className="size-4" aria-hidden /> {t("print")}
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 print:rounded-none print:border-none print:p-0 print:shadow-none">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Image src="/peptibrain-isotipo.svg" alt="" width={28} height={28} />
            <span className="font-display text-lg font-bold text-foreground">PeptiBrain</span>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">{planLabel}</span>
        </div>

        <div className="mt-4">
          <h1 className="font-display text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{name} · {email}</p>
          <p className="text-xs text-muted-foreground">{t("generatedOn", { date: generatedOn })}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label={t("invested")} value={`${symbol}${stats.totalInvested.toFixed(0)}`} />
          <Stat label={t("dosesDone")} value={String(stats.totalDosesDone)} />
          <Stat label={t("adherence")} value={stats.adherence ? `${stats.adherence.pct}%` : t("noData")} />
          <Stat label={t("streak")} value={t("streakDays", { days: streak })} />
          <Stat label={t("mostUsed")} value={stats.mostUsed?.peptide.name || t("noData")} />
          <Stat
            label={t("weightChange")}
            value={stats.weight ? `${stats.weight.deltaKg > 0 ? "+" : ""}${stats.weight.deltaKg} kg` : t("noData")}
          />
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-foreground">{t("peptidesTitle")}</h2>
          {data.peptides.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">{t("peptidesEmpty")}</p>
          ) : (
            <table className="mt-2 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-1.5 font-medium">{t("colPeptide")}</th>
                  <th className="py-1.5 font-medium">{t("colRoute")}</th>
                  <th className="py-1.5 font-medium">{t("colDose")}</th>
                </tr>
              </thead>
              <tbody>
                {data.peptides.map((p) => (
                  <tr key={p.id} className="border-b border-border/60">
                    <td className="py-1.5 text-foreground">{p.name}</td>
                    <td className="py-1.5 text-muted-foreground">{p.route}</td>
                    <td className="py-1.5 text-muted-foreground">
                      {p.typicalDose ? `${p.typicalDose} ${p.typicalUnit}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-foreground">{t("dosesTitle")}</h2>
          {recentDoses.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">{t("dosesEmpty")}</p>
          ) : (
            <table className="mt-2 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-1.5 font-medium">{t("colDate")}</th>
                  <th className="py-1.5 font-medium">{t("colPeptide")}</th>
                  <th className="py-1.5 font-medium">{t("colAmount")}</th>
                </tr>
              </thead>
              <tbody>
                {recentDoses.map((d) => (
                  <tr key={d.id} className="border-b border-border/60">
                    <td className="py-1.5 text-muted-foreground">
                      {new Date(d.scheduledAt).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-1.5 text-foreground">{peptideName(d.peptideId)}</td>
                    <td className="py-1.5 text-muted-foreground">
                      {d.amount} {d.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-8 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">{t("footerNote")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("confidential")}</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3 print:border-border/60 print:bg-transparent">
      <p className="text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
