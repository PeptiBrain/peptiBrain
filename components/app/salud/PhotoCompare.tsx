"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ProgressPhoto } from "@/lib/app-data";
import { ModalShell } from "@/components/app/shell/ModalShell";
import { GitCompare } from "lucide-react";

// Una foto suelta no dice nada; dos fotos juntas son la prueba de que el
// protocolo está funcionando — que es justo lo que hace que alguien siga
// pagando. Antes las fotos solo se veían de una en una en el lightbox.
//
// Por defecto compara la MÁS ANTIGUA con la MÁS RECIENTE (el "antes y después"
// que la gente quiere ver), pero se puede elegir cualquier par.
export function PhotoCompare({
  open,
  onClose,
  photos,
  formatDate,
}: {
  open: boolean;
  onClose: () => void;
  photos: ProgressPhoto[];
  formatDate: (iso: string) => string;
}) {
  const t = useTranslations("Salud");
  // photos llega ordenada de más reciente a más antigua.
  const oldest = photos[photos.length - 1];
  const newest = photos[0];
  const [leftId, setLeftId] = useState(oldest?.id || "");
  const [rightId, setRightId] = useState(newest?.id || "");

  const left = photos.find((p) => p.id === leftId) || oldest;
  const right = photos.find((p) => p.id === rightId) || newest;

  if (photos.length < 2) return null;

  const selectClass =
    "h-9 w-full rounded-lg border border-input bg-background px-2 text-xs text-foreground";

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={t("compareTitle")}
      icon={<GitCompare className="size-5 text-primary" aria-hidden />}
    >
      <div className="grid grid-cols-2 gap-3">
        {[
          { photo: left, value: leftId, onChange: setLeftId },
          { photo: right, value: rightId, onChange: setRightId },
        ].map((side, i) => (
          <div key={i}>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-secondary">
              {side.photo?.url && (
                <Image
                  src={side.photo.url}
                  alt={side.photo ? formatDate(side.photo.date) : ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
            <p className="mt-1.5 text-center text-xs font-medium text-foreground">
              {side.photo ? formatDate(side.photo.date) : ""}
            </p>
            <select
              value={side.value}
              onChange={(e) => side.onChange(e.target.value)}
              className={`mt-1 ${selectClass}`}
              aria-label={t("compareTitle")}
            >
              {photos.map((p) => (
                <option key={p.id} value={p.id}>
                  {formatDate(p.date)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}
