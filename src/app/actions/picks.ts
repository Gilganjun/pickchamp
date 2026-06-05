"use server";

import { getAuthUser } from "@/lib/auth/session";
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
  const user = await getAuthUser();
  const userId = user?.id;

  const [events, fights] = await Promise.all([
    getEventsForPicks(sport, userId),
    getFightsForPicks(sport, userId, eventCard),
  ]);

  return {
    events,
    fights,
    userId: userId ?? null,
    isLoggedIn: Boolean(userId),
  };
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
  const user = await getAuthUser();
  if (!user) {
    return { ok: false as const, error: "LOGIN_REQUIRED" };
  }

  return savePrediction({
    userId: user.id,
    fightId: input.fightId,
    predictedOutcome: input.predictedOutcome,
    predictedMethod: input.predictedMethod,
    predictedRound: input.predictedRound,
    scheduledRounds: input.scheduledRounds,
    sport: input.sport,
    isLocked: input.isLocked,
  });
}
