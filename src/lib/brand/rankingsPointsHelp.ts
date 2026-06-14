import {
  BOXING_RANK_ELIGIBILITY,
  GLOBAL_RANK_ELIGIBILITY,
  MAX_TOTAL_GAIN_PER_FIGHT,
  MAX_TOTAL_LOSS_PER_FIGHT,
  METHOD_CORRECT_BONUS,
  METHOD_WRONG_PENALTY,
  MMA_RANK_ELIGIBILITY,
  PERFECT_PICK_BONUS,
  ROUND_EXACT_BONUS,
  DEFAULT_RATING,
} from "@/lib/rating/constants";
import { formatRatingPoints } from "@/lib/rating/getPickPotential";
import { TIER_RATINGS } from "@/lib/rating/tierRatings";
import type { EffectiveTier } from "@/lib/rating/tierTypes";

export const RANKINGS_POINTS_HELP_TITLE = "How PickFist Score works";

export const RANKINGS_POINTS_HELP_TRIGGER = "How scoring works";

export const RANKINGS_POINTS_HELP_SUMMARY = [
  `Everyone starts at ${DEFAULT_RATING.toLocaleString()}. Your score moves up or down after each graded pick.`,
  "Points follow each fight's difficulty — favourite, even, underdog, or draw — not how many users picked the same fighter.",
  `Official rank needs graded picks (Global ${GLOBAL_RANK_ELIGIBILITY} · Boxing ${BOXING_RANK_ELIGIBILITY} · MMA ${MMA_RANK_ELIGIBILITY}). Leaderboard order: score, then picks, then accuracy.`,
] as const;

export interface RankingsTierHelpRow {
  label: string;
  correct: string;
  wrong: string;
}

const TIER_HELP_ORDER: { tier: EffectiveTier; label: string }[] = [
  { tier: "heavy_favourite", label: "Heavy favourite" },
  { tier: "favourite", label: "Favourite" },
  { tier: "even", label: "Even fight" },
  { tier: "underdog", label: "Underdog" },
  { tier: "heavy_underdog", label: "Heavy underdog" },
  { tier: "draw", label: "Draw" },
];

export function getRankingsTierHelpRows(): RankingsTierHelpRow[] {
  return TIER_HELP_ORDER.map(({ tier, label }) => {
    const { correct, wrong } = TIER_RATINGS[tier];
    return {
      label,
      correct: formatRatingPoints(correct),
      wrong: formatRatingPoints(wrong),
    };
  });
}

export function getRankingsPointsHelpBonusesLine(): string {
  return `If your winner is correct: method ${formatRatingPoints(METHOD_CORRECT_BONUS)} (wrong ${formatRatingPoints(METHOD_WRONG_PENALTY)}), exact round ${formatRatingPoints(ROUND_EXACT_BONUS)}, perfect pick ${formatRatingPoints(PERFECT_PICK_BONUS)}. Max ${formatRatingPoints(MAX_TOTAL_GAIN_PER_FIGHT)} / ${formatRatingPoints(MAX_TOTAL_LOSS_PER_FIGHT)} per fight.`;
}
