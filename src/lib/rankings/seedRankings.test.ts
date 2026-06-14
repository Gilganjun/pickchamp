import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SEED_RANKINGS_PROFILES } from "@/data/seedRankingsProfiles";
import {
  getAvailableSeedProfiles,
  mergeProfilesForRankings,
  shouldUseSeedRankings,
} from "@/lib/rankings/seedRankings";
import { isEligibleForOfficialRank, sortLeaderboard } from "@/lib/rankings";
import type { Profile } from "@/types";

function makeRealProfile(
  overrides: Partial<Profile> & Pick<Profile, "id" | "username">
): Profile {
  return {
    display_name: null,
    avatar_initials: "RU",
    global_rating: 1035,
    boxing_rating: 1035,
    mma_rating: 1035,
    total_picks: 10,
    total_correct: 6,
    boxing_picks: 10,
    boxing_correct: 6,
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

describe("seedRankings", () => {
  const env = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...env };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://project.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    process.env.NODE_ENV = "production";
    process.env.PICKFIST_SEED_RANKINGS = "true";
    process.env.PICKFIST_SEED_RANKINGS_TARGET = "10";
  });

  afterEach(() => {
    process.env = env;
  });

  it("is opt-in only when PICKFIST_SEED_RANKINGS=true", () => {
    delete process.env.PICKFIST_SEED_RANKINGS;
    expect(shouldUseSeedRankings()).toBe(false);

    process.env.PICKFIST_SEED_RANKINGS = "false";
    expect(shouldUseSeedRankings()).toBe(false);

    process.env.PICKFIST_SEED_RANKINGS = "true";
    expect(shouldUseSeedRankings()).toBe(true);
  });

  it("fills to ten on global when mock demo users are present", () => {
    const mockDemoUsers = [
      makeRealProfile({
        id: "mock-user-001",
        username: "fightfan42",
        global_rating: 1042,
        boxing_picks: 18,
        boxing_correct: 11,
        mma_picks: 20,
        mma_correct: 11,
        total_picks: 38,
        total_correct: 22,
      }),
      makeRealProfile({
        id: "mock-user-002",
        username: "ko_king",
        global_rating: 1185,
        boxing_picks: 30,
        boxing_correct: 19,
        mma_picks: 32,
        mma_correct: 19,
        total_picks: 62,
        total_correct: 38,
      }),
      makeRealProfile({
        id: "mock-user-003",
        username: "underdog_hunter",
        global_rating: 1098,
        boxing_picks: 12,
        boxing_correct: 6,
        mma_picks: 43,
        mma_correct: 25,
        total_picks: 55,
        total_correct: 31,
      }),
    ];

    const merged = mergeProfilesForRankings(mockDemoUsers, "global");
    const eligible = sortLeaderboard(merged, "global");
    expect(eligible).toHaveLength(10);
  });

  it("keeps seed ratings at or below the catchable maximum", () => {
    for (const seed of SEED_RANKINGS_PROFILES) {
      expect(seed.global_rating).toBeLessThanOrEqual(1075);
      expect(seed.boxing_rating).toBeLessThanOrEqual(1075);
      expect(seed.mma_rating).toBeLessThanOrEqual(1075);
    }
  });

  it("shows ten global seeds when no real users qualify", () => {
    const merged = mergeProfilesForRankings([], "global");
    const eligible = sortLeaderboard(merged, "global");
    expect(eligible).toHaveLength(10);
    expect(eligible.every((profile) => profile.id.startsWith("00000000-0000-4000-b000-"))).toBe(
      true
    );
  });

  it("progressively removes lowest-rated seeds as real users qualify", () => {
    const real = [
      makeRealProfile({
        id: "real-1",
        username: "real_user_1",
        global_rating: 1040,
        boxing_picks: 10,
        boxing_correct: 6,
      }),
    ];

    const merged = mergeProfilesForRankings(real, "global");
    const eligible = sortLeaderboard(merged, "global");

    expect(eligible).toHaveLength(10);
    expect(eligible.some((profile) => profile.id === "real-1")).toBe(true);
    expect(eligible.some((profile) => profile.username === "elenaruiz")).toBe(
      false
    );
  });

  it("shows all genuine users and no seeds once target is met", () => {
    const reals = Array.from({ length: 10 }, (_, index) =>
      makeRealProfile({
        id: `real-${index + 1}`,
        username: `real_user_${index + 1}`,
        global_rating: 1010 + index,
        boxing_picks: 10,
        boxing_correct: 5,
      })
    );

    const merged = mergeProfilesForRankings(reals, "global");
    const eligible = sortLeaderboard(merged, "global");

    expect(eligible).toHaveLength(10);
    expect(
      eligible.every((profile) => !profile.id.startsWith("00000000-0000-4000-b000-"))
    ).toBe(true);
  });

  it("shows more than target genuine users when community exceeds target", () => {
    const reals = Array.from({ length: 15 }, (_, index) =>
      makeRealProfile({
        id: `real-${index + 1}`,
        username: `real_user_${index + 1}`,
        global_rating: 1005 + index,
        boxing_picks: 10,
        boxing_correct: 5,
      })
    );

    const merged = mergeProfilesForRankings(reals, "global");
    const eligible = sortLeaderboard(merged, "global");

    expect(eligible).toHaveLength(15);
  });

  it("excludes seeds when a real profile claims the same username", () => {
    const real = makeRealProfile({
      id: "real-kieran",
      username: "kierancole",
      boxing_picks: 0,
      mma_picks: 0,
      global_rating: 1000,
    });

    const available = getAvailableSeedProfiles([real]);
    expect(available.some((seed) => seed.username === "kierancole")).toBe(false);

    const merged = mergeProfilesForRankings([real], "global");
    const eligible = sortLeaderboard(merged, "global");
    expect(eligible.filter((profile) => profile.username === "kierancole")).toHaveLength(
      0
    );
  });

  it("excludes seeds when a real profile shares the same id", () => {
    const seed = SEED_RANKINGS_PROFILES[0];
    const real = makeRealProfile({
      id: seed.id,
      username: "different_username",
      boxing_picks: 0,
      mma_picks: 0,
    });

    const available = getAvailableSeedProfiles([real]);
    expect(available.some((profile) => profile.id === seed.id)).toBe(false);
  });

  it("shows ten boxing seeds when no real users qualify", () => {
    const merged = mergeProfilesForRankings([], "boxing");
    const eligible = sortLeaderboard(merged, "boxing");
    expect(eligible).toHaveLength(10);
  });

  it("shows ten mma seeds when no real users qualify", () => {
    const merged = mergeProfilesForRankings([], "mma");
    const eligible = sortLeaderboard(merged, "mma");
    expect(eligible).toHaveLength(10);
  });

  it("does not merge when the kill switch is off", () => {
    process.env.PICKFIST_SEED_RANKINGS = "false";
    const merged = mergeProfilesForRankings([], "global");
    expect(merged).toHaveLength(0);
  });

  it("keeps seed profiles internally consistent for graded counts", () => {
    for (const seed of SEED_RANKINGS_PROFILES) {
      expect(seed.total_picks).toBe(seed.boxing_picks + seed.mma_picks);
      expect(seed.total_correct).toBe(seed.boxing_correct + seed.mma_correct);
      expect(seed.boxing_correct).toBeLessThanOrEqual(seed.boxing_picks);
      expect(seed.mma_correct).toBeLessThanOrEqual(seed.mma_picks);
      expect(isEligibleForOfficialRank(seed, "global")).toBe(true);
    }
  });
});
