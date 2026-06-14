import {
  DEFAULT_RATING,
  GLOBAL_RANK_ELIGIBILITY,
  SUPER_PICK_POINTS,
} from "@/lib/rating/constants";
import { formatRatingPoints } from "@/lib/rating/getPickPotential";

export const RANKINGS_POINTS_HELP_TITLE = "How PickFist Score works";

export const RANKINGS_POINTS_HELP_TRIGGER = "How scoring works";

export const RANKINGS_POINTS_HELP_BODY = [
  `Everyone starts with ${DEFAULT_RATING.toLocaleString()} points.`,
  "Pick right, climb higher. Pick wrong, fall lower.",
  "Pick the right winner, round and method to win MORE points.",
] as const;

export const RANKINGS_POINTS_HELP_SUPER_PICK_PREFIX =
  "A perfect heavy-underdog prediction is a";

export const RANKINGS_POINTS_HELP_SUPER_PICK_SUFFIX = `worth ${formatRatingPoints(SUPER_PICK_POINTS)} points.`;

export const SUPER_PICK_INFO_TEXT =
  "Correctly predict a heavy underdog to win with the right method — exact round for a stoppage, or decision for a decision result — to earn the maximum +75 points.";

export const SUPER_PICK_MOTIVATION_NEUTRAL =
  "Make picks to begin your climb.";

export const SUPER_PICK_MOTIVATION_WORLD_NUMBER_ONE =
  "You're currently World #1.";

export type SuperPickMotivationVariant =
  | "neutral"
  | "world_number_one"
  | "to_top_10"
  | "to_number_one";

export interface SuperPickMotivation {
  variant: SuperPickMotivationVariant;
  line: string;
  superPickCount?: number;
}

export interface SuperPickMotivationInput {
  hasFullLeaderboard: boolean;
  isGuest: boolean;
  globalOfficialRank: number | null;
  userGlobalScore: number;
  userGlobalGradedPickCount: number;
  firstPlaceScore: number | undefined;
  tenthPlaceScore: number | undefined;
}

export function getScoreGapToExceed(
  targetScore: number | undefined,
  userScore: number
): number {
  if (targetScore == null) return 0;
  return Math.max(0, targetScore + 1 - userScore);
}

export function getSuperPicksNeededForScoreGap(scoreGap: number): number {
  if (scoreGap <= 0) return 0;
  return Math.ceil(scoreGap / SUPER_PICK_POINTS);
}

export function getSuperPickMotivationLine(
  input: SuperPickMotivationInput
): SuperPickMotivation {
  if (input.isGuest || !input.hasFullLeaderboard) {
    return {
      variant: "neutral",
      line: SUPER_PICK_MOTIVATION_NEUTRAL,
    };
  }

  if (input.globalOfficialRank === 1) {
    return {
      variant: "world_number_one",
      line: SUPER_PICK_MOTIVATION_WORLD_NUMBER_ONE,
    };
  }

  const insideTop10 =
    input.globalOfficialRank != null && input.globalOfficialRank <= 10;

  if (insideTop10) {
    const scoreGap = getScoreGapToExceed(
      input.firstPlaceScore,
      input.userGlobalScore
    );
    const superPickCount = getSuperPicksNeededForScoreGap(scoreGap);

    if (superPickCount <= 0) {
      return {
        variant: "world_number_one",
        line: SUPER_PICK_MOTIVATION_WORLD_NUMBER_ONE,
      };
    }

    const pickWord = superPickCount === 1 ? "Super Pick" : "Super Picks";
    return {
      variant: "to_number_one",
      superPickCount,
      line: `Pick ${superPickCount} ${pickWord} to enter World #1.`,
    };
  }

  const scoreGap = getScoreGapToExceed(
    input.tenthPlaceScore,
    input.userGlobalScore
  );
  const scoreBasedSuperPicks = getSuperPicksNeededForScoreGap(scoreGap);
  const qualificationPicksNeeded = Math.max(
    0,
    GLOBAL_RANK_ELIGIBILITY - input.userGlobalGradedPickCount
  );
  const superPickCount = Math.max(
    scoreBasedSuperPicks,
    qualificationPicksNeeded
  );

  if (superPickCount <= 0) {
    return {
      variant: "neutral",
      line: SUPER_PICK_MOTIVATION_NEUTRAL,
    };
  }

  const pickWord = superPickCount === 1 ? "Super Pick" : "Super Picks";
  return {
    variant: "to_top_10",
    superPickCount,
    line: `Pick ${superPickCount} ${pickWord} to enter the World Top 10.`,
  };
}
