import { getMockProfiles, MOCK_USER_ID } from "@/data/mock";
import { usesLiveSupabase } from "@/lib/config";
import { ensureSettledFightsGraded } from "@/lib/grading/ensureSettledFightsGraded";
import {
  fetchAllProfiles,
  fetchProfileById,
  fetchProfileByUsername,
} from "@/lib/data/supabase-fetch";
import {
  assignOfficialRanks,
  getRankDisplay,
  sortLeaderboard,
} from "@/lib/rankings";
import type { Profile, RankingTab } from "@/types";

export async function getAllProfiles(): Promise<Profile[]> {
  if (usesLiveSupabase()) {
    return fetchAllProfiles();
  }
  return getMockProfiles();
}

export async function getProfileByUsername(
  username: string
): Promise<Profile | null> {
  if (usesLiveSupabase()) {
    return fetchProfileByUsername(username);
  }
  const profiles = await getAllProfiles();
  return profiles.find((p) => p.username === username) ?? null;
}

export async function getCurrentUserProfile(
  userId?: string
): Promise<Profile | null> {
  const id = userId ?? MOCK_USER_ID;
  if (usesLiveSupabase()) {
    if (!userId) return null;
    await ensureSettledFightsGraded();
    return fetchProfileById(userId);
  }
  await ensureSettledFightsGraded();
  const profiles = await getAllProfiles();
  return profiles.find((p) => p.id === id) ?? null;
}

export async function getLeaderboard(tab: RankingTab): Promise<
  Array<{
    profile: Profile;
    rank: number;
    rating: number;
    accuracy: number;
    picks: number;
  }>
> {
  const profiles = await getAllProfiles();
  const sorted = sortLeaderboard(profiles, tab);
  const ranks = assignOfficialRanks(sorted);

  return sorted.map((profile) => ({
    profile,
    rank: ranks.get(profile.id) ?? 0,
    rating:
      tab === "global"
        ? profile.global_rating
        : tab === "boxing"
          ? profile.boxing_rating
          : profile.mma_rating,
    accuracy:
      tab === "global"
        ? profile.total_picks > 0
          ? Math.round(
              ((profile.total_correct /
                (profile.boxing_picks + profile.mma_picks)) *
                1000)
            ) / 10
          : 0
        : tab === "boxing"
          ? profile.boxing_picks > 0
            ? Math.round(
                (profile.boxing_correct / profile.boxing_picks) * 1000
              ) / 10
            : 0
          : profile.mma_picks > 0
            ? Math.round((profile.mma_correct / profile.mma_picks) * 1000) / 10
            : 0,
    picks:
      tab === "global"
        ? profile.boxing_picks + profile.mma_picks
        : tab === "boxing"
          ? profile.boxing_picks
          : profile.mma_picks,
  }));
}

export async function getProfileRanks(profile: Profile): Promise<{
  global: ReturnType<typeof getRankDisplay>;
  boxing: ReturnType<typeof getRankDisplay>;
  mma: ReturnType<typeof getRankDisplay>;
}> {
  const all = await getAllProfiles();
  const globalSorted = sortLeaderboard(all, "global");
  const boxingSorted = sortLeaderboard(all, "boxing");
  const mmaSorted = sortLeaderboard(all, "mma");
  const globalRanks = assignOfficialRanks(globalSorted);
  const boxingRanks = assignOfficialRanks(boxingSorted);
  const mmaRanks = assignOfficialRanks(mmaSorted);

  return {
    global: getRankDisplay(
      profile,
      "global",
      globalRanks.get(profile.id)
    ),
    boxing: getRankDisplay(
      profile,
      "boxing",
      boxingRanks.get(profile.id)
    ),
    mma: getRankDisplay(profile, "mma", mmaRanks.get(profile.id)),
  };
}
