import { calculateRatingChange } from "@/lib/rating/calculateRatingChange";
import { buildPopularityPercentages } from "@/lib/rating/gradingDetails";
import type {
  Fight,
  FightResult,
  Prediction,
  Profile,
  Sport,
} from "@/types";

import type { GradingSummary } from "@/types/grading";
export type { GradingSummary };

export interface GradedPrediction extends Prediction {
  gradingDetails: Record<string, unknown>;
}

export function countOutcomePicks(predictions: Prediction[]): {
  fighterA: number;
  fighterB: number;
  draw: number;
} {
  let fighterA = 0;
  let fighterB = 0;
  let draw = 0;
  for (const p of predictions) {
    if (p.predicted_outcome === "fighterA") fighterA++;
    else if (p.predicted_outcome === "fighterB") fighterB++;
    else draw++;
  }
  return { fighterA, fighterB, draw };
}

export function gradePredictionsForFight(
  fight: Fight,
  result: FightResult,
  predictions: Prediction[]
): { graded: GradedPrediction[]; summary: GradingSummary } {
  const counts = countOutcomePicks(predictions);
  const total = predictions.length;
  const popularity = buildPopularityPercentages(counts, total);

  const voided =
    result.outcome === "no_contest" ||
    result.outcome === "cancelled" ||
    fight.status === "no_contest" ||
    fight.status === "cancelled";

  let correctCount = 0;
  let sumChange = 0;
  let largestGain = 0;
  let largestLoss = 0;

  const graded: GradedPrediction[] = predictions.map((pred) => {
    const calc = calculateRatingChange({
      predictedOutcome: pred.predicted_outcome,
      predictedMethod: pred.predicted_method,
      predictedRound: pred.predicted_round,
      resultOutcome: result.outcome,
      resultMethod: result.method,
      resultRound: result.result_round,
      scheduledRounds: fight.scheduled_rounds,
      favouriteSide: fight.favourite_side,
      favouriteLevel: fight.favourite_level,
      popularity,
      fightStatus: voided ? "no_contest" : "settled",
    });

    if (calc.mainCorrect) correctCount++;
    sumChange += calc.ratingChange;
    largestGain = Math.max(largestGain, calc.ratingChange);
    largestLoss = Math.min(largestLoss, calc.ratingChange);

    const detailsRecord = calc.details as unknown as Record<string, unknown>;

    return {
      ...pred,
      graded_at: new Date().toISOString(),
      rating_change: calc.ratingChange,
      main_correct: calc.mainCorrect,
      method_correct: calc.methodCorrect,
      round_correct: calc.roundCorrect,
      perfect_pick: calc.perfectPick,
      grading_details: detailsRecord,
      gradingDetails: detailsRecord,
    };
  });

  return {
    graded,
    summary: {
      totalPredictions: total,
      fighterAPickCount: counts.fighterA,
      fighterBPickCount: counts.fighterB,
      drawPickCount: counts.draw,
      popularity,
      correctCount,
      averageRatingChange:
        total > 0 ? Math.round((sumChange / total) * 100) / 100 : 0,
      largestGain,
      largestLoss,
    },
  };
}

export function applyRatingToProfile(
  profile: Profile,
  sport: Sport,
  ratingChange: number,
  mainCorrect: boolean,
  perfectPick: boolean
): Profile {
  const newGlobal = profile.global_rating + ratingChange;
  const newBoxing =
    sport === "boxing" ? profile.boxing_rating + ratingChange : profile.boxing_rating;
  const newMma =
    sport === "mma" ? profile.mma_rating + ratingChange : profile.mma_rating;

  const streak = mainCorrect ? profile.current_streak + 1 : 0;
  const bestStreak = Math.max(profile.best_streak, streak);

  return {
    ...profile,
    global_rating: newGlobal,
    boxing_rating: newBoxing,
    mma_rating: newMma,
    total_picks: profile.total_picks + 1,
    total_correct: profile.total_correct + (mainCorrect ? 1 : 0),
    boxing_picks: profile.boxing_picks + (sport === "boxing" ? 1 : 0),
    boxing_correct:
      profile.boxing_correct +
      (sport === "boxing" && mainCorrect ? 1 : 0),
    mma_picks: profile.mma_picks + (sport === "mma" ? 1 : 0),
    mma_correct:
      profile.mma_correct + (sport === "mma" && mainCorrect ? 1 : 0),
    perfect_picks: profile.perfect_picks + (perfectPick ? 1 : 0),
    current_streak: streak,
    best_streak: bestStreak,
    updated_at: new Date().toISOString(),
  };
}
