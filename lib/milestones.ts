import { celebrateMilestone } from "@/lib/celebrate";
import type { AppData } from "@/lib/app-data";

// Hitos de racha con celebración creciente (ver docs/sistema/24-GAMIFICACION.md).
export const STREAK_MILESTONES = [7, 30, 100, 365] as const;

// Devuelve el hito más alto que se acaba de cruzar entre la racha anterior y
// la nueva, o null si no se cruzó ninguno (cubre saltos por streak freeze).
export function crossedMilestone(prevStreak: number, newStreak: number): number | null {
  const crossed = STREAK_MILESTONES.filter((m) => prevStreak < m && newStreak >= m);
  return crossed.length ? crossed[crossed.length - 1] : null;
}

export function checkStreakMilestone(prev: AppData, next: AppData) {
  const milestone = crossedMilestone(prev.progress.currentStreak, next.progress.currentStreak);
  if (milestone) celebrateMilestone(milestone);
}
