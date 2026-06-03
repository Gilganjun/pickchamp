import {
  getMockFightWithRelations,
  getMockPredictions,
  MOCK_USER_ID,
  upsertMockPrediction,
} from "@/data/mock";
import { hasSupabaseConfig } from "@/lib/config";
import type {
  FightWithRelations,
  PickTab,
  Prediction,
  PredictedMethod,
  PredictedOutcome,
  SportFilter,
} from "@/types";
import { inferFightTab } from "@/lib/utils";

export async function getFightsForPicks(
  tab: PickTab,
  sportFilter: SportFilter,
  userId?: string
): Promise<FightWithRelations[]> {
  const effectiveUserId = userId ?? MOCK_USER_ID;
  let fights = getMockFightWithRelations(effectiveUserId);

  if (hasSupabaseConfig()) {
    // Supabase integration placeholder — falls back to mock until wired
    fights = getMockFightWithRelations(effectiveUserId);
  }

  return fights
    .filter((f) => inferFightTab(f.status, f.lock_time) === tab)
    .filter((f) => sportFilter === "all" || f.sport === sportFilter)
    .sort(
      (a, b) =>
        new Date(a.lock_time).getTime() - new Date(b.lock_time).getTime()
    );
}

export async function savePrediction(input: {
  userId: string;
  fightId: string;
  predictedOutcome: PredictedOutcome;
  predictedMethod: PredictedMethod | null;
  predictedRound: number | null;
  scheduledRounds: number;
  sport: "boxing" | "mma";
  isLocked: boolean;
}): Promise<{ ok: boolean; error?: string; prediction?: Prediction }> {
  const { validatePrediction } = await import("@/lib/rating/validatePrediction");
  const validation = validatePrediction({
    predictedOutcome: input.predictedOutcome,
    predictedMethod: input.predictedMethod,
    predictedRound: input.predictedRound,
    scheduledRounds: input.scheduledRounds,
    sport: input.sport,
    isLocked: input.isLocked,
    isLoggedIn: true,
  });

  if (!validation.valid) {
    return { ok: false, error: validation.errors.join(" ") };
  }

  const pred = upsertMockPrediction({
    user_id: input.userId,
    fight_id: input.fightId,
    predicted_outcome: input.predictedOutcome,
    predicted_method: input.predictedMethod,
    predicted_round: input.predictedRound,
    locked_at: null,
    graded_at: null,
    rating_change: null,
    main_correct: null,
    method_correct: null,
    round_correct: null,
    perfect_pick: null,
    grading_details: null,
  });

  return { ok: true, prediction: pred };
}

export async function getUserPredictions(userId: string): Promise<Prediction[]> {
  if (hasSupabaseConfig()) {
    return getMockPredictions(userId);
  }
  return getMockPredictions(userId);
}
