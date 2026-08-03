import { computeStats } from "@/lib/stats";
import type { AppData } from "@/lib/app-data";

let confettiModule: typeof import("canvas-confetti") | null = null;

// Premio visible al registrar una dosis: confeti + un aviso con el progreso
// acumulado (dosis totales, adherencia, peso). El toast lo muestra
// DoseCelebrationToast, montado en el layout de la app, escuchando este evento.
export const DOSE_CELEBRATION_EVENT = "peptibrain:dose-celebration";

export type DoseCelebration = {
  totalDoses: number;
  adherencePct: number | null;
  weightDeltaKg: number | null;
  /** Momento "extra" ocasional (ver SPOTLIGHT_CHANCE) — nunca cambia el PB ni
   *  la racha real, solo el tono del aviso y un poco más de confeti. Es
   *  cosmético a propósito: 24-GAMIFICACION.md marca como dark pattern
   *  sortear algo que sí tenga valor real, así que aquí nunca se sortea eso. */
  spotlight: boolean;
};

// Probabilidad de que un registro de dosis reciba el momento "extra" — lo
// bastante baja para que sea una sorpresa real, no una rutina más.
const SPOTLIGHT_CHANCE = 0.15;

export function celebrateDoseLogged(data: AppData) {
  const spotlight = Math.random() < SPOTLIGHT_CHANCE;
  celebrate(spotlight ? 2 : 1);
  const stats = computeStats(data, new Date());
  const detail: DoseCelebration = {
    totalDoses: stats.totalDosesDone,
    adherencePct: stats.adherence?.pct ?? null,
    weightDeltaKg: stats.weight?.deltaKg ?? null,
    spotlight,
  };
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DOSE_CELEBRATION_EVENT, { detail }));
  }
}

// `intensity` 2 = el momento "extra" ocasional de una dosis (entre el confeti
// normal y el de un hito de racha). Por defecto 1, igual que siempre.
export async function celebrate(intensity: 1 | 2 = 1) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (!confettiModule) {
    confettiModule = (await import("canvas-confetti")).default as unknown as typeof import("canvas-confetti");
  }
  const confetti = confettiModule as unknown as (opts?: Record<string, unknown>) => void;

  const colors = ["#3fae7d", "#6bc79b", "#f4a340"];
  confetti({
    particleCount: 90 * intensity,
    spread: 75,
    startVelocity: 35,
    origin: { y: 0.6 },
    colors,
    zIndex: 9999,
  });
  setTimeout(() => {
    confetti({ particleCount: 50 * intensity, spread: 100, origin: { y: 0.5 }, colors, zIndex: 9999 });
  }, 200);
}

// Primer registro de CUALQUIER tipo (péptido, vial, dosis, salud, comida, foto de
// progreso o análisis) — un aviso corto y positivo que se cierra solo, sin bloquear
// la app (a diferencia del modal de hitos de racha). Se dispara una sola vez desde
// useAppData() cuando detecta la transición de 0 a 1 registros totales.
export const FIRST_RECORD_CELEBRATION_EVENT = "peptibrain:first-record-celebration";

export function celebrateFirstRecord() {
  celebrate();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FIRST_RECORD_CELEBRATION_EVENT));
  }
}

// El caso más común de "primer registro" ocurre durante el onboarding (se
// siembra péptido/vial/dosis antes de que exista ninguna pantalla de /app
// montada) — el evento de arriba se perdería porque nadie lo escucha todavía.
// BuildingScreen deja esta marca al terminar; el toast la consume en cuanto
// se monta en Inicio, en vez de depender de un evento en tiempo real.
const FIRST_RECORD_PENDING_KEY = "peptibrain_first_record_pending";

export function markFirstRecordPending() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FIRST_RECORD_PENDING_KEY, "1");
}

export function consumePendingFirstRecord(): boolean {
  if (typeof window === "undefined") return false;
  const pending = window.localStorage.getItem(FIRST_RECORD_PENDING_KEY) === "1";
  if (pending) window.localStorage.removeItem(FIRST_RECORD_PENDING_KEY);
  return pending;
}

// Hito de racha (7/30/100/365 días): confeti más intenso que el de una dosis
// normal (3 ráfagas en vez de 2) + el modal de Pepti que escucha este evento.
export const MILESTONE_CELEBRATION_EVENT = "peptibrain:milestone-celebration";
export type MilestoneCelebration = { milestone: number };

export function celebrateMilestone(milestone: number) {
  celebrateBig();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(MILESTONE_CELEBRATION_EVENT, { detail: { milestone } }));
  }
}

async function celebrateBig() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (!confettiModule) {
    confettiModule = (await import("canvas-confetti")).default as unknown as typeof import("canvas-confetti");
  }
  const confetti = confettiModule as unknown as (opts?: Record<string, unknown>) => void;

  const colors = ["#3fae7d", "#6bc79b", "#f4a340"];
  confetti({ particleCount: 140, spread: 100, startVelocity: 45, origin: { y: 0.5 }, colors, zIndex: 9999 });
  setTimeout(() => {
    confetti({ particleCount: 90, spread: 120, origin: { y: 0.4 }, colors, zIndex: 9999 });
  }, 200);
  setTimeout(() => {
    confetti({ particleCount: 60, spread: 140, origin: { y: 0.3 }, colors, zIndex: 9999 });
  }, 400);
}
