// Regla estándar de farmacología: tras ~5 vidas medias, un compuesto se
// considera prácticamente eliminado del cuerpo (~97%). No es un dato exacto
// por persona (depende de metabolismo, dosis acumulada, etc.) — es la
// estimación de referencia que también usan calculadoras clínicas.
const HALF_LIVES_TO_CLEAR = 5;

export type ClearanceEstimate = {
  hours: number;
  label: string; // "~3 días", "~45 min"...
};

export function estimateClearance(halfLifeHours: number): ClearanceEstimate {
  const hours = halfLifeHours * HALF_LIVES_TO_CLEAR;
  return { hours, label: formatDuration(hours) };
}

export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `~${minutes} min`;
  }
  if (hours < 48) {
    const rounded = hours < 10 ? Math.round(hours * 10) / 10 : Math.round(hours);
    return `~${rounded} horas`;
  }
  const days = hours / 24;
  const rounded = days < 10 ? Math.round(days * 10) / 10 : Math.round(days);
  return `~${rounded} días`;
}
