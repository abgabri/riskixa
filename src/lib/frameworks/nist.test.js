import { describe, expect, test } from "bun:test";
import { NIST } from "./nist";

describe("NIST CSF 2.0 assessment coverage", () => {
  test("covers six functions", () => {
    expect(NIST.domains.length).toBe(6);
  });

  test("contains 22 questions", () => {
    expect(NIST.domains.flatMap((domain) => domain.questions).length).toBe(22);
  });

  test("allocates 4, 4, 4, 3, 4, and 3 questions across the functions", () => {
    expect(NIST.domains.map((domain) => domain.questions.length)).toEqual([4, 4, 4, 3, 4, 3]);
  });

  test("keeps separate answer identities for questions sharing category references", () => {
    const questions = NIST.domains.flatMap((domain) => domain.questions);
    expect(new Set(questions.map((question) => question.id)).size).toBe(22);
    expect(questions.filter((question) => question.ref === "ID.RA").length).toBe(2);
    expect(questions.filter((question) => question.ref === "DE.AE").length).toBe(2);
    expect(questions.filter((question) => question.ref === "RC.RP").length).toBe(2);
  });
});