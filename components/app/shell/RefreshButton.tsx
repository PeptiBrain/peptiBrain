"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export function RefreshButton() {
  const t = useTranslations("AppShell");
  const [spinning, setSpinning] = useState(false);

  function reload() {
    setSpinning(true);
    window.location.reload();
  }

  return (
    <button
      type="button"
      onClick={reload}
      aria-label={t("refresh")}
      className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
    >
      <RefreshCw className={`size-4.5 ${spinning ? "animate-spin" : ""}`} aria-hidden />
    </button>
  );
}
