import { describe, it, expect } from "vitest";
import { unitsToDraw, waterForTargetUnits } from "@/lib/dose-math";

// Estas son las pruebas MÁS IMPORTANTES del proyecto: PeptiBrain es una app de
// dosificación, y un número equivocado aquí no es un fallo cosmético.
// Varios de estos casos vienen literalmente del QA que rompió la app a mano.

describe("unitsToDraw — cuántas unidades cargar en la jeringa", () => {
  it("calcula el caso típico: vial 5 mg + 2 mL de agua, dosis de 250 mcg → 10 U", () => {
    // 5 mg / 2 mL = 2.5 mg/mL. 0.25 mg / 2.5 mg/mL = 0.1 mL = 10 unidades U-100.
    expect(
      unitsToDraw({ vialAmount: 5, vialUnit: "mg", bacWater: 2, doseAmount: 250, doseUnit: "mcg" })
    ).toBeCloseTo(10, 5);
  });

  it("semaglutida 5 mg en 2 mL, dosis de 0.5 mg → 20 U", () => {
    expect(
      unitsToDraw({ vialAmount: 5, vialUnit: "mg", bacWater: 2, doseAmount: 0.5, doseUnit: "mg" })
    ).toBeCloseTo(20, 5);
  });

  it("más agua = más unidades para la MISMA dosis (la dosis real no cambia)", () => {
    const poca = unitsToDraw({ vialAmount: 5, vialUnit: "mg", bacWater: 1, doseAmount: 250, doseUnit: "mcg" })!;
    const mucha = unitsToDraw({ vialAmount: 5, vialUnit: "mg", bacWater: 4, doseAmount: 250, doseUnit: "mcg" })!;
    expect(mucha).toBeGreaterThan(poca);
    expect(mucha).toBeCloseTo(poca * 4, 5);
  });

  it("NO devuelve Infinity con 0 mL de agua (bug #1 del QA: se guardaba 'Infinity mg/mL')", () => {
    const r = unitsToDraw({ vialAmount: 10, vialUnit: "mg", bacWater: 0, doseAmount: 250, doseUnit: "mcg" });
    expect(r).toBeNull();
  });

  it("devuelve null con unidades no químicas (ml/UI), en vez de un número sin sentido", () => {
    expect(
      unitsToDraw({ vialAmount: 5, vialUnit: "ml", bacWater: 2, doseAmount: 250, doseUnit: "mcg" })
    ).toBeNull();
  });

  it("nunca devuelve NaN ni Infinity con entradas límite", () => {
    const entradas = [
      { vialAmount: 0, vialUnit: "mg", bacWater: 2, doseAmount: 250, doseUnit: "mcg" },
      { vialAmount: 5, vialUnit: "mg", bacWater: 0, doseAmount: 250, doseUnit: "mcg" },
      { vialAmount: 5, vialUnit: "mg", bacWater: 2, doseAmount: 0, doseUnit: "mcg" },
    ];
    for (const e of entradas) {
      const r = unitsToDraw(e);
      expect(r === null || Number.isFinite(r)).toBe(true);
    }
  });
});

describe("waterForTargetUnits — cuánta agua añadir para que la dosis caiga en X unidades", () => {
  it("caso válido: vial 5 mg, dosis 250 mcg, objetivo 10 U → 2.00 mL", () => {
    expect(
      waterForTargetUnits({ vialAmount: 5, vialUnit: "mg", doseAmount: 250, doseUnit: "mcg", targetUnits: 10 })
    ).toBeCloseTo(2, 5);
  });

  it("dosis igual al vial entero sigue siendo válida", () => {
    expect(
      waterForTargetUnits({ vialAmount: 5, vialUnit: "mg", doseAmount: 5, doseUnit: "mg", targetUnits: 100 })
    ).toBeCloseTo(1, 5);
  });

  it("RECHAZA lo físicamente imposible: 2 mg de dosis en un vial de 1 mg (bug #3 del QA)", () => {
    // Antes respondía "0.10 mL" como si fuera un resultado válido.
    expect(
      waterForTargetUnits({ vialAmount: 1, vialUnit: "mg", doseAmount: 2000, doseUnit: "mcg", targetUnits: 20 })
    ).toBeNull();
  });

  it("rechaza vial, dosis u objetivo en cero o negativos", () => {
    const casos = [
      { vialAmount: 0, vialUnit: "mg", doseAmount: 250, doseUnit: "mcg", targetUnits: 10 },
      { vialAmount: 5, vialUnit: "mg", doseAmount: 0, doseUnit: "mcg", targetUnits: 10 },
      { vialAmount: 5, vialUnit: "mg", doseAmount: 250, doseUnit: "mcg", targetUnits: 0 },
      { vialAmount: -5, vialUnit: "mg", doseAmount: 250, doseUnit: "mcg", targetUnits: 10 },
    ];
    for (const c of casos) expect(waterForTargetUnits(c)).toBeNull();
  });

  it("es el inverso exacto de unitsToDraw (ida y vuelta)", () => {
    const agua = waterForTargetUnits({
      vialAmount: 5, vialUnit: "mg", doseAmount: 250, doseUnit: "mcg", targetUnits: 10,
    })!;
    const unidades = unitsToDraw({
      vialAmount: 5, vialUnit: "mg", bacWater: agua, doseAmount: 250, doseUnit: "mcg",
    })!;
    expect(unidades).toBeCloseTo(10, 5);
  });
});
