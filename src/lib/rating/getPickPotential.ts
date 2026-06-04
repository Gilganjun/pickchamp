import {
  MAX_TOTAL_GAIN_PER_FIGHT,
  METHOD_CORRECT_BONUS,
  PERFECT_PICK_BONUS,
  ROUND_EXACT_BONUS,
} from "./constants";
import type { PredictedMethod, PredictedOutcome } from "./calculateRatingChange";
import { getEffectivePickTier } from "./getEffectivePickTier";
import { getTierRatingValues } from "./tierRatings";
import type {
  EffectiveTier,
  FavouriteLevel,
  FavouriteSide,
} from "./tierTypes";

export interface GetPickPotentialInput {
  predictedOutcome: PredictedOutcome;
  favouriteSide: FavouriteSide;
  favouriteLevel: FavouriteLevel;
  predictedMethod?: PredictedMethod | null;
  predictedRound?: number | null;
}

export interface PickPotentialBreakdownRow {
  label: string;
  value: number;
}

export interface PickPotential {
  tier: EffectiveTier;
  tierLabel: string;
  correctBase: number;
  wrongRisk: number;
  maxWithCurrentDetails: number;
  perfectCeiling: number;
  methodBonus: number;
  roundExactBonus: number;
  perfectBonus: number;
  breakdown: PickPotentialBreakdownRow[];
}

const TIER_LABELS: Record<EffectiveTier, string> = {
  heavy_favourite: "Heavy Favourite",
  favourite: "Favourite",
  even: "Even Pick",
  underdog: "Underdog",
  heavy_underdog: "Heavy Underdog",
  draw: "Draw",
};

export function formatTierLabel(tier: EffectiveTier): string {
  return TIER_LABELS[tier];
}

export function formatRatingPoints(value: number): string {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function formatRatingSwingCompact(correct: number, wrong: number): string {
  return `Correct ${formatRatingPoints(correct)} · Wrong ${formatRatingPoints(wrong)}`;
}

export function formatRatingSwingShort(correct: number, wrong: number): string {
  return `${formatRatingPoints(correct)} / ${formatRatingPoints(wrong)}`;
}

/** Display-only potential rating swing from existing V2 tier tables. */
export function getPickPotential(input: GetPickPotentialInput): PickPotential {
  const tier = getEffectivePickTier({
    predictedOutcome: input.predictedOutcome,
    favouriteSide: input.favouriteSide,
    favouriteLevel: input.favouriteLevel,
  });

  const { correct: correctBase, wrong: wrongRisk } = getTierRatingValues(tier);
  const hasMethod = input.predictedMethod != null;
  const hasRound = input.predictedRound != null;

  const methodBonus = hasMethod ? METHOD_CORRECT_BONUS : 0;
  const roundExactBonus = hasRound ? ROUND_EXACT_BONUS : 0;
  const perfectBonus =
    hasMethod && hasRound ? PERFECT_PICK_BONUS : 0;

  const breakdown: PickPotentialBreakdownRow[] = [
    { label: "Base", value: correctBase },
  ];
  if (hasMethod) {
    breakdown.push({ label: "Method", value: METHOD_CORRECT_BONUS });
  }
  if (hasRound) {
    breakdown.push({ label: "Exact Round", value: ROUND_EXACT_BONUS });
  }
  if (hasMethod && hasRound) {
    breakdown.push({ label: "Perfect Bonus", value: PERFECT_PICK_BONUS });
  }

  let maxWithCurrentDetails = correctBase;
  if (hasMethod) maxWithCurrentDetails += METHOD_CORRECT_BONUS;
  if (hasRound) maxWithCurrentDetails += ROUND_EXACT_BONUS;
  maxWithCurrentDetails = Math.min(
    MAX_TOTAL_GAIN_PER_FIGHT,
    maxWithCurrentDetails
  );

  const perfectCeiling =
    hasMethod && hasRound
      ? Math.min(
          MAX_TOTAL_GAIN_PER_FIGHT,
          correctBase +
            METHOD_CORRECT_BONUS +
            ROUND_EXACT_BONUS +
            PERFECT_PICK_BONUS
        )
      : maxWithCurrentDetails;

  return {
    tier,
    tierLabel: formatTierLabel(tier),
    correctBase,
    wrongRisk,
    maxWithCurrentDetails,
    perfectCeiling,
    methodBonus,
    roundExactBonus,
    perfectBonus,
    breakdown,
  };
}

export function getPickFistLine(fight: {
  fighter_a_name: string;
  fighter_b_name: string;
  favourite_side: FavouriteSide;
  favourite_level: FavouriteLevel;
}): string {
  if (fight.favourite_side === "none" || fight.favourite_level === "even") {
    return "Even Fight";
  }

  const fullName =
    fight.favourite_side === "fighterA"
      ? fight.fighter_a_name
      : fight.fighter_b_name;
  const parts = fullName.trim().split(/\s+/);
  const shortName = parts.length > 1 ? parts[parts.length - 1] : fullName;

  if (fight.favourite_level === "heavy_favourite") {
    return `${shortName} Heavy Favourite`;
  }

  return `${shortName} Favourite`;
}
