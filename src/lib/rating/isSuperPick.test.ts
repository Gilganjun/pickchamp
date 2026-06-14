import { describe, expect, it } from "vitest";
import { evaluateSuperPick } from "@/lib/rating/isSuperPick";

describe("evaluateSuperPick", () => {
  it("qualifies on heavy-underdog finish with exact round", () => {
    expect(
      evaluateSuperPick({
        effectiveTier: "heavy_underdog",
        mainCorrect: true,
        methodCorrect: true,
        roundCorrect: true,
        predictedMethod: "ko_tko",
        resultMethod: "ko_tko",
      })
    ).toBe(true);
  });

  it("qualifies on heavy-underdog decision without round", () => {
    expect(
      evaluateSuperPick({
        effectiveTier: "heavy_underdog",
        mainCorrect: true,
        methodCorrect: true,
        roundCorrect: null,
        predictedMethod: "decision",
        resultMethod: "decision",
      })
    ).toBe(true);
  });

  it("rejects non-heavy-underdog tiers", () => {
    expect(
      evaluateSuperPick({
        effectiveTier: "underdog",
        mainCorrect: true,
        methodCorrect: true,
        roundCorrect: true,
        predictedMethod: "ko_tko",
        resultMethod: "ko_tko",
      })
    ).toBe(false);
  });

  it("rejects wrong method on finish", () => {
    expect(
      evaluateSuperPick({
        effectiveTier: "heavy_underdog",
        mainCorrect: true,
        methodCorrect: false,
        roundCorrect: true,
        predictedMethod: "ko_tko",
        resultMethod: "submission",
      })
    ).toBe(false);
  });

  it("rejects wrong round on finish", () => {
    expect(
      evaluateSuperPick({
        effectiveTier: "heavy_underdog",
        mainCorrect: true,
        methodCorrect: true,
        roundCorrect: false,
        predictedMethod: "ko_tko",
        resultMethod: "ko_tko",
      })
    ).toBe(false);
  });
});
