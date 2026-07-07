import { useTranslations } from "next-intl";
import { Undo2 } from "lucide-react";
import { LegalPage } from "@/components/app/legal/LegalPage";

export default function ReembolsosPage() {
  const t = useTranslations("Reembolsos");
  return (
    <LegalPage
      icon={Undo2}
      title={t("title")}
      updated={t("updated")}
      intro={t("intro")}
      sections={t.raw("sections")}
      backHome={t("backHome")}
    />
  );
}
