// Regla de cuándo mostrar el pop-up de satisfacción: cuenta con suficiente
// antigüedad Y no se le mostró en el último mes (se haya respondido o no —
// "mostrado" incluye cerrarlo sin contestar).
export const SATISFACTION_SURVEY_MIN_ACCOUNT_DAYS = 7;
export const SATISFACTION_SURVEY_RESHOW_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

export function isSatisfactionSurveyEligible(
  createdAt: string | null,
  lastShownAt: string | null,
  now: Date = new Date()
): boolean {
  if (!createdAt) return false;
  const daysSinceSignup = (now.getTime() - new Date(createdAt).getTime()) / DAY_MS;
  if (daysSinceSignup < SATISFACTION_SURVEY_MIN_ACCOUNT_DAYS) return false;
  if (!lastShownAt) return true;
  const daysSinceShown = (now.getTime() - new Date(lastShownAt).getTime()) / DAY_MS;
  return daysSinceShown >= SATISFACTION_SURVEY_RESHOW_DAYS;
}
