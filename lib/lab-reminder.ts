import { LAB_MARKER_IDS, type LabMarkerId } from "@/lib/lab-markers";

// Recordatorio de "toca análisis": avisa cuánto tiempo pasó desde el último
// registro de un marcador que el usuario YA venía siguiendo — nunca sugiere
// marcadores nuevos ni evalúa si el valor está bien o mal (línea D2: la app
// organiza lo que el usuario ya tiene, no diagnostica).
export const LAB_REMINDER_THRESHOLD_DAYS = 120; // ~4 meses

// Mismas etiquetas que usa la UI (messages/es.json → Salud.marker_*) — se
// duplican aquí en texto plano porque el cron corre en el servidor sin
// contexto de locale, igual que el resto de notificaciones del cron diario.
export const LAB_MARKER_LABELS_ES: Record<LabMarkerId, string> = {
  testosterona_total: "testosterona total",
  testosterona_libre: "testosterona libre",
  estradiol: "estradiol",
  hematocrito: "hematocrito",
  psa: "PSA",
  glucosa: "glucosa",
  hba1c: "HbA1c",
  colesterol_total: "colesterol total",
  ldl: "LDL",
  hdl: "HDL",
  trigliceridos: "triglicéridos",
  igf1: "IGF-1",
  tsh: "TSH",
  otro: "tu marcador",
};

export type MarkerLastLog = { marker: string; lastLogDate: string; daysSinceLast: number };

export function daysSince(logDateIso: string, now: Date): number {
  const then = new Date(`${logDateIso}T00:00:00Z`).getTime();
  return Math.floor((now.getTime() - then) / 86400000);
}

// Entre los marcadores que el usuario ya siguió antes, elige el más atrasado
// (el que lleva más tiempo sin registrarse) — solo si supera el umbral. Nunca
// compara valores ni sugiere marcadores que el usuario nunca registró.
export function mostOverdueMarker(markers: MarkerLastLog[]): MarkerLastLog | null {
  const overdue = markers.filter((m) => m.daysSinceLast >= LAB_REMINDER_THRESHOLD_DAYS);
  if (overdue.length === 0) return null;
  return overdue.reduce((a, b) => (b.daysSinceLast > a.daysSinceLast ? b : a));
}

export function monthsElapsed(days: number): number {
  return Math.floor(days / 30);
}

export function labMarkerLabel(marker: string): string {
  return LAB_MARKER_LABELS_ES[marker as LabMarkerId] || marker;
}

export function isKnownMarker(marker: string): marker is LabMarkerId {
  return (LAB_MARKER_IDS as readonly string[]).includes(marker);
}
