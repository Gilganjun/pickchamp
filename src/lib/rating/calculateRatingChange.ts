import {
  MAX_TOTAL_GAIN_PER_FIGHT,
  MAX_TOTAL_LOSS_PER_FIGHT,
  METHOD_CORRECT_BONUS,
  METHOD_WRONG_PENALTY,
  PERFECT_PICK_BONUS,
  ROUND_EXACT_BONUS,
  ROUND_WRONG_PENALTY,
  SUPER_PICK_POINTS,
} from "./constants";
import type { GradingDetails, PopularityDistribution } from "./gradingDetails";
import { getEffectivePickTier } from "./getEffectivePickTier";
import { clampNumber, isFinishMethod } from "./helpers";
import { evaluateSuperPick } from "./isSuperPick";
import { getTierRatingValues } from "./tierRatings";
import type { FavouriteLevel, FavouriteSide } from "./tierTypes";

export type PredictedOutcome = "fighterA" | "fighterB" | "draw";
export type PredictedMethod =
  | "decision"
  | "ko_tko"
  | "submission"
  | "dq"
  | "technical_decision"
  | "draw"
  | null;
export type FightStatus =
  | "upcoming"
  | "locked"
  | "result_pending"
  | "settled"
  | "cancelled"
  | "no_contest";

export interface CalculateRatingChangeInput {
  predictedOutcome: PredictedOutcome;
  predictedMethod: PredictedMethod;
  predictedRound: number | null;
  resultOutcome: PredictedOutcome | "no_contest" | "cancelled";
  resultMethod: PredictedMethod | "no_contest" | "cancelled";
  resultRound: number | null;
  scheduledRounds: number;
  favouriteSide: FavouriteSide;
  favouriteLevel: FavouriteLevel;
  popularity: PopularityDistribution;
  fightStatus: FightStatus;
}

export interface CalculateRatingChangeResult {
  ratingChange: number;
  mainCorrect: boolean;
  methodCorrect: boolean | null;
  roundCorrect: boolean | null;
  perfectPick: boolean;
  isSuperPick: boolean;
  details: GradingDetails;
}

function normalizeOutcome(
  outcome: string
): "fighterA" | "fighterB" | "draw" | "no_contest" | "cancelled" {
  if (outcome === "fighterA" || outcome === "fighterB" || outcome === "draw") {
    return outcome;
  }
  if (outcome === "no_contest" || outcome === "cancelled") {
    return outcome;
  }
  return "fighterA";
}

function voidedDetails(
  favouriteSide: FavouriteSide,
  favouriteLevel: FavouriteLevel,
  popularity: PopularityDistribution
): GradingDetails {
  return {
    effectiveTier: "even",
    favouriteSide,
    favouriteLevel,
    baseTierScore: 0,
    methodAdjustment: 0,
    roundAdjustment: 0,
    perfectBonus: 0,
    popularity,
    finalRatingChange: 0,
    explanation: "Fight voided (cancelled or no contest). No rating change.",
    voided: true,
  };
}

