import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

type Section = { title: string; body: string };

export default function PrivacidadPage() {
  const t = useTranslations("Legal");
  const sections = t.raw("privacySections") as Section[];

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
          <ShieldCheck className="size-6 text-primary" aria-hidden />
        </div>
        <h1 className="mt-3 text-balance font-display text-2xl font-bold text-foreground">
          {t("privacyTitle")}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">{t("privacyUpdated")}</p>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{t("privacyIntro")}</p>

      <div className="mt-6 space-y-5">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-base font-bold text-foreground">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>

      <Link
        href="/"
        className="mx-auto mt-8 flex h-11 w-fit items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground hover:bg-secondary"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
