import type { RatingTierInfo } from "@/lib/profile/ratingTiers";
import { formatTierDisplayName } from "@/lib/profile/ratingTiers";
import type { RankingTab } from "@/types";

export type PodiumVariant = "gold" | "silver" | "bronze";

export type RankingsUserState =
  | "guest"
  | "provisional"
  | "official_outside"
  | "official_inside";

export function formatPickFistScore(rating: number): string {
  return rating.toLocaleString();
}

export function getPodiumVariant(rank: number): PodiumVariant | null {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return null;
}

export function getPointsToNextTierLabel(tier: RatingTierInfo): string | null {
  if (tier.isMaxTier || !tier.nextTierName) return null;
  const next = formatTierDisplayName(tier.nextTierName);
  return `${tier.pointsToNextTier} pts to ${next}`;
}

/** Rating points needed to reach the displayed #10 slot (0 if already at/above). */
export function getGapToTop10Score(
  userScore: number,
  tenthPlaceScore: number | undefined
): number | null {
  if (tenthPlaceScore == null) return null;
  const gap = tenthPlaceScore - userScore;
  return gap <= 0 ? 0 : gap;
}

export function getQualificationLabel(tab: RankingTab): string {
  if (tab === "boxing") return "Boxing Rankings";
  if (tab === "mma") return "MMA Rankings";
  return "Global Rankings";
}

export function formatGradedPicksRemaining(
  remaining: number,
  tab: RankingTab
): string {
  const rankingLabel = getQualificationLabel(tab);
  const pickWord = remaining === 1 ? "graded pick" : "graded picks";
  return `${remaining} more ${pickWord} to enter the ${rankingLabel}`;
}

export type RankingsCtaVariant =
  | "guest"
  | "provisional"
  | "climb"
  | "defend";

export function getRankingsCtaCopy(variant: RankingsCtaVariant): {
  headline: string;
  body: string;
  button: string;
  href: string;
} {
  switch (variant) {
    case "guest":
      return {
        headline: "Join the rankings",
        body: "Make picks and climb the world rankings.",
        button: "Sign up & make picks",
        href: "/signup",
      };
    case "provisional":
      return {
        headline: "Qualify for the rankings",
        body: "Make picks and get graded results to earn your world rank.",
        button: "Make picks",
        href: "/picks",
      };
    case "climb":
      return {
        headline: "Climb the rankings",
        body: "Every pick brings you closer to the Top 10.",
        button: "Make picks",
        href: "/picks",
      };
    case "defend":
      return {
        headline: "Defend your position",
        body: "Make your next picks.",
        button: "Make picks",
        href: "/picks",
      };
  }
}

export function getRankingsCtaVariant(
  userState: RankingsUserState
): RankingsCtaVariant {
  if (userState === "guest") return "guest";
  if (userState === "provisional") return "provisional";
  if (userState === "official_inside") return "defend";
  return "climb";
}

export type RankingsUserContext =
  | { state: "guest" }
  | {
      state: "provisional";
      userId: string;
      picksRemaining: number;
      tab: RankingTab;
    }
  | {
      state: "official_outside";
      userId: string;
      officialRank: number;
      score: number;
      gapToTop10: number | null;
    }
  | {
      state: "official_inside";
      userId: string;
      officialRank: number;
      score: number;
    };

export function getUserStateFromContext(
  context: RankingsUserContext
): RankingsUserState {
  return context.state;
}
