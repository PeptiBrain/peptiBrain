import { describe, it, expect } from "vitest";
import { isWithinRange, todayIso, formatDateOnly } from "@/lib/date-range";

// Los filtros de fecha causaron dos bugs de DATOS FALSOS (mostrar como "de hoy"
// algo que no lo era). Estas pruebas fijan ese comportamiento para que no vuelva.

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function isoDaysAhead(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

describe("isWithinRange", () => {
  it("'hoy' incluye algo de hace un rato", () => {
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(isWithinRange(haceUnaHora, "today")).toBe(true);
  });

  it("'hoy' NO incluye lo de hace 3 días", () => {
    expect(isWithinRange(isoDaysAgo(3), "today")).toBe(false);
  });

  it("'7 días' incluye lo de hace 3 días y excluye lo de hace 30", () => {
    expect(isWithinRange(isoDaysAgo(3), "7d")).toBe(true);
    expect(isWithinRange(isoDaysAgo(30), "7d")).toBe(false);
  });

  it("EXCLUYE fechas futuras: una dosis programada no es actividad ya ocurrida", () => {
    // Sin este límite superior, un protocolo con 60 dosis futuras hacía que
    // Inicio dijera "2 de 60 dosis esta semana" estando el usuario al día.
    expect(isWithinRange(isoDaysAhead(5), "7d")).toBe(false);
    expect(isWithinRange(isoDaysAhead(1), "today")).toBe(false);
    expect(isWithinRange(isoDaysAhead(365), "all")).toBe(true); // "histórico" sí lo incluye
  });

  it("un rango personalizado de hoy a hoy NO cuela un registro de ayer (bug #26 del QA)", () => {
    const hoy = todayIso();
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const ayerIso = `${ayer.getFullYear()}-${String(ayer.getMonth() + 1).padStart(2, "0")}-${String(
      ayer.getDate()
    ).padStart(2, "0")}`;

    expect(isWithinRange(hoy, "custom", { start: hoy, end: hoy })).toBe(true);
    expect(isWithinRange(ayerIso, "custom", { start: hoy, end: hoy })).toBe(false);
  });

  it("una fecha SOLO-DÍA de hoy cuenta como 'hoy' (no se va al día anterior por UTC)", () => {
    // El peso se guarda como "2026-07-26" sin hora. Interpretado como UTC, en
    // América caía en el día anterior y desaparecía del filtro "Hoy".
    expect(isWithinRange(todayIso(), "today")).toBe(true);
  });
});

describe("todayIso", () => {
  it("devuelve la fecha LOCAL, no la UTC", () => {
    const d = new Date();
    const esperado = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
    expect(todayIso()).toBe(esperado);
  });

  it("tiene formato yyyy-mm-dd", () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("formatDateOnly", () => {
  it("no se desplaza un día (bug #52: '1 ene' salía como '31 dic 1899')", () => {
    // Se comprueba que el DÍA mostrado es el mismo que el guardado.
    expect(formatDateOnly("2026-01-01", "es-ES", { day: "numeric" })).toBe("1");
    expect(formatDateOnly("1900-01-01", "es-ES", { year: "numeric" })).toBe("1900");
  });

  it("devuelve el texto original si la fecha es inválida, en vez de 'Invalid Date'", () => {
    expect(formatDateOnly("no-es-fecha", "es-ES")).toBe("no-es-fecha");
  });
});
