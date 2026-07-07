import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { LegalPage } from "@/components/app/legal/LegalPage";

export default function TerminosPage() {
  const t = useTranslations("Legal");
  return (
    <LegalPage
      icon={FileText}
      title={t("termsTitle")}
      updated={t("termsUpdated")}
      intro={t("termsIntro")}
      sections={t.raw("termsSections")}
      backHome={t("backHome")}
    />
  );
}
