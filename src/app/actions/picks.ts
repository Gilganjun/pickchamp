"use server";

import { revalidatePath } from "next/cache";
import { MOCK_USER_ID } from "@/data/mock";
import { getAuthUser } from "@/lib/auth/session";
import { usesLiveSupabase } from "@/lib/config";
import {
  getEventsForPicks,
  getFightsForPicks,
  savePrediction,
  type EventCardFilter,
} from "@/lib/data/fights";
import type { SportFilter } from "@/types";

export async function loadPicksPageDataAction(
  sport: SportFilter,
  eventCard: EventCardFilter
) {
  try {
    const user = await getAuthUser();
    const demoMode = !usesLiveSupabase();
    const userId = demoMode ? MOCK_USER_ID : user?.id;

    const [events, fights] = await Promise.all([
      getEventsForPicks(sport, userId),
      getFightsForPicks(sport, userId, eventCard),
    ]);

    return {
      ok: true as const,
      events,
      fights,
      userId: userId ?? null,
      isLoggedIn: demoMode || Boolean(userId),
    };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : "Failed to load fight cards.",
      events: [],
      fights: [],
      userId: null,
      isLoggedIn: false,
    };
  }
}

export async function savePredictionAction(input: {
  fightId: string;
  predictedOutcome: Parameters<typeof savePrediction>[0]["predictedOutcome"];
  predictedMethod: Parameters<typeof savePrediction>[0]["predictedMethod"];
  predictedRound: number | null;
  scheduledRounds: number;
  sport: "boxing" | "mma";
  isLocked: boolean;
}) {
  const demoMode = !usesLiveSupabase();
  const user = demoMode ? null : await getAuthUser();
  const userId = demoMode ? MOCK_USER_ID : user?.id;
  if (!userId) {
    return { ok: false as const, error: "LOGIN_REQUIRED" };
  }

  const result = await savePrediction({
    userId,
    fightId: input.fightId,
    predictedOutcome: input.predictedOutcome,
    predictedMethod: input.predictedMethod,
    predictedRound: input.predictedRound,
    scheduledRounds: input.scheduledRounds,
    sport: input.sport,
    isLocked: input.isLocked,
  });

  if (result.ok) {
    revalidatePath("/profile", "layout");
  }

  return result;
}
