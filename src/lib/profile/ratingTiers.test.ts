import { describe, expect, it } from "vitest";
import {
  getPointsUntilNextLabel,
  getRatingTier,
  getTowardNextLabel,
  normalizeRating,
} from "./ratingTiers";

describe("normalizeRating", () => {
  it("defaults missing to 1000 and clamps negatives", () => {
    expect(normalizeRating(undefined)).toBe(1000);
    expect(normalizeRating(null)).toBe(1000);
    expect(normalizeRating(-50)).toBe(0);
  });
});

describe("getRatingTier", () => {
  it("maps 1042 to Prospect with 42% progress toward Contender", () => {
    const tier = getRatingTier(1042);
    expect(tier.currentTierName).toBe("PROSPECT");
    expect(tier.currentTierMin).toBe(1000);
    expect(tier.currentTierMax).toBe(1099);
    expect(tier.nextTierName).toBe("CONTENDER");
    expect(tier.pointsIntoTier).toBe(42);
    expect(tier.pointsToNextTier).toBe(58);
    expect(tier.progressPercent).toBe(42);
    expect(tier.isMaxTier).toBe(false);
  });

  it("maps 1088 to Prospect at 88% with 12 points to Contender", () => {
    const tier = getRatingTier(1088);
    expect(tier.pointsIntoTier).toBe(88);
    expect(tier.pointsToNextTier).toBe(12);
    expect(tier.progressPercent).toBe(88);
  });

  it("maps 1100 to Contender at tier start", () => {
    const tier = getRatingTier(1100);
    expect(tier.currentTierName).toBe("CONTENDER");
    expect(tier.pointsIntoTier).toBe(0);
    expect(tier.pointsToNextTier).toBe(150);
    expect(tier.progressPercent).toBe(0);
  });

  it("maps 1520 to Champion progressing toward Hall of Fame", () => {
    const tier = getRatingTier(1520);
    expect(tier.currentTierName).toBe("CHAMPION");
    expect(tier.nextTierName).toBe("HALL OF FAME");
    expect(tier.pointsIntoTier).toBe(20);
    expect(tier.pointsToNextTier).toBe(280);
    expect(tier.tierSpan).toBe(300);
  });

  it("maps 1800+ to max tier", () => {
    const tier = getRatingTier(1900);
    expect(tier.currentTierName).toBe("HALL OF FAME");
    expect(tier.isMaxTier).toBe(true);
    expect(tier.progressPercent).toBe(100);
    expect(tier.pointsToNextTier).toBe(0);
  });
});

describe("tier labels", () => {
  it("uses clear human-readable copy", () => {
    const tier = getRatingTier(1042);
    expect(getPointsUntilNextLabel(tier)).toBe("58 points until Contender");
    expect(getTowardNextLabel(tier)).toBe("42 / 100 toward Contender");
    expect(getPointsUntilNextLabel(getRatingTier(1900))).toBe(
      "Maximum tier reached"
    );
  });
});
