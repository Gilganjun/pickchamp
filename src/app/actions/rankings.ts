"use server";

import { MOCK_USER_ID } from "@/data/mock";
import { getAuthUser } from "@/lib/auth/session";
import { usesLiveSupabase } from "@/lib/config";
import { getFightsForPicks, getUserPredictions } from "@/lib/data/fights";
import { getLeaderboard } from "@/lib/data/profiles";
import { getEligibilityThreshold } from "@/lib/rankings";
import type { RankingTab } from "@/types";

export async function loadLeaderboardAction(tab: RankingTab) {
  return getLeaderboard(tab);
}

export async function getRankingsPickProgressAction(tab: RankingTab): Promise<{
  pickCount: number;
  threshold: number;
}> {
  const threshold = getEligibilityThreshold(tab);
  const demoMode = !usesLiveSupabase();
  const user = demoMode ? null : await getAuthUser();
  const userId = demoMode ? MOCK_USER_ID : user?.id;

  if (!userId) {
    return { pickCount: 0, threshold };
  }

  const [predictions, fights] = await Promise.all([
    getUserPredictions(userId),
    getFightsForPicks("all", userId, "all"),
  ]);

  const sportByFightId = new Map(fights.map((fight) => [fight.id, fight.sport]));
  const pickCount =
    tab === "global"
      ? predictions.length
      : predictions.filter(
          (prediction) => sportByFightId.get(prediction.fight_id) === tab
        ).length;

  return { pickCount, threshold };
}
