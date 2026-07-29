import { describe, it, expect } from "vitest";
import { calcTrtDose } from "@/lib/trt-calc";

describe("calcTrtDose", () => {
  it("reparte la dosis semanal en una sola inyección (weekly)", () => {
    const r = calcTrtDose({ weeklyDoseMg: 100, concentrationMgPerMl: 200, frequency: "weekly" });
    expect(r).not.toBeNull();
    expect(r!.mgPerInjection).toBeCloseTo(100);
    expect(r!.mlPerInjection).toBeCloseTo(0.5);
    expect(r!.units).toBeCloseTo(50);
  });

  it("reparte la dosis semanal en dos inyecciones (twice-weekly)", () => {
    const r = calcTrtDose({ weeklyDoseMg: 100, concentrationMgPerMl: 200, frequency: "twice-weekly" });
    expect(r!.mgPerInjection).toBeCloseTo(50);
    expect(r!.mlPerInjection).toBeCloseTo(0.25);
    expect(r!.units).toBeCloseTo(25);
  });

  it("reparte la dosis semanal en día por medio (eod, ~3.5x/semana)", () => {
    const r = calcTrtDose({ weeklyDoseMg: 70, concentrationMgPerMl: 100, frequency: "eod" });
    expect(r!.mgPerInjection).toBeCloseTo(20);
    expect(r!.mlPerInjection).toBeCloseTo(0.2);
  });

  it("devuelve null con entradas inválidas o vacías", () => {
    expect(calcTrtDose({ weeklyDoseMg: 0, concentrationMgPerMl: 200, frequency: "weekly" })).toBeNull();
    expect(calcTrtDose({ weeklyDoseMg: 100, concentrationMgPerMl: 0, frequency: "weekly" })).toBeNull();
    expect(calcTrtDose({ weeklyDoseMg: -10, concentrationMgPerMl: 200, frequency: "weekly" })).toBeNull();
  });
});
