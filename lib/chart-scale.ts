// Escala de gráficos a prueba de valores extremos.
//
// Antes la escala era `Math.max(...valores)`: un solo dato disparatado (el QA
// importó un peso de 1800 y una dosis de 999.999) dejaba TODAS las demás
// barras a ~0 px, y el gráfico se veía vacío aunque tuviera 30 registros
// buenos. La validación nueva impide meter esos datos hoy, pero quien ya los
// tenga guardados sigue viendo el gráfico roto — y siempre puede llegar un
// valor legítimamente alto (una recarga de 5000 ml de agua).
//
// Solución: si el máximo se dispara respecto al resto, la escala se corta en
// el percentil 90 y lo que se sale se marca como recortado, en vez de aplastar
// todo lo demás. Nunca se BORRA el dato: se sigue mostrando su número real.

function percentile(sortedAsc: number[], p: number): number {
  if (sortedAsc.length === 0) return 0;
  const idx = Math.min(sortedAsc.length - 1, Math.floor(p * (sortedAsc.length - 1)));
  return sortedAsc[idx];
}

export function chartScaleMax(values: number[]): { max: number; clipped: boolean } {
  const finite = values.filter((v) => Number.isFinite(v) && v > 0);
  if (finite.length === 0) return { max: 1, clipped: false };

  const trueMax = Math.max(...finite);
  // Con pocos datos no hay "resto" contra el que comparar: cualquier recorte
  // sería adivinar. Se respeta el valor real.
  if (finite.length < 4) return { max: Math.max(1, trueMax), clipped: false };

  const sorted = [...finite].sort((a, b) => a - b);
  const p90 = percentile(sorted, 0.9);

  // Umbral 3×: por debajo de eso es variación normal (una semana con el doble
  // de dosis no es un error), por encima es un dato que rompe la lectura.
  if (p90 > 0 && trueMax > p90 * 3) {
    return { max: Math.max(1, p90 * 1.15), clipped: true };
  }
  return { max: Math.max(1, trueMax), clipped: false };
}
