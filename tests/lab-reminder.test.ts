import { describe, it, expect } from "vitest";
import {
  daysSince,
  mostOverdueMarker,
  monthsElapsed,
  labMarkerLabel,
  isKnownMarker,
  LAB_REMINDER_THRESHOLD_DAYS,
} from "@/lib/lab-reminder";

describe("daysSince", () => {
  it("calcula los días transcurridos desde una fecha", () => {
    const now = new Date("2026-08-01T12:00:00Z");
    expect(daysSince("2026-07-01", now)).toBe(31);
    expect(daysSince("2026-08-01", now)).toBe(0);
  });
});

describe("mostOverdueMarker — nunca compara valores, solo fechas", () => {
  it("devuelve null si ningún marcador supera el umbral", () => {
    const result = mostOverdueMarker([
      { marker: "hematocrito", lastLogDate: "2026-07-01", daysSinceLast: 10 },
      { marker: "psa", lastLogDate: "2026-07-15", daysSinceLast: 5 },
    ]);
    expect(result).toBeNull();
  });

  it("elige el marcador más atrasado entre los que superan el umbral", () => {
    const result = mostOverdueMarker([
      { marker: "hematocrito", lastLogDate: "2026-01-01", daysSinceLast: 150 },
      { marker: "psa", lastLogDate: "2026-03-01", daysSinceLast: 130 },
      { marker: "glucosa", lastLogDate: "2026-07-20", daysSinceLast: 10 },
    ]);
    expect(result?.marker).toBe("hematocrito");
    expect(result?.daysSinceLast).toBe(150);
  });

  it("el umbral es exactamente LAB_REMINDER_THRESHOLD_DAYS (inclusive)", () => {
    const exact = mostOverdueMarker([
      { marker: "estradiol", lastLogDate: "x", daysSinceLast: LAB_REMINDER_THRESHOLD_DAYS },
    ]);
    expect(exact).not.toBeNull();
    const justUnder = mostOverdueMarker([
      { marker: "estradiol", lastLogDate: "x", daysSinceLast: LAB_REMINDER_THRESHOLD_DAYS - 1 },
    ]);
    expect(justUnder).toBeNull();
  });

  it("devuelve null con lista vacía (usuario que nunca registró nada)", () => {
    expect(mostOverdueMarker([])).toBeNull();
  });
});

describe("monthsElapsed", () => {
  it("convierte días a meses completos", () => {
    expect(monthsElapsed(120)).toBe(4);
    expect(monthsElapsed(89)).toBe(2);
    expect(monthsElapsed(150)).toBe(5);
  });
});

describe("labMarkerLabel / isKnownMarker", () => {
  it("traduce marcadores conocidos a texto legible", () => {
    expect(labMarkerLabel("hematocrito")).toBe("hematocrito");
    expect(labMarkerLabel("testosterona_total")).toBe("testosterona total");
  });

  it("cae al id tal cual para marcadores desconocidos (nunca inventa un nombre)", () => {
    expect(labMarkerLabel("marcador_inventado")).toBe("marcador_inventado");
    expect(isKnownMarker("marcador_inventado")).toBe(false);
    expect(isKnownMarker("hematocrito")).toBe(true);
  });
});
