import { describe, expect, it } from "vitest";
import { getRatingTier } from "@/lib/profile/ratingTiers";
import {
  formatGradedPicksRemaining,
  formatPickFistScore,
  getGapToTop10Score,
  getPodiumVariant,
  getPointsToNextTierLabel,
  getRankingsCtaVariant,
} from "@/lib/rankings/rankingsDisplay";

describe("rankingsDisplay", () => {
  it("formats PickFist Score with locale grouping", () => {
    expect(formatPickFistScore(1054)).toMatch(/1[,.\s]?054/);
  });

  it("maps podium variants for top three only", () => {
    expect(getPodiumVariant(1)).toBe("gold");
    expect(getPodiumVariant(2)).toBe("silver");
    expect(getPodiumVariant(3)).toBe("bronze");
    expect(getPodiumVariant(4)).toBeNull();
  });

  it("computes gap to top 10 from scores", () => {
    expect(getGapToTop10Score(1024, 1036)).toBe(12);
    expect(getGapToTop10Score(1040, 1036)).toBe(0);
    expect(getGapToTop10Score(1040, undefined)).toBeNull();
  });

  it("builds tier progress caption for podium cards", () => {
    const tier = getRatingTier(1054);
    const label = getPointsToNextTierLabel(tier);
    expect(label).toMatch(/pts to/);
  });

  it("formats graded picks remaining copy", () => {
    expect(formatGradedPicksRemaining(3, "global")).toBe(
      "3 more graded picks to enter the Global Rankings"
    );
    expect(formatGradedPicksRemaining(1, "mma")).toBe(
      "1 more graded pick to enter the MMA Rankings"
    );
  });

  it("maps user state to CTA variant", () => {
    expect(getRankingsCtaVariant("guest")).toBe("guest");
    expect(getRankingsCtaVariant("provisional")).toBe("provisional");
    expect(getRankingsCtaVariant("official_outside")).toBe("climb");
    expect(getRankingsCtaVariant("official_inside")).toBe("defend");
  });
});
