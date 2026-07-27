import { describe, it, expect } from "vitest";
import { adherence, vialStatus, totalInvested, doneDoses } from "@/lib/stats";
import type { Dose, Vial } from "@/lib/app-data";

// El QA encontró métricas que se contradicen entre pantallas ("Adherencia — sin
// datos aún" con una dosis registrada, "Dosis cumplidas 0 de 0" en Inicio
// mientras Estadísticas decía 1). Estas pruebas fijan la semántica.

const AHORA = new Date("2026-07-26T12:00:00Z");

function dose(over: Partial<Dose> = {}): Dose {
  return {
    id: Math.random().toString(36).slice(2),
    peptideId: "p1",
    amount: "250",
    unit: "mcg",
    when: "",
    scheduledAt: "2026-07-25T08:00:00Z",
    createdAt: "2026-07-25T08:00:00Z",
    done: false,
    ...over,
  } as Dose;
}

describe("adherence — cumplimiento", () => {
  it("solo cuenta dosis YA VENCIDAS: las futuras no penalizan", () => {
    // Un protocolo de 60 dosis futuras no puede dar 2% de adherencia el día 1.
    const doses = [
      dose({ scheduledAt: "2026-07-25T08:00:00Z", done: true }),
      dose({ scheduledAt: "2026-09-01T08:00:00Z" }), // futura
      dose({ scheduledAt: "2026-09-08T08:00:00Z" }), // futura
    ];
    const r = adherence(doses, AHORA)!;
    expect(r.due).toBe(1);
    expect(r.done).toBe(1);
    expect(r.pct).toBe(100);
  });

  it("devuelve null SOLO si no hay ninguna dosis vencida", () => {
    // Es la diferencia entre "sin datos aún" y "0% de adherencia".
    expect(adherence([dose({ scheduledAt: "2026-12-01T08:00:00Z" })], AHORA)).toBeNull();
    expect(adherence([], AHORA)).toBeNull();
  });

  it("con una dosis vencida y aplicada NO puede decir 'sin datos' (bug #24 del QA)", () => {
    const r = adherence([dose({ done: true })], AHORA);
    expect(r).not.toBeNull();
    expect(r!.pct).toBe(100);
  });

  it("calcula el porcentaje correctamente con mezcla", () => {
    const doses = [
      dose({ done: true }),
      dose({ done: true }),
      dose({ done: false }),
      dose({ done: false }),
    ];
    expect(adherence(doses, AHORA)!.pct).toBe(50);
  });
});

describe("doneDoses", () => {
  it("filtra solo las aplicadas", () => {
    expect(doneDoses([dose({ done: true }), dose({ done: false })])).toHaveLength(1);
  });
});

describe("vialStatus — cuánto queda en el vial", () => {
  const vial: Vial = {
    id: "v1",
    peptideId: "p1",
    amount: "5",
    unit: "mg",
    bacWater: "2",
    createdAt: "2026-07-01T00:00:00Z",
  } as Vial;

  it("un vial sin dosis usadas está al 100%", () => {
    expect(vialStatus(vial, [])!.pct).toBe(100);
  });

  it("descuenta lo aplicado: 5 mg con 2 dosis de 250 mcg → 90%", () => {
    const doses = [
      dose({ done: true, scheduledAt: "2026-07-10T08:00:00Z" }),
      dose({ done: true, scheduledAt: "2026-07-17T08:00:00Z" }),
    ];
    const r = vialStatus(vial, doses)!;
    expect(r.pct).toBe(90); // 0.5 mg de 5 mg usados
  });

  it("NO cuenta dosis anteriores a abrir el vial", () => {
    const antigua = dose({ done: true, scheduledAt: "2026-06-01T08:00:00Z" });
    expect(vialStatus(vial, [antigua])!.pct).toBe(100);
  });

  it("nunca baja de 0% aunque se registre más de lo que cabía", () => {
    const muchas = Array.from({ length: 50 }, (_, i) =>
      dose({ done: true, amount: "1", unit: "mg", scheduledAt: `2026-07-${String(10 + (i % 20)).padStart(2, "0")}T08:00:00Z` })
    );
    const r = vialStatus(vial, muchas)!;
    expect(r.pct).toBe(0);
    expect(r.pct).toBeGreaterThanOrEqual(0);
  });

  it("devuelve null si la unidad del vial no es una masa (ml/UI)", () => {
    // Un vial ya líquido no se puede medir así — antes salía "1.00 ml/mL".
    expect(vialStatus({ ...vial, unit: "ml" } as Vial, [])).toBeNull();
  });
});

describe("totalInvested — dinero", () => {
  it("suma solo los viales con coste, ignorando los que no lo tienen", () => {
    const vials = [
      { cost: "50" } as Vial,
      { cost: "30" } as Vial,
      { cost: undefined } as unknown as Vial,
    ];
    expect(totalInvested(vials)).toBe(80);
  });

  it("no devuelve NaN si el coste es texto basura", () => {
    expect(Number.isFinite(totalInvested([{ cost: "abc" } as Vial]))).toBe(true);
  });
});
