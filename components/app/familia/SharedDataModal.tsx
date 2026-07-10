"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Users, Package, Beaker, Syringe, Scale, Apple, Wallet } from "lucide-react";
import { ModalShell } from "@/components/app/shell/ModalShell";
import { loadSharedOwnerData, type SharedOwnerData } from "@/lib/app-data";
import { CURRENCY, type Locale } from "@/i18n/routing";

export function SharedDataModal({
  open,
  onClose,
  ownerId,
}: {
  open: boolean;
  onClose: () => void;
  ownerId: string | null;
}) {
  const t = useTranslations("Familia");
  const locale = useLocale() as Locale;
  const symbol = CURRENCY[locale].symbol;
  const [data, setData] = useState<SharedOwnerData | null>(null);

  useEffect(() => {
    if (open && ownerId) {
      setData(null);
      loadSharedOwnerData(ownerId).then(setData);
    }
  }, [open, ownerId]);

  const lastWeight = data?.healthLogs.find((h) => h.weightKg);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={data ? t("sharedWithTitle", { name: data.ownerName }) : t("loading")}
      icon={<Users className="size-5 text-primary" aria-hidden />}
    >
      {!data ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Package className="size-4 text-primary" aria-hidden /> {t("sharedPeptides")}
            </p>
            {data.peptides.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noSharedData")}</p>
            ) : (
              <ul className="space-y-1 text-sm text-foreground">
                {data.peptides.map((p) => (
                  <li key={p.id}>{p.name}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Syringe className="size-4 text-primary" aria-hidden /> {t("sharedRecentDoses")}
            </p>
            {data.doses.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noSharedData")}</p>
            ) : (
              <ul className="space-y-1 text-sm text-foreground">
                {data.doses.slice(0, 5).map((d) => {
                  const peptide = data.peptides.find((p) => p.id === d.peptideId);
                  return (
                    <li key={d.id} className="flex justify-between gap-2">
                      <span>{peptide?.name || "—"}</span>
                      <span className="text-xs text-muted-foreground">
                        {d.amount} {d.unit} · {d.done ? t("done") : t("pending")}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Scale className="size-4 text-primary" aria-hidden /> {t("sharedWeight")}
            </p>
            <p className="text-sm text-foreground">
              {lastWeight
                ? `${lastWeight.weightKg} kg (${new Date(`${lastWeight.date}T00:00:00`).toLocaleDateString(locale)})`
                : t("noSharedData")}
            </p>
          </div>

          {data.vials.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Beaker className="size-4 text-primary" aria-hidden /> {t("sharedVials")}
              </p>
              <p className="text-sm text-muted-foreground">{t("vialsCount", { count: data.vials.length })}</p>
              {data.vials.some((v) => v.cost) && (
                <ul className="mt-1.5 space-y-1">
                  {data.vials
                    .filter((v) => v.cost)
                    .map((v) => {
                      const peptide = data.peptides.find((p) => p.id === v.peptideId);
                      return (
                        <li key={v.id} className="flex items-center justify-between gap-2 text-xs">
                          <span className="flex items-center gap-1 text-foreground">
                            <Wallet className="size-3 text-primary" aria-hidden /> {peptide?.name || "—"}
                          </span>
                          <span className="text-muted-foreground">{symbol}{v.cost}</span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          )}

          {data.meals.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Apple className="size-4 text-primary" aria-hidden /> {t("sharedMeals")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("mealsCount", { count: data.meals.length })}
              </p>
            </div>
          )}
        </div>
      )}
    </ModalShell>
  );
}
