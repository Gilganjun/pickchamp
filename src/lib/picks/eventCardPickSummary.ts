import { calculateRatingChange } from "@/lib/rating/calculateRatingChange";
import { buildPopularityPercentages } from "@/lib/rating/gradingDetails";
import { formatPickLine } from "@/lib/profile/display";
import { getFighterSurname } from "@/lib/utils";
import type { FightWithRelations, Prediction } from "@/types";

export type EventPickOutcomeStatus = "win" | "loss" | "pending" | "void";

export interface EventPickRowSummary {
  fightId: string;
  label: string;
  pickLine: string;
  status: EventPickOutcomeStatus;
  ratingChange: number | null;
}

export interface EventCardPickSummary {
  picksMade: number;
  wins: number;
  losses: number;
  pending: number;
  voided: number;
  totalPoints: number;
  hasScoredPicks: boolean;
  rows: EventPickRowSummary[];
}

function resolvePredictionOutcome(
  fight: FightWithRelations,
  prediction: Prediction
): Pick<EventPickRowSummary, "status" | "ratingChange"> {
  if (prediction.graded_at != null) {
    if (prediction.main_correct === true) {
      return {
        status: "win",
        ratingChange: prediction.rating_change,
      };
    }
    if (prediction.main_correct === false) {
      return {
        status: "loss",
        ratingChange: prediction.rating_change,
      };
    }
    return { status: "void", ratingChange: prediction.rating_change ?? 0 };
  }

  if (!fight.result) {
    return { status: "pending", ratingChange: null };
  }

  const popularity = buildPopularityPercentages(
    {
      fighterA: prediction.predicted_outcome === "fighterA" ? 1 : 0,
      fighterB: prediction.predicted_outcome === "fighterB" ? 1 : 0,
      draw: prediction.predicted_outcome === "draw" ? 1 : 0,
    },
    1
  );

  const graded = calculateRatingChange({
    predictedOutcome: prediction.predicted_outcome,
    predictedMethod: prediction.predicted_method,
    predictedRound: prediction.predicted_round,
    resultOutcome: fight.result.outcome,
    resultMethod: fight.result.method,
    resultRound: fight.result.result_round,
    scheduledRounds: fight.scheduled_rounds,
    favouriteSide: fight.favourite_side,
    favouriteLevel: fight.favourite_level,
    popularity,
    fightStatus: fight.status,
  });

  if (
    fight.result.outcome === "cancelled" ||
    fight.result.outcome === "no_contest" ||
    fight.status === "cancelled" ||
    fight.status === "no_contest"
  ) {
    return { status: "void", ratingChange: 0 };
  }

  return {
    status: graded.mainCorrect ? "win" : "loss",
    ratingChange: graded.ratingChange,
  };
}

function pickLabel(fight: FightWithRelations, prediction: Prediction): string {
  if (prediction.predicted_outcome === "draw") return "Draw";
  const name =
    prediction.predicted_outcome === "fighterA"
      ? fight.fighter_a_name
      : fight.fighter_b_name;
  return getFighterSurname(name);
}

export function summarizeEventCardPicks(
  fights: FightWithRelations[]
): EventCardPickSummary {
  const ordered = [...fights].sort((a, b) => {
    const orderA = a.fight_order ?? 999;
    const orderB = b.fight_order ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(a.lock_time).getTime() - new Date(b.lock_time).getTime();
  });

  const rows: EventPickRowSummary[] = [];
  let wins = 0;
  let losses = 0;
  let pending = 0;
  let voided = 0;
  let totalPoints = 0;
  let hasScoredPicks = false;

  for (const fight of ordered) {
    const prediction = fight.userPrediction;
    if (!prediction) continue;

    const { status, ratingChange } = resolvePredictionOutcome(fight, prediction);
    if (status === "win") wins += 1;
    else if (status === "loss") losses += 1;
    else if (status === "pending") pending += 1;
    else voided += 1;

    if (ratingChange != null) {
      totalPoints += ratingChange;
      hasScoredPicks = true;
    }

    rows.push({
      fightId: fight.id,
      label: pickLabel(fight, prediction),
      pickLine: formatPickLine(
        fight,
        prediction.predicted_outcome,
        prediction.predicted_method,
        prediction.predicted_round
      ),
      status,
      ratingChange,
    });
  }

  return {
    picksMade: rows.length,
    wins,
    losses,
    pending,
    voided,
    totalPoints,
    hasScoredPicks,
    rows,
  };
}
