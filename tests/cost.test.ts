import { describe, it, expect } from "vitest";
import { costPerMg, weeklySpend, projectedYearlyCost } from "@/lib/stats";
import type { Dose, Vial } from "@/lib/app-data";

// Esto calcula DINERO y se le enseña al usuario para que decida si sigue con
// su protocolo. Un número inventado (o un NaN) aquí destruye la confianza.

const NOW = new Date("2026-07-27T12:00:00Z");

function vial(over: Partial<Vial> = {}): Vial {
  return {
    id: Math.random().toString(36).slice(2),
    peptideId: "p1",
    amount: "5",
    unit: "mg",
    bacWater: "2",
    cost: "100",
    createdAt: "2026-06-01T00:00:00Z",
    shares: [],
    ...over,
  } as Vial;
}

function dose(over: Partial<Dose> = {}): Dose {
  return {
    id: Math.random().toString(36).slice(2),
    peptideId: "p1",
    amount: "250",
    unit: "mcg",
    when: "",
    scheduledAt: "2026-07-01T08:00:00Z",
    createdAt: "2026-07-01T08:00:00Z",
    done: true,
    ...over,
  } as Dose;
}

describe("costPerMg", () => {
  it("100 € por un vial de 5 mg → 20 €/mg", () => {
    expect(costPerMg([vial()])).toBe(20);
  });

  it("promedia varios viales de distinto precio", () => {
    // 100€/5mg + 60€/5mg = 160€ por 10 mg = 16 €/mg
    expect(costPerMg([vial(), vial({ cost: "60" })])).toBe(16);
  });

  it("descuenta la parte del vial que es de un familiar", () => {
    // Vial de 100 € compartido al 50 %: solo 50 € son míos → 10 €/mg.
    const compartido = vial({ shares: [{ memberId: "m1", percent: 50 }] });
    expect(costPerMg([compartido])).toBe(10);
  });

  it("devuelve null si no hay precio en ningún vial (no 0, que parecería gratis)", () => {
    expect(costPerMg([vial({ cost: undefined })])).toBeNull();
    expect(costPerMg([])).toBeNull();
  });

  it("ignora viales en ml/UI: su precio no se puede repartir por peso", () => {
    expect(costPerMg([vial({ unit: "ml" })])).toBeNull();
  });
});

describe("weeklySpend y projectedYearlyCost", () => {
  it("con menos de una semana de historial NO extrapola: sería inventar", () => {
    const doses = [
      dose({ scheduledAt: "2026-07-25T08:00:00Z" }),
      dose({ scheduledAt: "2026-07-27T08:00:00Z" }),
    ];
    expect(weeklySpend([vial()], doses, NOW)).toBeNull();
    expect(projectedYearlyCost([vial()], doses, NOW)).toBeNull();
  });

  it("con una sola dosis no hay ritmo que medir", () => {
    expect(weeklySpend([vial()], [dose()], NOW)).toBeNull();
  });

  it("calcula el gasto semanal al ritmo real de consumo", () => {
    // 5 dosis de 250 mcg (=1.25 mg) repartidas en 28 días, a 20 €/mg.
    // 1.25 mg / 28 días * 7 = 0.3125 mg/semana * 20 € = 6.25 €/semana.
    const doses = [
      dose({ scheduledAt: "2026-06-29T08:00:00Z" }),
      dose({ scheduledAt: "2026-07-06T08:00:00Z" }),
      dose({ scheduledAt: "2026-07-13T08:00:00Z" }),
      dose({ scheduledAt: "2026-07-20T08:00:00Z" }),
      dose({ scheduledAt: "2026-07-27T08:00:00Z" }),
    ];
    const weekly = weeklySpend([vial()], doses, NOW)!;
    expect(weekly).toBeCloseTo(6.25, 2);
    expect(projectedYearlyCost([vial()], doses, NOW)!).toBeCloseTo(6.25 * 52, 2);
  });

  it("las dosis PROGRAMADAS (no aplicadas) no cuentan como dinero gastado", () => {
    const aplicadas = [
      dose({ scheduledAt: "2026-06-29T08:00:00Z" }),
      dose({ scheduledAt: "2026-07-27T08:00:00Z" }),
    ];
    const conFuturas = [
      ...aplicadas,
      dose({ scheduledAt: "2026-09-01T08:00:00Z", done: false }),
      dose({ scheduledAt: "2026-10-01T08:00:00Z", done: false }),
    ];
    expect(weeklySpend([vial()], conFuturas, NOW)).toBe(weeklySpend([vial()], aplicadas, NOW));
  });

  it("nunca devuelve NaN ni Infinity con datos basura", () => {
    const doses = [
      dose({ amount: "abc", scheduledAt: "2026-06-29T08:00:00Z" }),
      dose({ amount: "abc", scheduledAt: "2026-07-27T08:00:00Z" }),
    ];
    const r = weeklySpend([vial()], doses, NOW);
    expect(r === null || Number.isFinite(r)).toBe(true);
  });
});
