import { describe, it, expect } from "vitest";
import { sideEffectPatterns } from "@/lib/side-effect-patterns";
import type { Dose, HealthLog } from "@/lib/app-data";

// Esta función alimenta lo que el usuario lleva a su médico. Contar mal aquí
// es peor que no contar nada.

function log(date: string, over: Partial<HealthLog> = {}): HealthLog {
  return { id: date + Math.random(), date, ...over } as HealthLog;
}

function dose(scheduledAt: string, done = true): Dose {
  return {
    id: Math.random().toString(36).slice(2),
    peptideId: "p1",
    amount: "250",
    unit: "mcg",
    when: "",
    scheduledAt,
    createdAt: scheduledAt,
    done,
  } as Dose;
}

describe("sideEffectPatterns", () => {
  it("con menos de 3 registros NO inventa un patrón (dos veces es azar)", () => {
    const logs = [log("2026-07-01", { sideEffect: "Náusea" }), log("2026-07-08", { sideEffect: "Náusea" })];
    expect(sideEffectPatterns(logs, [])).toHaveLength(0);
  });

  it("agrupa el mismo efecto aunque se escriba distinto (mayúsculas, espacios)", () => {
    const logs = [
      log("2026-07-01", { sideEffect: "Náusea" }),
      log("2026-07-08", { sideEffect: "náusea" }),
      log("2026-07-15", { sideEffect: "  Náusea  " }),
    ];
    const r = sideEffectPatterns(logs, []);
    expect(r).toHaveLength(1);
    expect(r[0].total).toBe(3);
  });

  it("cuenta cuántas veces coincidió con el día de una dosis aplicada", () => {
    const logs = [
      log("2026-07-01", { sideEffect: "Náusea" }),
      log("2026-07-08", { sideEffect: "Náusea" }),
      log("2026-07-15", { sideEffect: "Náusea" }),
    ];
    const doses = [dose("2026-07-01T08:00:00"), dose("2026-07-08T08:00:00")];
    const r = sideEffectPatterns(logs, doses);
    expect(r[0].total).toBe(3);
    expect(r[0].sameDayAsDose).toBe(2);
  });

  it("las dosis PROGRAMADAS no cuentan como coincidencia: no pasó nada ese día", () => {
    const logs = [
      log("2026-07-01", { sideEffect: "Dolor" }),
      log("2026-07-08", { sideEffect: "Dolor" }),
      log("2026-07-15", { sideEffect: "Dolor" }),
    ];
    const programadas = [dose("2026-07-01T08:00:00", false), dose("2026-07-08T08:00:00", false)];
    expect(sideEffectPatterns(logs, programadas)[0].sameDayAsDose).toBe(0);
  });

  it("promedia sueño e hidratación solo de los días que se apuntaron", () => {
    const logs = [
      log("2026-07-01", { sideEffect: "Náusea", sleepHours: "6", hydrationMl: "1000" }),
      log("2026-07-08", { sideEffect: "Náusea", sleepHours: "8" }), // sin hidratación
      log("2026-07-15", { sideEffect: "Náusea" }), // sin nada
    ];
    const r = sideEffectPatterns(logs, []);
    expect(r[0].avgSleepHours).toBe(7); // (6+8)/2, el día sin dato no cuenta
    expect(r[0].avgHydrationMl).toBe(1000);
  });

  it("devuelve null (no 0) cuando no hay ningún dato de sueño: 0 h sería mentira", () => {
    const logs = [
      log("2026-07-01", { sideEffect: "Náusea" }),
      log("2026-07-08", { sideEffect: "Náusea" }),
      log("2026-07-15", { sideEffect: "Náusea" }),
    ];
    expect(sideEffectPatterns(logs, [])[0].avgSleepHours).toBeNull();
  });

  it("ordena del efecto más registrado al menos", () => {
    const logs = [
      ...["2026-07-01", "2026-07-02", "2026-07-03"].map((d) => log(d, { sideEffect: "Dolor" })),
      ...["2026-07-04", "2026-07-05", "2026-07-06", "2026-07-07"].map((d) => log(d, { sideEffect: "Náusea" })),
    ];
    const r = sideEffectPatterns(logs, []);
    expect(r[0].effect).toBe("Náusea");
    expect(r[1].effect).toBe("Dolor");
  });

  it("ignora registros de salud sin efecto secundario", () => {
    const logs = [log("2026-07-01", { weightKg: "80" }), log("2026-07-02", { sideEffect: "  " })];
    expect(sideEffectPatterns(logs, [])).toHaveLength(0);
  });
});
