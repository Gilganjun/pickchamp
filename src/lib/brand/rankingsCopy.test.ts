import { describe, expect, it } from "vitest";
import {
  getRankingsEmptyMessage,
  getRankingsPickGoalCopy,
  getRankingsWorldRankingLabel,
} from "./rankingsCopy";

describe("rankingsCopy", () => {
  it("labels world rankings by tab", () => {
    expect(getRankingsWorldRankingLabel("global")).toBe("World Ranking");
    expect(getRankingsWorldRankingLabel("boxing")).toBe("Boxing World Ranking");
    expect(getRankingsWorldRankingLabel("mma")).toBe("MMA World Ranking");
  });

  it("uses full count for new users", () => {
    expect(getRankingsPickGoalCopy("global", 0, 10)).toEqual({
      count: 10,
      useMore: false,
      rankingLabel: "World Ranking",
      showGoal: true,
    });
  });

  it("uses remaining count when user already has picks", () => {
    expect(getRankingsPickGoalCopy("global", 5, 10)).toEqual({
      count: 5,
      useMore: true,
      rankingLabel: "World Ranking",
      showGoal: true,
    });
  });

  it("hides goal when threshold is met", () => {
    expect(getRankingsPickGoalCopy("boxing", 5, 5)).toEqual({
      count: 0,
      useMore: true,
      rankingLabel: "Boxing World Ranking",
      showGoal: false,
    });
  });

  it("uses empty state without unlock language", () => {
    const message = getRankingsEmptyMessage();
    expect(message.toLowerCase()).not.toContain("unlock");
    expect(message).toContain("results");
  });
});
