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
};

export function celebrateDoseLogged(data: AppData) {
  celebrate();
  const stats = computeStats(data, new Date());
  const detail: DoseCelebration = {
    totalDoses: stats.totalDosesDone,
    adherencePct: stats.adherence?.pct ?? null,
    weightDeltaKg: stats.weight?.deltaKg ?? null,
  };
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DOSE_CELEBRATION_EVENT, { detail }));
  }
}

export async function celebrate() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  if (!confettiModule) {
    confettiModule = (await import("canvas-confetti")).default as unknown as typeof import("canvas-confetti");
  }
  const confetti = confettiModule as unknown as (opts?: Record<string, unknown>) => void;

  const colors = ["#3fae7d", "#6bc79b", "#f4a340"];
  confetti({
    particleCount: 90,
    spread: 75,
    startVelocity: 35,
    origin: { y: 0.6 },
    colors,
    zIndex: 9999,
  });
  setTimeout(() => {
    confetti({ particleCount: 50, spread: 100, origin: { y: 0.5 }, colors, zIndex: 9999 });
  }, 200);
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
