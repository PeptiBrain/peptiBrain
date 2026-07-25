"use client";

import { useTranslations } from "next-intl";
import { INJECTION_SITE_IDS, type InjectionSiteId } from "@/lib/injection-sites";

// Silueta humana simplificada (abstracta, no fotorrealista, un solo tono
// neutro + el color de acento de la app) con un punto tocable por zona de
// inyección — reemplaza la grilla de botones de texto por un mapa corporal,
// más rápido de leer de un vistazo que una lista.
const SITE_POSITIONS: Record<InjectionSiteId, { cx: number; cy: number; labelDy: number }> = {
  abdomen: { cx: 100, cy: 132, labelDy: 0 },
  muslo: { cx: 118, cy: 225, labelDy: 0 },
  brazo: { cx: 146, cy: 108, labelDy: 0 },
};

export function BodySiteSelector({
  selected,
  suggested,
  onSelect,
}: {
  selected: InjectionSiteId;
  suggested: InjectionSiteId;
  onSelect: (site: InjectionSiteId) => void;
}) {
  const t = useTranslations("InjectionSite");

  return (
    <div className="relative mx-auto w-full max-w-[220px]">
      <svg viewBox="0 0 200 320" className="w-full" aria-hidden>
        {/* cabeza */}
        <circle cx="100" cy="30" r="22" className="fill-secondary" />
        {/* torso */}
        <rect x="70" y="55" width="60" height="105" rx="26" className="fill-secondary" />
        {/* brazos */}
        <rect x="42" y="60" width="22" height="95" rx="11" className="fill-secondary" />
        <rect x="136" y="60" width="22" height="95" rx="11" className="fill-secondary" />
        {/* piernas */}
        <rect x="73" y="158" width="25" height="150" rx="12" className="fill-secondary" />
        <rect x="102" y="158" width="25" height="150" rx="12" className="fill-secondary" />

        {INJECTION_SITE_IDS.map((site) => {
          const pos = SITE_POSITIONS[site];
          const isSelected = selected === site;
          const isSuggested = suggested === site;
          return (
            <g key={site}>
              {isSuggested && !isSelected && (
                <circle cx={pos.cx} cy={pos.cy} r="14" className="fill-none stroke-primary" strokeWidth="2" strokeDasharray="3 3" />
              )}
              <circle
                cx={pos.cx}
                cy={pos.cy}
                r={isSelected ? "11" : "9"}
                className={isSelected ? "fill-primary" : "fill-card stroke-primary"}
                strokeWidth={isSelected ? 0 : 2}
              />
            </g>
          );
        })}
      </svg>

      {INJECTION_SITE_IDS.map((site) => {
        const pos = SITE_POSITIONS[site];
        const isSelected = selected === site;
        return (
          <button
            key={site}
            type="button"
            onClick={() => onSelect(site)}
            aria-label={t(`site_${site}`)}
            aria-pressed={isSelected}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
            style={{ left: `${(pos.cx / 200) * 100}%`, top: `${(pos.cy / 320) * 100}%`, width: 32, height: 32 }}
          />
        );
      })}

      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {INJECTION_SITE_IDS.map((site) => (
          <button
            key={site}
            type="button"
            onClick={() => onSelect(site)}
            className={`flex items-center gap-1.5 text-xs font-medium ${
              selected === site ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className={`size-2 rounded-full ${selected === site ? "bg-primary" : "bg-border"}`} aria-hidden />
            {t(`site_${site}`)}
            {site === suggested && <span className="text-[10px] font-normal">· {t("suggested")}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
