import { describe, it, expect } from "vitest";
import { computeUsualTime, isHabitual, isWithinReminderWindow } from "@/lib/usual-dose-time";

describe("computeUsualTime — hora habitual a partir del historial", () => {
  it("devuelve null con menos de 3 muestras", () => {
    expect(computeUsualTime([])).toBeNull();
    expect(computeUsualTime(["2026-07-01T08:00:00Z"])).toBeNull();
    expect(computeUsualTime(["2026-07-01T08:00:00Z", "2026-07-02T08:00:00Z"])).toBeNull();
  });

  it("calcula la hora media para horarios consistentes (~08:00)", () => {
    const usual = computeUsualTime([
      "2026-07-01T08:00:00Z",
      "2026-07-02T08:05:00Z",
      "2026-07-03T07:55:00Z",
      "2026-07-04T08:00:00Z",
    ]);
    expect(usual).not.toBeNull();
    expect(usual!.minutesOfDay).toBeCloseTo(8 * 60, 0);
    expect(usual!.consistency).toBeGreaterThan(0.9);
  });

  it("promedia correctamente horarios que cruzan medianoche (23:50 y 00:10)", () => {
    const usual = computeUsualTime([
      "2026-07-01T23:50:00Z",
      "2026-07-02T00:10:00Z",
      "2026-07-03T23:55:00Z",
      "2026-07-04T00:05:00Z",
    ]);
    expect(usual).not.toBeNull();
    // Debe promediar cerca de medianoche (0 o 1440), NO al mediodía (720) —
    // que sería el resultado de una media aritmética ingenua.
    const distFromMidnight = Math.min(usual!.minutesOfDay, 1440 - usual!.minutesOfDay);
    expect(distFromMidnight).toBeLessThan(15);
    expect(usual!.consistency).toBeGreaterThan(0.9);
  });

  it("da baja consistencia para horarios dispersos por todo el día", () => {
    const usual = computeUsualTime(["2026-07-01T06:00:00Z", "2026-07-02T12:00:00Z", "2026-07-03T18:00:00Z"]);
    expect(usual).not.toBeNull();
    expect(usual!.consistency).toBeLessThan(0.4);
  });
});

describe("isHabitual", () => {
  it("es false para null", () => {
    expect(isHabitual(null)).toBe(false);
  });

  it("es true solo con consistencia suficiente", () => {
    expect(isHabitual({ minutesOfDay: 480, consistency: 0.9 })).toBe(true);
    expect(isHabitual({ minutesOfDay: 480, consistency: 0.2 })).toBe(false);
  });
});

describe("isWithinReminderWindow — 30 a 90 minutos después de la hora habitual", () => {
  it("false antes de la ventana (recién pasó la hora)", () => {
    expect(isWithinReminderWindow(8 * 60 + 10, 8 * 60)).toBe(false);
  });

  it("true dentro de la ventana", () => {
    expect(isWithinReminderWindow(8 * 60 + 45, 8 * 60)).toBe(true);
  });

  it("false después de la ventana", () => {
    expect(isWithinReminderWindow(8 * 60 + 120, 8 * 60)).toBe(false);
  });

  it("maneja el cruce de medianoche (hora habitual 23:30, ahora 00:30)", () => {
    expect(isWithinReminderWindow(30, 23 * 60 + 30)).toBe(true);
  });
});
