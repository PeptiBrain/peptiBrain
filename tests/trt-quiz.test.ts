import { describe, it, expect } from "vitest";
import { scoreTrtQuiz } from "@/lib/trt-quiz";

describe("scoreTrtQuiz", () => {
  it("banda baja con pocos síntomas marcados", () => {
    const r = scoreTrtQuiz([true, true, false, false, false, false, false, false]);
    expect(r.score).toBe(2);
    expect(r.band).toBe("bajo");
  });

  it("banda media con síntomas intermedios", () => {
    const r = scoreTrtQuiz([true, true, true, true, false, false, false, false]);
    expect(r.score).toBe(4);
    expect(r.band).toBe("medio");
  });

  it("banda alta con la mayoría de síntomas marcados", () => {
    const r = scoreTrtQuiz([true, true, true, true, true, true, true, false]);
    expect(r.score).toBe(7);
    expect(r.band).toBe("alto");
  });

  it("sin ningún síntoma marcado da score 0 y banda baja", () => {
    const r = scoreTrtQuiz(new Array(8).fill(false));
    expect(r.score).toBe(0);
    expect(r.band).toBe("bajo");
  });
});
