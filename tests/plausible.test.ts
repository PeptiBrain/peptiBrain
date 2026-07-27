import { describe, it, expect } from "vitest";
import { PLAUSIBLE, inRange, requiredInRange, toNumber } from "@/lib/plausible";

// El QA metió 500 kg de peso, 99 % de grasa, 999.999 kcal, 99.999 min de
// ejercicio y 48 h de sueño, y todo se guardó sin rechistar. Estas pruebas
// fijan los topes para que no vuelva a colarse.

describe("toNumber", () => {
  it("acepta coma decimal (la gente escribe 73,5)", () => {
    expect(toNumber("73,5")).toBe(73.5);
    expect(toNumber("73.5")).toBe(73.5);
  });
});

describe("rangos de plausibilidad — casos reales del QA", () => {
  it("RECHAZA los valores imposibles que se colaron", () => {
    expect(requiredInRange("500", PLAUSIBLE.weightKg)).toBe(false); // 500 kg
    expect(inRange("99", PLAUSIBLE.bodyFatPct)).toBe(false); // 99 % de grasa
    expect(inRange("999999", PLAUSIBLE.calories)).toBe(false); // 999.999 kcal
    expect(requiredInRange("999999", PLAUSIBLE.hydrationMl)).toBe(false); // 999.999 ml
    expect(requiredInRange("99999", PLAUSIBLE.exerciseMin)).toBe(false); // 99.999 min
    expect(requiredInRange("48", PLAUSIBLE.sleepHours)).toBe(false); // 48 h de sueño
  });

  it("ACEPTA valores normales de una persona real", () => {
    expect(requiredInRange("73,5", PLAUSIBLE.weightKg)).toBe(true);
    expect(inRange("18.5", PLAUSIBLE.bodyFatPct)).toBe(true);
    expect(inRange("2200", PLAUSIBLE.calories)).toBe(true);
    expect(requiredInRange("2000", PLAUSIBLE.hydrationMl)).toBe(true);
    expect(requiredInRange("45", PLAUSIBLE.exerciseMin)).toBe(true);
    expect(requiredInRange("7.5", PLAUSIBLE.sleepHours)).toBe(true);
  });

  it("rechaza negativos y texto en todos los campos", () => {
    for (const rango of Object.values(PLAUSIBLE)) {
      expect(requiredInRange("-5", rango)).toBe(false);
      expect(requiredInRange("abc", rango)).toBe(false);
    }
  });

  it("es GENEROSO en los extremos: no le discute el cuerpo a nadie", () => {
    // Frenar lo imposible no puede significar rechazar a personas reales.
    expect(requiredInRange("45", PLAUSIBLE.weightKg)).toBe(true); // persona menuda
    expect(requiredInRange("180", PLAUSIBLE.weightKg)).toBe(true); // persona muy grande
    expect(inRange("4", PLAUSIBLE.bodyFatPct)).toBe(true); // atleta de élite
    expect(inRange("55", PLAUSIBLE.bodyFatPct)).toBe(true); // obesidad severa
    expect(requiredInRange("240", PLAUSIBLE.exerciseMin)).toBe(true); // 4 h de deporte
  });

  it("un campo OPCIONAL vacío es válido; uno OBLIGATORIO vacío no", () => {
    expect(inRange("", PLAUSIBLE.bodyFatPct)).toBe(true);
    expect(requiredInRange("", PLAUSIBLE.weightKg)).toBe(false);
  });

  it("los límites exactos entran (no se rechaza el borde)", () => {
    expect(requiredInRange(String(PLAUSIBLE.weightKg.min), PLAUSIBLE.weightKg)).toBe(true);
    expect(requiredInRange(String(PLAUSIBLE.weightKg.max), PLAUSIBLE.weightKg)).toBe(true);
  });
});
