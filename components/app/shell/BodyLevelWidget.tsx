"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Activity } from "lucide-react";
import { computeBodyLevels } from "@/lib/body-level";
import { formatDuration } from "@/lib/clearance";
import type { AppData } from "@/lib/app-data";

const TICK_MS = 60_000; // recalcula cada minuto para que el % baje mientras el usuario mira la pantalla

// Nivel estimado de cada péptido activo en el cuerpo, calculado en el cliente
// a partir de la última dosis real + vida media conocida (mismo modelo que
// el Clearance Estimator, pero conectado a los datos reales del usuario en
// vez de a un formulario suelto).
export function BodyLevelWidget({ data }: { data: AppData }) {
  const t = useTranslations("BodyLevel");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const entries = useMemo(() => (now ? computeBodyLevels(data, now) : []), [data, now]);

  if (!now || entries.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <Activity className="size-4 text-primary" aria-hidden /> {t("title")}
      </p>
      <ul className="mt-3 space-y-3">
        {entries.map((e) => (
          <li key={e.peptideId}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{e.peptideName}</span>
              <span className="tabular-nums font-semibold text-primary">{e.percentRemaining}%</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${e.percentRemaining}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("sinceLastDose", { time: formatDuration(e.hoursSinceLastDose) })}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-muted-foreground">{t("methodNote")}</p>
    </div>
  );
}
