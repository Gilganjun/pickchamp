import { describe, expect, it } from "vitest";
import {
  BOXING_RANK_ELIGIBILITY,
  GLOBAL_RANK_ELIGIBILITY,
  MMA_RANK_ELIGIBILITY,
} from "@/lib/rating/constants";
import {
  getEligibilityThreshold,
  isEligibleForOfficialRank,
} from "@/lib/rankings";
import type { Profile } from "@/types";

function makeProfile(
  overrides: Partial<Profile> & Pick<Profile, "id" | "username">
): Profile {
  return {
    display_name: null,
    avatar_initials: "PF",
    global_rating: 1000,
    boxing_rating: 1000,
    mma_rating: 1000,
    total_picks: 0,
    total_correct: 0,
    boxing_picks: 0,
    boxing_correct: 0,
    mma_picks: 0,
    mma_correct: 0,
    perfect_picks: 0,
    current_streak: 0,
    best_streak: 0,
    is_admin: false,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("ranking qualification thresholds", () => {
  it("uses launch constants", () => {
    expect(GLOBAL_RANK_ELIGIBILITY).toBe(10);
    expect(BOXING_RANK_ELIGIBILITY).toBe(5);
    expect(MMA_RANK_ELIGIBILITY).toBe(5);
    expect(getEligibilityThreshold("global")).toBe(10);
    expect(getEligibilityThreshold("boxing")).toBe(5);
    expect(getEligibilityThreshold("mma")).toBe(5);
  });

  it("qualifies boxing-only users for global and boxing leaderboards", () => {
    const profile = makeProfile({
      id: "a",
      username: "boxer",
      boxing_picks: 10,
      boxing_correct: 6,
      mma_picks: 0,
    });

    expect(isEligibleForOfficialRank(profile, "global")).toBe(true);
    expect(isEligibleForOfficialRank(profile, "boxing")).toBe(true);
    expect(isEligibleForOfficialRank(profile, "mma")).toBe(false);
  });

  it("qualifies MMA-only users for global and MMA leaderboards", () => {
    const profile = makeProfile({
      id: "b",
      username: "mmafan",
      boxing_picks: 0,
      mma_picks: 10,
      mma_correct: 7,
    });

    expect(isEligibleForOfficialRank(profile, "global")).toBe(true);
    expect(isEligibleForOfficialRank(profile, "boxing")).toBe(false);
    expect(isEligibleForOfficialRank(profile, "mma")).toBe(true);
  });

  it("qualifies mixed-sport users when combined picks reach the global threshold", () => {
    const profile = makeProfile({
      id: "c",
      username: "mixed",
      boxing_picks: 6,
      mma_picks: 4,
    });

    expect(isEligibleForOfficialRank(profile, "global")).toBe(true);
    expect(isEligibleForOfficialRank(profile, "boxing")).toBe(true);
    expect(isEligibleForOfficialRank(profile, "mma")).toBe(false);
  });

  it("keeps users below threshold not yet qualified", () => {
    const profile = makeProfile({
      id: "d",
      username: "newbie",
      boxing_picks: 4,
      mma_picks: 0,
    });

    expect(isEligibleForOfficialRank(profile, "global")).toBe(false);
    expect(isEligibleForOfficialRank(profile, "boxing")).toBe(false);
    expect(isEligibleForOfficialRank(profile, "mma")).toBe(false);
  });
});
