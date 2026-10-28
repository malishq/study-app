import { describe, expect, it } from "vitest";
import { brsCourses, brsSummary, formatScore, groupItems, hasBrs, hasScores, isPassing, resultTone, scoreRatio } from "./brs";
import { demoPayload } from "./demo";
import type { BrsItem, Course } from "./types";

const payload = demoPayload(new Date(2026, 9, 28, 9, 30));

function brsItem(name: string, category: string): BrsItem {
  return { name, category, kind: "assign", score: null, max: 10, url: "" };
}

describe("brs", () => {
  it("formats scores with a decimal comma", () => {
    expect(formatScore(7.5)).toBe("7,5");
    expect(formatScore(11)).toBe("11");
    expect(formatScore(17.666)).toBe("17,7");
    expect(formatScore(null)).toBe("—");
  });

  it("clamps the score ratio", () => {
    expect(scoreRatio({ name: "x", score: 18.5, max: 120 })).toBeCloseTo(0.154, 3);
    expect(scoreRatio({ name: "x", score: null, max: 40 })).toBe(0);
    expect(scoreRatio({ name: "x", score: 50, max: 40 })).toBe(1);
    expect(scoreRatio({ name: "x", score: 5, max: 0 })).toBe(0);
  });

  it("reads the SDO result", () => {
    expect(resultTone("Зачтено")).toBe("positive");
    expect(resultTone("Не зачтено")).toBe("neutral");
    expect(resultTone("2 (неудовлетворительно)")).toBe("neutral");
    expect(resultTone("4 (хорошо)")).toBe("positive");
    expect(isPassing("")).toBe(false);
  });

  it("keeps only courses with points", () => {
    const empty: Course = { ...payload.courses[0], brs: { parts: [], total: null, result: "", items: [] } };
    expect(hasBrs(empty)).toBe(false);
    expect(hasBrs({ ...payload.courses[0], brs: null })).toBe(false);
    expect(brsCourses(payload).map((c) => c.short)).toEqual(["Матан", "БД", "ИИ"]);
    const unscored = { parts: [{ name: "Текущий контроль", score: null, max: 100 }], total: { name: "Итог курса", score: null, max: 40 }, result: "", items: [] };
    expect(hasScores(unscored)).toBe(false);
    expect(brsCourses({ ...payload, courses: [{ ...payload.courses[0], brs: unscored }] })).toEqual([]);
    expect(brsSummary(payload)).toEqual({ courses: 3, passed: 1 });
  });

  it("groups items by category and puts uncategorised last", () => {
    const groups = groupItems([brsItem("a", ""), brsItem("b", "Текущий контроль"), brsItem("c", "Текущий контроль"), brsItem("d", "Пересдача")]);
    expect(groups.map((g) => [g.category, g.items.length])).toEqual([["Текущий контроль", 2], ["Пересдача", 1], ["", 1]]);
  });
});
