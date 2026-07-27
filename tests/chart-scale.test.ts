import { describe, it, expect } from "vitest";
import { chartScaleMax } from "@/lib/chart-scale";

// El QA importó un peso de 1800 kg y una dosis de 999.999 mg: la escala de los
// gráficos era el máximo absoluto, así que esas dos entradas dejaban el resto
// del gráfico plano y visualmente vacío.

describe("chartScaleMax", () => {
  it("sin datos devuelve una escala usable, no 0 (que rompería la división)", () => {
    expect(chartScaleMax([]).max).toBe(1);
    expect(chartScaleMax([0, 0, 0]).max).toBe(1);
  });

  it("con datos normales usa el máximo real: no recorta lo que no hay que recortar", () => {
    const r = chartScaleMax([4, 5, 6, 5, 7, 6]);
    expect(r.max).toBe(7);
    expect(r.clipped).toBe(false);
  });

  it("una semana con el DOBLE de dosis no se considera error", () => {
    // Variación real de un usuario que se puso al día. No debe recortarse.
    const r = chartScaleMax([3, 3, 4, 6, 3, 4]);
    expect(r.clipped).toBe(false);
    expect(r.max).toBe(6);
  });

  it("recorta el valor disparatado en vez de aplastar el resto", () => {
    // 1800 entre pesos de ~80: sin recorte, las barras de 80 medían 4 px.
    const r = chartScaleMax([78, 80, 79, 81, 80, 1800]);
    expect(r.clipped).toBe(true);
    expect(r.max).toBeLessThan(200); // la escala vuelve al rango real
    expect(r.max).toBeGreaterThan(80); // pero el dato normal más alto sigue cabiendo
  });

  it("con muy pocos datos NO recorta: no hay 'resto' contra el que comparar", () => {
    // Con 3 puntos, decidir que uno sobra sería adivinar.
    const r = chartScaleMax([5, 5, 900]);
    expect(r.clipped).toBe(false);
    expect(r.max).toBe(900);
  });

  it("ignora valores no finitos y negativos sin devolver NaN", () => {
    const r = chartScaleMax([NaN, Infinity, -20, 10, 12, 11, 13]);
    expect(Number.isFinite(r.max)).toBe(true);
    expect(r.max).toBe(13);
  });

  it("la escala nunca es 0 aunque todo sea inválido (evita dividir por cero)", () => {
    expect(chartScaleMax([NaN, -1, Infinity]).max).toBe(1);
  });
});
