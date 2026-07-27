"use client";

import { useState } from "react";
import { logError } from "@/lib/error-log";

// El QA encontró ~15 formularios con el mismo patrón repetido a mano: guardar
// bloqueado con doble-tap, error de red que se traga en silencio (bug #4 y
// muchos otros). Este hook unifica ese patrón — quien lo usa ya no puede
// olvidarse del catch ni del logError.
export function useSaveAction<Args extends unknown[]>(
  action: (...args: Args) => void | Promise<void>,
  context: string
) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  async function run(...args: Args) {
    if (saving) return;
    setSaving(true);
    setError(false);
    try {
      await action(...args);
    } catch (err) {
      setError(true);
      logError(err instanceof Error ? err : new Error(String(err)), context);
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setError(false);
  }

  return { saving, error, run, reset };
}
