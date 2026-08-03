"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LifeBuoy } from "lucide-react";
import { HelpCenter } from "@/components/app/shell/HelpCenter";

// Botón flotante de ayuda visible en toda la app — antes el centro de ayuda
// solo se podía abrir desde el menú de perfil (2 clics, escondido). Va en la
// esquina inferior IZQUIERDA a propósito: el widget de próximas dosis ya
// ocupa la inferior derecha (bottom-6 right-4) y no deben solaparse.
export function HelpFab() {
  const t = useTranslations("Help");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openAria")}
        className="fixed bottom-6 left-4 z-40 flex size-14 items-center justify-center rounded-full bg-card text-primary shadow-lg ring-1 ring-border transition-transform active:scale-95"
      >
        <LifeBuoy className="size-6" aria-hidden />
      </button>
      <HelpCenter open={open} onClose={() => setOpen(false)} />
    </>
  );
}
