import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";

export default function TerminosPage() {
  const t = useTranslations("Legal");
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/15">
        <FileText className="size-6 text-primary" aria-hidden />
      </div>
      <h1 className="text-balance font-display text-2xl font-bold text-foreground">{t("termsTitle")}</h1>
      <p className="max-w-sm text-muted-foreground">{t("termsBody")}</p>
      <Link
        href="/"
        className="mt-2 inline-flex h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-foreground hover:bg-secondary"
      >
        {t("backHome")}
      </Link>
    </main>
  );
}
