"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Syringe, Check } from "lucide-react";
import { ModalShell } from "@/components/app/shell/ModalShell";
import { BodySiteSelector } from "@/components/app/shell/BodySiteSelector";
import type { InjectionSiteId } from "@/lib/injection-sites";

export function InjectionSiteModal({
  open,
  onClose,
  onConfirm,
  onSkip,
  suggested,
  lastUsed,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (site: InjectionSiteId) => void;
  onSkip: () => void;
  suggested: InjectionSiteId;
  lastUsed: InjectionSiteId | null;
}) {
  const t = useTranslations("InjectionSite");
  const [selected, setSelected] = useState<InjectionSiteId>(suggested);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={t("title")}
      icon={<Syringe className="size-5 text-primary" aria-hidden />}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">{t("subtitle")}</p>
      {lastUsed && <p className="mt-1 text-xs text-muted-foreground">{t("lastUsed", { site: t(`site_${lastUsed}`) })}</p>}

      <div className="mt-4">
        <BodySiteSelector selected={selected} suggested={suggested} onSelect={setSelected} />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => onConfirm(selected)}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-97"
        >
          <Check className="size-4" aria-hidden /> {t("confirm")}
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="flex h-10 items-center justify-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t("skip")}
        </button>
      </div>
    </ModalShell>
  );
}
