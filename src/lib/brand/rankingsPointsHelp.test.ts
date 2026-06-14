import { describe, expect, it } from "vitest";
import {
  getScoreGapToExceed,
  getSuperPickMotivationLine,
  getSuperPicksNeededForScoreGap,
  SUPER_PICK_MOTIVATION_NEUTRAL,
  SUPER_PICK_MOTIVATION_WORLD_NUMBER_ONE,
} from "@/lib/brand/rankingsPointsHelp";

const fullBoard = {
  hasFullLeaderboard: true,
  isGuest: false,
  firstPlaceScore: 1065,
  tenthPlaceScore: 1008,
} as const;

describe("rankingsPointsHelp", () => {
  it("uses +1 when calculating score gap to exceed a target", () => {
    expect(getScoreGapToExceed(1008, 1000)).toBe(9);
    expect(getScoreGapToExceed(1008, 1008)).toBe(1);
    expect(getScoreGapToExceed(1008, 1010)).toBe(0);
  });

  it("converts score gaps into Super Pick counts", () => {
    expect(getSuperPicksNeededForScoreGap(75)).toBe(1);
    expect(getSuperPicksNeededForScoreGap(76)).toBe(2);
    expect(getSuperPicksNeededForScoreGap(0)).toBe(0);
  });

  it("shows neutral copy for guests", () => {
    const result = getSuperPickMotivationLine({
      ...fullBoard,
      isGuest: true,
      globalOfficialRank: null,
      userGlobalScore: 1040,
      userGlobalGradedPickCount: 12,
    });
    expect(result.variant).toBe("neutral");
    expect(result.line).toBe(SUPER_PICK_MOTIVATION_NEUTRAL);
  });

  it("shows neutral copy when fewer than 10 leaderboard rows exist", () => {
    const result = getSuperPickMotivationLine({
      ...fullBoard,
      hasFullLeaderboard: false,
      globalOfficialRank: 5,
      userGlobalScore: 1040,
      userGlobalGradedPickCount: 12,
    });
    expect(result.variant).toBe("neutral");
    expect(result.line).toBe(SUPER_PICK_MOTIVATION_NEUTRAL);
  });

  it("motivates outside Top 10 using score and qualification picks", () => {
    const result = getSuperPickMotivationLine({
      ...fullBoard,
      globalOfficialRank: 15,
      userGlobalScore: 1000,
      userGlobalGradedPickCount: 8,
    });
    expect(result.variant).toBe("to_top_10");
    expect(result.superPickCount).toBe(2);
    expect(result.line).toContain("could take you into the World Top 10");
  });

  it("uses qualification picks for provisional users below the threshold", () => {
    const result = getSuperPickMotivationLine({
      ...fullBoard,
      globalOfficialRank: null,
      userGlobalScore: 1060,
      userGlobalGradedPickCount: 3,
    });
    expect(result.variant).toBe("to_top_10");
    expect(result.superPickCount).toBe(7);
  });

  it("motivates inside Top 10 users toward World #1", () => {
    const result = getSuperPickMotivationLine({
      ...fullBoard,
      globalOfficialRank: 4,
      userGlobalScore: 1040,
      userGlobalGradedPickCount: 20,
    });
    expect(result.variant).toBe("to_number_one");
    expect(result.superPickCount).toBe(1);
    expect(result.line).toContain("could take you to World #1");
  });

  it("shows World #1 copy for the current leader", () => {
    const result = getSuperPickMotivationLine({
      ...fullBoard,
      globalOfficialRank: 1,
      userGlobalScore: 1065,
      userGlobalGradedPickCount: 20,
    });
    expect(result.variant).toBe("world_number_one");
    expect(result.line).toBe(SUPER_PICK_MOTIVATION_WORLD_NUMBER_ONE);
  });

  it("uses could rather than will in motivational lines", () => {
    const result = getSuperPickMotivationLine({
      ...fullBoard,
      globalOfficialRank: 20,
      userGlobalScore: 990,
      userGlobalGradedPickCount: 12,
    });
    expect(result.line).toContain("could");
    expect(result.line).not.toContain("will");
  });
});