export function calculateRatingChange(
  input: CalculateRatingChangeInput
): CalculateRatingChangeResult {
  const {
    predictedOutcome,
    predictedMethod,
    predictedRound,
    resultOutcome,
    resultMethod,
    resultRound,
    favouriteSide,
    favouriteLevel,
    popularity,
    fightStatus,
  } = input;

  const voided =
    fightStatus === "cancelled" ||
    fightStatus === "no_contest" ||
    resultOutcome === "cancelled" ||
    resultOutcome === "no_contest";

  if (voided) {
    return {
      ratingChange: 0,
      mainCorrect: false,
      methodCorrect: null,
      roundCorrect: null,
      perfectPick: false,
      isSuperPick: false,
      details: voidedDetails(favouriteSide, favouriteLevel, popularity),
    };
  }

  const effectiveTier = getEffectivePickTier({
    predictedOutcome,
    favouriteSide,
    favouriteLevel,
  });

  const tierValues = getTierRatingValues(effectiveTier);
  const normalizedResult = normalizeOutcome(resultOutcome);
  const mainCorrect = predictedOutcome === normalizedResult;

  if (!mainCorrect) {
    const baseTierScore = tierValues.wrong;
    const finalRatingChange = clampNumber(
      baseTierScore,
      MAX_TOTAL_LOSS_PER_FIGHT,
      MAX_TOTAL_GAIN_PER_FIGHT
    );
    return {
      ratingChange: finalRatingChange,
      mainCorrect: false,
      methodCorrect: null,
      roundCorrect: null,
      perfectPick: false,
      isSuperPick: false,
      details: {
        effectiveTier,
        favouriteSide,
        favouriteLevel,
        baseTierScore,
        methodAdjustment: 0,
        roundAdjustment: 0,
        perfectBonus: 0,
        popularity,
        finalRatingChange,
        explanation: `Main pick incorrect (tier ${effectiveTier}). Sub-predictions ignored. Base ${baseTierScore}.`,
      },
    };
  }

  const baseTierScore = tierValues.correct;
  let methodAdjustment = 0;
  let methodCorrect: boolean | null = null;

  if (predictedMethod != null) {
    const normalizedMethod = resultMethod ?? "decision";
    methodCorrect = predictedMethod === normalizedMethod;
    methodAdjustment = methodCorrect ? METHOD_CORRECT_BONUS : METHOD_WRONG_PENALTY;
  }

  let roundAdjustment = 0;
  let roundCorrect: boolean | null = null;

  const hasResultRound =
    resultRound != null && isFinishMethod(resultMethod ?? undefined);

  if (predictedRound != null && hasResultRound && resultRound != null) {
    if (predictedRound === resultRound) {
      roundCorrect = true;
      roundAdjustment = ROUND_EXACT_BONUS;
    } else {
      roundCorrect = false;
      roundAdjustment = ROUND_WRONG_PENALTY;
    }
  } else if (predictedRound != null && !hasResultRound) {
    roundCorrect = false;
    roundAdjustment = ROUND_WRONG_PENALTY;
  }

  const exactRound =
    roundCorrect === true &&
    predictedRound != null &&
    resultRound != null &&
    predictedRound === resultRound;

  const perfectPick =
    mainCorrect && methodCorrect === true && exactRound;

  const perfectBonus = perfectPick ? PERFECT_PICK_BONUS : 0;

  const rawBeforeClamp =
    baseTierScore + methodAdjustment + roundAdjustment + perfectBonus;

  const computedRatingChange = clampNumber(
    rawBeforeClamp,
    MAX_TOTAL_LOSS_PER_FIGHT,
    MAX_TOTAL_GAIN_PER_FIGHT
  );

  const isSuperPick = evaluateSuperPick({
    effectiveTier,
    mainCorrect,
    methodCorrect,
    roundCorrect,
    predictedMethod,
    resultMethod,
  });

  const finalRatingChange = isSuperPick
    ? SUPER_PICK_POINTS
    : computedRatingChange;

  const explanation = isSuperPick
    ? `Super Pick (tier ${effectiveTier}). Breakdown base +${baseTierScore}, method ${methodAdjustment}, round ${roundAdjustment}, perfect ${perfectBonus}. Awarded +${SUPER_PICK_POINTS}.`
    : `Main correct (tier ${effectiveTier}, base +${baseTierScore}). Method ${methodAdjustment}, round ${roundAdjustment}, perfect ${perfectBonus}. Final ${finalRatingChange}.`;

  return {
    ratingChange: finalRatingChange,
    mainCorrect: true,
    methodCorrect,
    roundCorrect,
    perfectPick,
    isSuperPick,
    details: {
      effectiveTier,
      favouriteSide,
      favouriteLevel,
      baseTierScore,
      methodAdjustment,
      roundAdjustment,
      perfectBonus,
      popularity,
      finalRatingChange,
      explanation,
      ...(isSuperPick
        ? { isSuperPick: true, superPickPoints: SUPER_PICK_POINTS }
        : {}),
    },
  };
}
