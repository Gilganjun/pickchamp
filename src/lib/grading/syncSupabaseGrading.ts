import {
  applyRatingToProfile,
  gradePredictionsForFight,
} from "@/lib/grading/gradeFight";
import {
  createAdminClient,
  hasSupabaseAdminConfig,
} from "@/lib/supabase/admin";
import {
  mapFight,
  mapFightResult,
  mapPrediction,
  mapProfile,
} from "@/lib/supabase/mappers";

const SETTLED_STATUSES = ["settled", "cancelled", "no_contest"] as const;

let inflight: Promise<void> | null = null;

/**
 * Production: grade ungraded predictions on settled fights that already have
 * fight_results (mirrors admin settleFight for catch-up).
 */
export async function ensureSupabaseGradingForSettledFights(): Promise<void> {
  if (!hasSupabaseAdminConfig()) return;
  if (inflight) {
    await inflight;
    return;
  }

  inflight = runSupabaseGrading().finally(() => {
    inflight = null;
  });
  await inflight;
}

async function runSupabaseGrading(): Promise<void> {
  const admin = createAdminClient();

  const { data: fightRows, error: fightsError } = await admin
    .from("fights")
    .select("*")
    .in("status", [...SETTLED_STATUSES]);
  if (fightsError) throw new Error(fightsError.message);
  if (!fightRows?.length) return;

  const fightIds = fightRows.map((row) => row.id as string);
  const { data: resultRows, error: resultsError } = await admin
    .from("fight_results")
    .select("*")
    .in("fight_id", fightIds);
  if (resultsError) throw new Error(resultsError.message);

  const resultsByFightId = new Map(
    (resultRows ?? []).map((row) => [row.fight_id as string, row])
  );

  for (const fightRow of fightRows) {
    const resultRow = resultsByFightId.get(fightRow.id as string);
    if (!resultRow) continue;

    const fight = mapFight(fightRow);
    const result = mapFightResult(resultRow);

    const { data: predRows, error: predError } = await admin
      .from("predictions")
      .select("*")
      .eq("fight_id", fight.id)
      .is("graded_at", null);
    if (predError) throw new Error(predError.message);
    if (!predRows?.length) continue;

    const predictions = predRows.map((row) => mapPrediction(row));
    const { graded } = gradePredictionsForFight(fight, result, predictions);

    for (const gradedPick of graded) {
      const { error: updatePredError } = await admin
        .from("predictions")
        .update({
          graded_at: gradedPick.graded_at,
          rating_change: gradedPick.rating_change,
          main_correct: gradedPick.main_correct,
          method_correct: gradedPick.method_correct,
          round_correct: gradedPick.round_correct,
          perfect_pick: gradedPick.perfect_pick,
          grading_details: gradedPick.gradingDetails,
          updated_at: new Date().toISOString(),
        })
        .eq("id", gradedPick.id);
      if (updatePredError) throw new Error(updatePredError.message);

      if (gradedPick.rating_change == null) continue;

      const { data: profileRow, error: profileError } = await admin
        .from("profiles")
        .select("*")
        .eq("id", gradedPick.user_id)
        .maybeSingle();
      if (profileError) throw new Error(profileError.message);
      if (!profileRow) continue;

      const updatedProfile = applyRatingToProfile(
        mapProfile(profileRow),
        fight.sport,
        gradedPick.rating_change,
        gradedPick.main_correct ?? false,
        gradedPick.perfect_pick ?? false
      );

      const { error: updateProfileError } = await admin
        .from("profiles")
        .update({
          global_rating: updatedProfile.global_rating,
          boxing_rating: updatedProfile.boxing_rating,
          mma_rating: updatedProfile.mma_rating,
          total_picks: updatedProfile.total_picks,
          total_correct: updatedProfile.total_correct,
          boxing_picks: updatedProfile.boxing_picks,
          boxing_correct: updatedProfile.boxing_correct,
          mma_picks: updatedProfile.mma_picks,
          mma_correct: updatedProfile.mma_correct,
          perfect_picks: updatedProfile.perfect_picks,
          current_streak: updatedProfile.current_streak,
          best_streak: updatedProfile.best_streak,
          updated_at: updatedProfile.updated_at,
        })
        .eq("id", gradedPick.user_id);
      if (updateProfileError) throw new Error(updateProfileError.message);
    }
  }
}
