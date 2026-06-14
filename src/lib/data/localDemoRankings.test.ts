import { beforeEach, describe, expect, it, vi } from "vitest";
import { MOCK_USER_ID } from "@/data/mock";

vi.mock("@/lib/config", () => ({
  usesLiveSupabase: () => false,
  seedRankingsEnabled: () => true,
  getSeedRankingsTarget: () => 10,
}));

vi.mock("@/lib/grading/ensureSettledFightsGraded", () => ({
  ensureSettledFightsGraded: vi.fn(async () => undefined),
}));

import {
  getCurrentUserProfile,
  getLeaderboard,
  getProfileRanks,
} from "./profiles";
import { getSuperPickMotivationLine } from "@/lib/brand/rankingsPointsHelp";

describe("local demo rankings alignment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("places fightfan42 outside Global Top 10 with a full leaderboard", async () => {
    const [profile, leaderboard] = await Promise.all([
      getCurrentUserProfile(MOCK_USER_ID),
      getLeaderboard("global"),
    ]);

    expect(profile).not.toBeNull();
    expect(leaderboard.length).toBeGreaterThanOrEqual(10);

    const ranks = await getProfileRanks(profile!);
    expect(ranks.global.status).toBe("official");
    expect(ranks.global.rank).toBeGreaterThan(10);

    const userRow = leaderboard.find((row) => row.profile.id === MOCK_USER_ID);
    expect(userRow).toBeDefined();
    expect(userRow!.rank).toBe(ranks.global.rank);
    expect(userRow!.rating).toBe(profile!.global_rating);

    const tenthPlaceScore = leaderboard[9]?.rating;
    const motivation = getSuperPickMotivationLine({
      hasFullLeaderboard: leaderboard.length >= 10,
      isGuest: false,
      globalOfficialRank: ranks.global.rank ?? null,
      userGlobalScore: profile!.global_rating,
      userGlobalGradedPickCount: profile!.total_picks,
      firstPlaceScore: leaderboard[0]?.rating,
      tenthPlaceScore,
    });

    expect(motivation.variant).toBe("to_top_10");
    expect(motivation.superPickCount).toBeGreaterThanOrEqual(1);
    expect(motivation.line).toMatch(/World Top 10/);
  });
});
