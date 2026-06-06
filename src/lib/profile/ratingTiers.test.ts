import { describe, expect, it } from "vitest";
import {
  getPickFistScoreDisplay,
  getPointsToNextRankLabel,
  getPointsUntilNextLabel,
  getRatingTier,
  getTierProgressFractionLabel,
  getTierProgressPercentLabel,
  getTowardNextLabel,
  normalizeRating,
} from "./ratingTiers";

describe("normalizeRating", () => {
  it("defaults missing to 1000 and clamps negatives to Novice band", () => {
    expect(normalizeRating(undefined)).toBe(1000);
    expect(normalizeRating(null)).toBe(1000);
    expect(normalizeRating(-50)).toBe(0);
    expect(getRatingTier(-50).currentTierName).toBe("NOVICE");
  });
});

describe("display rank ladder thresholds", () => {
  const cases: [number, string][] = [
    [999, "NOVICE"],
    [1000, "ROOKIE"],
    [1049, "ROOKIE"],
    [1050, "PROSPECT"],
    [1099, "PROSPECT"],
    [1100, "CONTENDER"],
    [1150, "#1 CONTENDER"],
    [1200, "TITLE CHALLENGER"],
    [1250, "WORLD TITLE CHALLENGER"],
    [1300, "CHAMPION"],
    [1400, "UNIFIED CHAMPION"],
    [1500, "UNDISPUTED CHAMPION"],
    [1650, "HALL OF FAME"],
    [1800, "ALL-TIME GREAT"],
    [1900, "ALL-TIME GREAT"],
  ];

  it.each(cases)("rating %i maps to %s", (rating, expected) => {
    expect(getRatingTier(rating).currentTierName).toBe(expected);
  });
});

describe("tier progress within rank bands", () => {
  it("maps 1042 to Rookie with progress toward Prospect", () => {
    const tier = getRatingTier(1042);
    expect(tier.currentTierName).toBe("ROOKIE");
    expect(tier.currentTierMin).toBe(1000);
    expect(tier.currentTierMax).toBe(1049);
    expect(tier.nextTierName).toBe("PROSPECT");
    expect(tier.pointsIntoTier).toBe(42);
    expect(tier.pointsToNextTier).toBe(8);
    expect(tier.progressPercent).toBe(84);
    expect(tier.tierSpan).toBe(50);
    expect(tier.rawRating).toBe(1042);
    expect(tier.isMaxTier).toBe(false);
  });

  it("resets progress at Contender threshold", () => {
    const prospectTop = getRatingTier(1099);
    expect(prospectTop.currentTierName).toBe("PROSPECT");
    expect(prospectTop.progressPercent).toBe(98);
    expect(prospectTop.pointsToNextTier).toBe(1);

    const contenderStart = getRatingTier(1100);
    expect(contenderStart.currentTierName).toBe("CONTENDER");
    expect(contenderStart.pointsIntoTier).toBe(0);
    expect(contenderStart.progressPercent).toBe(0);
    expect(contenderStart.nextTierName).toBe("#1 CONTENDER");
    expect(contenderStart.pointsToNextTier).toBe(50);
  });

  it("maps max tier with full progress", () => {
    const tier = getRatingTier(1900);
    expect(tier.currentTierName).toBe("ALL-TIME GREAT");
    expect(tier.isMaxTier).toBe(true);
    expect(tier.progressPercent).toBe(100);
    expect(tier.pointsToNextTier).toBe(0);
    expect(tier.nextTierName).toBeNull();
  });

  it("never returns NaN progress", () => {
    for (const rating of [0, 500, 1000, 1042, 1100, 1500, 1800, 2500]) {
      const tier = getRatingTier(rating);
      expect(Number.isNaN(tier.progressPercent)).toBe(false);
      expect(tier.progressPercent).toBeGreaterThanOrEqual(0);
      expect(tier.progressPercent).toBeLessThanOrEqual(100);
    }
  });
});

describe("tier labels", () => {
  it("uses display rank copy with next rank name", () => {
    const tier = getRatingTier(1042);
    expect(getPointsUntilNextLabel(tier)).toBe("8 pts to PROSPECT");
    expect(getTowardNextLabel(tier)).toBe("42 / 50 to PROSPECT");
    expect(getTierProgressPercentLabel(tier)).toBe("84% to PROSPECT");
    expect(getTierProgressFractionLabel(tier)).toBe("42 / 50 to PROSPECT");
    expect(getPointsUntilNextLabel(getRatingTier(1900))).toBe(
      "Maximum rank reached"
    );
  });

  it("formats PickFist score and points-to-next copy", () => {
    const tier = getRatingTier(1042);
    expect(getPickFistScoreDisplay(tier)).toBe("42 / 50");
    expect(getPointsToNextRankLabel(tier)).toBe("8 points to PROSPECT");
    expect(getPickFistScoreDisplay(getRatingTier(1900))).toBe("100 / 100");
  });
});
