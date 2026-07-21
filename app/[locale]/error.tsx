"use client";

import { useEffect } from "react";
import { logError } from "@/lib/error-log";

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    logError(error, window.location.pathname);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
        <span className="text-2xl">⚠️</span>
      </div>
      <div className="space-y-1.5">
        <h1 className="font-display text-xl font-bold text-foreground">Algo salió mal</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          No pudimos cargar esta pantalla. Ya quedó registrado — puedes intentarlo de nuevo.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={reset}
          className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground active:scale-97"
        >
          Reintentar
        </button>
        <a
          href="/"
          className="flex h-11 items-center rounded-lg border border-border px-5 text-sm font-semibold text-foreground active:scale-97"
        >
          Ir al inicio
        </a>
      </div>
    </div>
  );
}
