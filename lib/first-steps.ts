import type { AppData } from "@/lib/app-data";

export type FirstStepKey = "peptide" | "vial" | "dose" | "doneDose" | "health";

export type FirstStep = {
  key: FirstStepKey;
  done: boolean;
};

// Deriva el checklist de primeros pasos SOLO de datos reales ya cargados — nada
// se marca "hecho" a mano, cada acción refleja algo que el usuario ya hizo en la app.
export function computeFirstSteps(data: AppData): FirstStep[] {
  return [
    { key: "peptide", done: data.peptides.length > 0 },
    { key: "vial", done: data.vials.length > 0 },
    { key: "dose", done: data.doses.length > 0 },
    { key: "doneDose", done: data.doses.some((d) => d.done) },
    { key: "health", done: data.healthLogs.length > 0 },
  ];
}
