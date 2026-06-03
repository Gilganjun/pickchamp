import {
  GLOBAL_RANK_ELIGIBILITY,
  SPORT_RANK_ELIGIBILITY,
} from "@/lib/rating/constants";
import type { Profile, RankDisplay, RankingTab } from "@/types";

export function getGradedCount(
  profile: Profile,
  tab: RankingTab
): number {
  if (tab === "global") {
    return profile.boxing_picks + profile.mma_picks;
  }
  if (tab === "boxing") return profile.boxing_picks;
  return profile.mma_picks;
}

export function getRating(profile: Profile, tab: RankingTab): number {
  if (tab === "global") return profile.global_rating;
  if (tab === "boxing") return profile.boxing_rating;
  return profile.mma_rating;
}

export function getAccuracy(profile: Profile, tab: RankingTab): number {
  let picks = 0;
  let correct = 0;
  if (tab === "global") {
    picks = profile.boxing_picks + profile.mma_picks;
    correct = profile.boxing_correct + profile.mma_correct;
  } else if (tab === "boxing") {
    picks = profile.boxing_picks;
    correct = profile.boxing_correct;
  } else {
    picks = profile.mma_picks;
    correct = profile.mma_correct;
  }
  if (picks === 0) return 0;
  return Math.round((correct / picks) * 1000) / 10;
}

export function isEligibleForOfficialRank(
  profile: Profile,
  tab: RankingTab
): boolean {
  const graded = getGradedCount(profile, tab);
  const threshold =
    tab === "global" ? GLOBAL_RANK_ELIGIBILITY : SPORT_RANK_ELIGIBILITY;
  return graded >= threshold;
}

export function getRankDisplay(
  profile: Profile,
  tab: RankingTab,
  officialRank?: number
): RankDisplay {
  const graded = getGradedCount(profile, tab);
  const threshold =
    tab === "global" ? GLOBAL_RANK_ELIGIBILITY : SPORT_RANK_ELIGIBILITY;
  const label =
    tab === "global"
      ? "Global Rank"
      : tab === "boxing"
        ? "Boxing Rank"
        : "MMA Rank";

  if (graded === 0) {
    return { label, status: "inactive" };
  }
  if (graded < threshold) {
    return {
      label,
      status: "provisional",
      progress: `${graded} / ${threshold} picks completed`,
    };
  }
  return {
    label,
    status: "official",
    rank: officialRank,
  };
}

export function sortLeaderboard(
  profiles: Profile[],
  tab: RankingTab
): Profile[] {
  const eligible = profiles.filter((p) => isEligibleForOfficialRank(p, tab));

  return [...eligible].sort((a, b) => {
    const ratingDiff = getRating(b, tab) - getRating(a, tab);
    if (ratingDiff !== 0) return ratingDiff;

    const gradedDiff = getGradedCount(b, tab) - getGradedCount(a, tab);
    if (gradedDiff !== 0) return gradedDiff;

    const accDiff = getAccuracy(b, tab) - getAccuracy(a, tab);
    if (accDiff !== 0) return accDiff;

    return a.username.localeCompare(b.username);
  });
}

export function assignOfficialRanks(
  sorted: Profile[]
): Map<string, number> {
  const map = new Map<string, number>();
  sorted.forEach((p, i) => map.set(p.id, i + 1));
  return map;
}
