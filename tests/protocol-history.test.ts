import { describe, it, expect } from "vitest";
import { inferLastProtocol } from "@/lib/protocol-history";
import type { Dose } from "@/lib/app-data";

// Esto RELLENA un formulario de dosificación. Si deduce mal, el usuario puede
// darle a guardar sin mirar y programarse 60 dosis equivocadas.

function dose(scheduledAt: string, over: Partial<Dose> = {}): Dose {
  return {
    id: Math.random().toString(36).slice(2),
    peptideId: "p1",
    amount: "250",
    unit: "mcg",
    when: "",
    scheduledAt,
    createdAt: scheduledAt,
    done: true,
    ...over,
  } as Dose;
}

describe("inferLastProtocol", () => {
  it("con menos de 3 dosis NO deduce nada: dos datos no son un patrón", () => {
    const doses = [dose("2026-07-01T08:00:00"), dose("2026-07-08T08:00:00")];
    expect(inferLastProtocol(doses, "p1")).toBeNull();
    expect(inferLastProtocol([], "p1")).toBeNull();
  });

  it("deduce cantidad, unidad e intervalo semanal de un historial regular", () => {
    const doses = [
      dose("2026-07-01T08:00:00"),
      dose("2026-07-08T08:00:00"),
      dose("2026-07-15T08:00:00"),
      dose("2026-07-22T08:00:00"),
    ];
    const r = inferLastProtocol(doses, "p1")!;
    expect(r.amount).toBe("250");
    expect(r.unit).toBe("mcg");
    expect(r.intervalDays).toBe(7);
    expect(r.basedOnDoses).toBe(4);
  });

  it("usa la cantidad de la ÚLTIMA dosis (si subió la dosis, esa es la vigente)", () => {
    const doses = [
      dose("2026-07-01T08:00:00", { amount: "250" }),
      dose("2026-07-08T08:00:00", { amount: "250" }),
      dose("2026-07-15T08:00:00", { amount: "500" }),
    ];
    expect(inferLastProtocol(doses, "p1")!.amount).toBe("500");
  });

  it("unas vacaciones no le cambian el intervalo habitual (usa mediana, no media)", () => {
    // 7, 7, 7, 40 días: la media daría ~15 (nada), la mediana da 7 (correcto).
    const doses = [
      dose("2026-05-01T08:00:00"),
      dose("2026-05-08T08:00:00"),
      dose("2026-05-15T08:00:00"),
      dose("2026-05-22T08:00:00"),
      dose("2026-07-01T08:00:00"),
    ];
    expect(inferLastProtocol(doses, "p1")!.intervalDays).toBe(7);
  });

  it("redondea al intervalo real más cercano: nadie se inyecta cada 168,0 h exactas", () => {
    const doses = [
      dose("2026-07-01T08:00:00"),
      dose("2026-07-08T20:00:00"), // 7,5 días
      dose("2026-07-15T09:00:00"), // ~6,5 días
      dose("2026-07-22T08:00:00"),
    ];
    expect(inferLastProtocol(doses, "p1")!.intervalDays).toBe(7);
  });

  it("no mezcla el historial de otro péptido", () => {
    const doses = [
      dose("2026-07-01T08:00:00", { peptideId: "p2", amount: "999" }),
      dose("2026-07-02T08:00:00", { peptideId: "p2", amount: "999" }),
      dose("2026-07-03T08:00:00", { peptideId: "p2", amount: "999" }),
    ];
    expect(inferLastProtocol(doses, "p1")).toBeNull();
    expect(inferLastProtocol(doses, "p2")!.amount).toBe("999");
  });

  it("dos dosis el mismo día no cuentan como intervalo (suele ser una corrección)", () => {
    const doses = [
      dose("2026-07-01T08:00:00"),
      dose("2026-07-01T20:00:00"), // mismo día
      dose("2026-07-08T08:00:00"),
      dose("2026-07-15T08:00:00"),
    ];
    expect(inferLastProtocol(doses, "p1")!.intervalDays).toBe(7);
  });

  it("descarta un historial con cantidad no numérica en vez de rellenar basura", () => {
    const doses = [
      dose("2026-07-01T08:00:00"),
      dose("2026-07-08T08:00:00"),
      dose("2026-07-15T08:00:00", { amount: "abc" }),
    ];
    expect(inferLastProtocol(doses, "p1")).toBeNull();
  });

  it("las dosis programadas y no aplicadas también cuentan como historial de pauta", () => {
    // El usuario ya decidió esa pauta aunque todavía no la haya cumplido.
    const doses = [
      dose("2026-07-01T08:00:00", { done: false }),
      dose("2026-07-08T08:00:00", { done: false }),
      dose("2026-07-15T08:00:00", { done: false }),
    ];
    expect(inferLastProtocol(doses, "p1")!.intervalDays).toBe(7);
  });
});
