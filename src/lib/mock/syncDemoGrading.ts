import { mockFights, mockProfiles, mockResults } from "@/data/mock";
import { usesLiveSupabase } from "@/lib/config";
import {
  applyRatingToProfile,
  gradePredictionsForFight,
} from "@/lib/grading/gradeFight";
import {
  getAllDemoPredictions,
  updateDemoPrediction,
} from "@/lib/mock/demoPredictionStore";

const SETTLED_STATUSES = new Set([
  "settled",
  "cancelled",
  "no_contest",
]);

/**
 * Demo mode: when fight results exist in mock data, grade any ungraded
 * predictions and roll rating/stats onto mock profiles (mirrors admin settle).
 */
export function syncDemoGradingForSettledFights(): void {
  if (usesLiveSupabase()) return;

  for (const fight of mockFights) {
    if (!SETTLED_STATUSES.has(fight.status)) continue;

    const result = mockResults.find((row) => row.fight_id === fight.id);
    if (!result) continue;

    const pending = getAllDemoPredictions().filter(
      (prediction) =>
        prediction.fight_id === fight.id && prediction.graded_at == null
    );
    if (pending.length === 0) continue;

    const { graded } = gradePredictionsForFight(fight, result, pending);

    for (const gradedPick of graded) {
      updateDemoPrediction(gradedPick.id, {
        graded_at: gradedPick.graded_at,
        rating_change: gradedPick.rating_change,
        main_correct: gradedPick.main_correct,
        method_correct: gradedPick.method_correct,
        round_correct: gradedPick.round_correct,
        perfect_pick: gradedPick.perfect_pick,
        grading_details: gradedPick.grading_details,
      });

      if (gradedPick.rating_change == null) continue;

      const profileIdx = mockProfiles.findIndex(
        (profile) => profile.id === gradedPick.user_id
      );
      if (profileIdx < 0) continue;

      mockProfiles[profileIdx] = applyRatingToProfile(
        mockProfiles[profileIdx],
        fight.sport,
        gradedPick.rating_change,
        gradedPick.main_correct ?? false,
        gradedPick.perfect_pick ?? false
      );
    }
  }
}
