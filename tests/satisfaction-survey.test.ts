import { describe, it, expect } from "vitest";
import { isSatisfactionSurveyEligible, SATISFACTION_SURVEY_MIN_ACCOUNT_DAYS } from "@/lib/satisfaction-survey";

const NOW = new Date("2026-08-15T12:00:00Z");

function daysAgoIso(days: number) {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

describe("isSatisfactionSurveyEligible", () => {
  it("no es elegible sin fecha de registro", () => {
    expect(isSatisfactionSurveyEligible(null, null, NOW)).toBe(false);
  });

  it("no es elegible si la cuenta es demasiado nueva", () => {
    const createdAt = daysAgoIso(SATISFACTION_SURVEY_MIN_ACCOUNT_DAYS - 1);
    expect(isSatisfactionSurveyEligible(createdAt, null, NOW)).toBe(false);
  });

  it("es elegible justo al cumplir la antigüedad mínima sin haberse mostrado antes", () => {
    const createdAt = daysAgoIso(SATISFACTION_SURVEY_MIN_ACCOUNT_DAYS);
    expect(isSatisfactionSurveyEligible(createdAt, null, NOW)).toBe(true);
  });

  it("no es elegible si ya se mostró hace menos de un mes", () => {
    const createdAt = daysAgoIso(60);
    const lastShownAt = daysAgoIso(10);
    expect(isSatisfactionSurveyEligible(createdAt, lastShownAt, NOW)).toBe(false);
  });

  it("vuelve a ser elegible pasado un mes desde la última vez mostrada", () => {
    const createdAt = daysAgoIso(60);
    const lastShownAt = daysAgoIso(31);
    expect(isSatisfactionSurveyEligible(createdAt, lastShownAt, NOW)).toBe(true);
  });

  it("cuenta antigua nunca mostrada es elegible", () => {
    const createdAt = daysAgoIso(400);
    expect(isSatisfactionSurveyEligible(createdAt, null, NOW)).toBe(true);
  });
});
