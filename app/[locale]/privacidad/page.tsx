import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { LegalPage } from "@/components/app/legal/LegalPage";

export default function PrivacidadPage() {
  const t = useTranslations("Legal");
  return (
    <LegalPage
      icon={ShieldCheck}
      title={t("privacyTitle")}
      updated={t("privacyUpdated")}
      intro={t("privacyIntro")}
      sections={t.raw("privacySections")}
      backHome={t("backHome")}
    />
  );
}
