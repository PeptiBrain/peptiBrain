import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import { LegalPage } from "@/components/app/legal/LegalPage";

export default function CookiesPage() {
  const t = useTranslations("Cookies");
  return (
    <LegalPage
      icon={Cookie}
      title={t("title")}
      updated={t("updated")}
      intro={t("intro")}
      sections={t.raw("sections")}
      backHome={t("backHome")}
    />
  );
}
