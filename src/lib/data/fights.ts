import {
  getMockFightWithRelations,
  getMockPredictions,
  MOCK_USER_ID,
  upsertMockPrediction,
} from "@/data/mock";
import { usesLiveSupabase } from "@/lib/config";
import { getMockEvents } from "@/data/mock";
import { mapPrediction } from "@/lib/supabase/mappers";
import type {
  Event,
  FightWithRelations,
  Prediction,
  PredictedMethod,
  PredictedOutcome,
  SportFilter,
} from "@/types";
import { ensureSettledFightsGraded } from "@/lib/grading/ensureSettledFightsGraded";
import { validatePrediction } from "@/lib/rating/validatePrediction";
import {
  filterFightsForPicksView,
  type EventCardFilter,
} from "@/lib/data/fights-utils";
import {
  appendPhantomPicksForDev,
  getPhantomEventsForDev,
  getPhantomPredictionsForDev,
  upsertPhantomLocalPrediction,
} from "@/lib/dev/phantomPicksDev";

export type { EventCardFilter };
export { groupFightsByEvent, isActivePicksFight } from "@/lib/data/fights-utils";

function mergePhantomPredictions(
  predictions: Prediction[],
  userId: string
): Prediction[] {
  const phantom = getPhantomPredictionsForDev(userId);
  if (phantom.length === 0) return predictions;

  const byKey = new Map(
    predictions.map((p) => [`${p.user_id}:${p.fight_id}`, p])
  );
  for (const p of phantom) {
    byKey.set(`${p.user_id}:${p.fight_id}`, p);
  }
  return [...byKey.values()];
}

async function getAllFightRelations(
  userId?: string
): Promise<FightWithRelations[]> {
  if (usesLiveSupabase()) {
    const { fetchFightWithRelations } = await import(
      "@/lib/data/supabase-fetch"
    );
    const fights = await fetchFightWithRelations(userId);
    return appendPhantomPicksForDev(fights, userId);
  }
  return appendPhantomPicksForDev(
    getMockFightWithRelations(userId ?? MOCK_USER_ID),
    userId
  );
}

export async function getFightsForPicks(
  sportFilter: SportFilter,
  userId?: string,
  eventFilter: EventCardFilter = "all"
): Promise<FightWithRelations[]> {
  const fights = await getAllFightRelations(userId);
  return filterFightsForPicksView(fights, sportFilter, eventFilter);
}

/** All fights with relations for profile current-picks and hero stats. */
export async function getFightsForProfile(
  userId?: string
): Promise<FightWithRelations[]> {
  return getAllFightRelations(userId);
}

/** Events that have at least one active fight for the current sport filter */
export async function getEventsForPicks(
  sportFilter: SportFilter,
  userId?: string
): Promise<Event[]> {
  const fights = await getFightsForPicks(sportFilter, userId, "all");
  const eventIds = [...new Set(fights.map((f) => f.event_id))];

  if (usesLiveSupabase()) {
    const { fetchAllEvents } = await import("@/lib/data/supabase-fetch");
    const allEvents = await fetchAllEvents();
    const filtered = allEvents
      .filter((e) => eventIds.includes(e.id))
      .sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );
    return getPhantomEventsForDev(filtered, fights);
  }

  const mockFiltered = getMockEvents()
    .filter((e) => eventIds.includes(e.id))
    .sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );
  return getPhantomEventsForDev(mockFiltered, fights);
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

  const phantomPrediction = upsertPhantomLocalPrediction({
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
  if (phantomPrediction) {
    return { ok: true, prediction: phantomPrediction };
  }

  if (usesLiveSupabase()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== input.userId) {
      return { ok: false, error: "LOGIN_REQUIRED" };
    }

    const { data: existing } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", user.id)
      .eq("fight_id", input.fightId)
      .maybeSingle();

    if (existing?.locked_at) {
      return { ok: false, error: "This pick is locked and cannot be changed." };
    }

    const nowIso = new Date().toISOString();
    const row = {
      user_id: user.id,
      fight_id: input.fightId,
      predicted_outcome: input.predictedOutcome,
      predicted_method: input.predictedMethod,
      predicted_round: input.predictedRound,
      updated_at: nowIso,
      ...(existing ? {} : { created_at: nowIso }),
    };

    const { data, error } = await supabase
      .from("predictions")
      .upsert(row, { onConflict: "user_id,fight_id" })
      .select("*")
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, prediction: mapPrediction(data) };
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
  await ensureSettledFightsGraded();

  if (usesLiveSupabase()) {
    const { fetchPredictionsForUser } = await import(
      "@/lib/data/supabase-fetch"
    );
    return mergePhantomPredictions(
      await fetchPredictionsForUser(userId),
      userId
    );
  }
  return mergePhantomPredictions(getMockPredictions(userId), userId);
}
