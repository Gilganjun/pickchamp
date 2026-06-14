"use server";

import { MOCK_USER_ID } from "@/data/mock";
import { getAuthUser } from "@/lib/auth/session";
import {
  getSuperPickMotivationLine,
  type SuperPickMotivation,
} from "@/lib/brand/rankingsPointsHelp";
import { getSeedRankingsTarget, usesLiveSupabase } from "@/lib/config";
import {
  getCurrentUserProfile,
  getLeaderboard,
  getProfileRanks,
} from "@/lib/data/profiles";
import {
  getEligibilityThreshold,
  getGradedCount,
  getRating,
  isEligibleForOfficialRank,
} from "@/lib/rankings";
import {
  getGapToTop10Score,
  type RankingsUserContext,
} from "@/lib/rankings/rankingsDisplay";
import type { RankingTab } from "@/types";

export async function loadLeaderboardAction(tab: RankingTab) {
  return getLeaderboard(tab);
}

export async function getRankingsUserContextAction(
  tab: RankingTab
): Promise<RankingsUserContext> {
  const threshold = getEligibilityThreshold(tab);
  const demoMode = !usesLiveSupabase();
  const user = demoMode ? null : await getAuthUser();
  const userId = demoMode ? MOCK_USER_ID : user?.id;

  if (!userId) {
    return { state: "guest" };
  }

  const profile = await getCurrentUserProfile(userId);
  if (!profile) {
    return { state: "guest" };
  }

  const gradedCount = getGradedCount(profile, tab);
  if (!isEligibleForOfficialRank(profile, tab)) {
    return {
      state: "provisional",
      userId: profile.id,
      picksRemaining: Math.max(0, threshold - gradedCount),
      tab,
    };
  }

  const [ranks, leaderboard] = await Promise.all([
    getProfileRanks(profile),
    getLeaderboard(tab),
  ]);

  const rankDisplay =
    tab === "global" ? ranks.global : tab === "boxing" ? ranks.boxing : ranks.mma;

  if (rankDisplay.status !== "official" || rankDisplay.rank == null) {
    return {
      state: "provisional",
      userId: profile.id,
      picksRemaining: Math.max(0, threshold - gradedCount),
      tab,
    };
  }

  const officialRank = rankDisplay.rank;
  const score = getRating(profile, tab);
  const top10Cutoff = getSeedRankingsTarget();

  if (officialRank <= top10Cutoff) {
    return {
      state: "official_inside",
      userId: profile.id,
      officialRank,
      score,
    };
  }

  const tenthPlaceScore = leaderboard[9]?.rating;
  const gapToTop10 = getGapToTop10Score(score, tenthPlaceScore);

  return {
    state: "official_outside",
    userId: profile.id,
    officialRank,
    score,
    gapToTop10,
  };
}

/** @deprecated Use getRankingsUserContextAction for graded eligibility. */
export async function getRankingsPickProgressAction(tab: RankingTab): Promise<{
  pickCount: number;
  threshold: number;
}> {
  const threshold = getEligibilityThreshold(tab);
  const context = await getRankingsUserContextAction(tab);
  if (context.state === "provisional") {
    return {
      pickCount: threshold - context.picksRemaining,
      threshold,
    };
  }
  if (context.state === "guest") {
    return { pickCount: 0, threshold };
  }
  const profile = await getCurrentUserProfile(context.userId);
  if (!profile) return { pickCount: 0, threshold };
  return { pickCount: getGradedCount(profile, tab), threshold };
}

export interface RankingsPointsHelpContext {
  motivation: SuperPickMotivation;
}

/** Global leaderboard context for the scoring help modal (tab-independent). */
export async function getRankingsPointsHelpContextAction(): Promise<RankingsPointsHelpContext> {
  const top10Target = getSeedRankingsTarget();
  const globalLeaderboard = await getLeaderboard("global");
  const hasFullLeaderboard = globalLeaderboard.length >= top10Target;
  const firstPlaceScore = globalLeaderboard[0]?.rating;
  const tenthPlaceScore = globalLeaderboard[9]?.rating;

  const demoMode = !usesLiveSupabase();
  const user = demoMode ? null : await getAuthUser();
  const userId = demoMode ? MOCK_USER_ID : user?.id;

  if (!userId) {
    return {
      motivation: getSuperPickMotivationLine({
        hasFullLeaderboard,
        isGuest: true,
        globalOfficialRank: null,
        userGlobalScore: 0,
        userGlobalGradedPickCount: 0,
        firstPlaceScore,
        tenthPlaceScore,
      }),
    };
  }

  const profile = await getCurrentUserProfile(userId);
  if (!profile) {
    return {
      motivation: getSuperPickMotivationLine({
        hasFullLeaderboard,
        isGuest: true,
        globalOfficialRank: null,
        userGlobalScore: 0,
        userGlobalGradedPickCount: 0,
        firstPlaceScore,
        tenthPlaceScore,
      }),
    };
  }

  let globalOfficialRank: number | null = null;
  if (isEligibleForOfficialRank(profile, "global")) {
    const ranks = await getProfileRanks(profile);
    if (ranks.global.status === "official" && ranks.global.rank != null) {
      globalOfficialRank = ranks.global.rank;
    }
  }

  return {
    motivation: getSuperPickMotivationLine({
      hasFullLeaderboard,
      isGuest: false,
      globalOfficialRank,
      userGlobalScore: profile.global_rating,
      userGlobalGradedPickCount: getGradedCount(profile, "global"),
      firstPlaceScore,
      tenthPlaceScore,
    }),
  };
}
