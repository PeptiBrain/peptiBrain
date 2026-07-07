import { useTranslations } from "next-intl";
import { Scale } from "lucide-react";
import { LegalPage } from "@/components/app/legal/LegalPage";

export default function AvisoLegalPage() {
  const t = useTranslations("AvisoLegal");
  return (
    <LegalPage
      icon={Scale}
      title={t("title")}
      updated={t("updated")}
      intro={t("intro")}
      sections={t.raw("sections")}
      backHome={t("backHome")}
    />
  );
}
