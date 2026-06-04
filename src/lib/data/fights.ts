import {
  getMockFightWithRelations,
  getMockPredictions,
  MOCK_USER_ID,
  upsertMockPrediction,
} from "@/data/mock";
import { hasSupabaseConfig } from "@/lib/config";
import { getMockEvents } from "@/data/mock";
import type {
  Event,
  FightWithRelations,
  PickTab,
  Prediction,
  PredictedMethod,
  PredictedOutcome,
  SportFilter,
} from "@/types";
import { inferFightTab } from "@/lib/utils";

export type EventCardFilter = "all" | string;

function filterFightsForPicksView(
  fights: FightWithRelations[],
  tab: PickTab,
  sportFilter: SportFilter,
  eventFilter: EventCardFilter
): FightWithRelations[] {
  return fights
    .filter((f) => inferFightTab(f.status, f.lock_time) === tab)
    .filter((f) => sportFilter === "all" || f.sport === sportFilter)
    .filter((f) => eventFilter === "all" || f.event_id === eventFilter)
    .sort((a, b) => {
      const eventDiff =
        new Date(a.event.event_date).getTime() -
        new Date(b.event.event_date).getTime();
      if (eventDiff !== 0) return eventDiff;
      const orderA = a.fight_order ?? 999;
      const orderB = b.fight_order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (
        new Date(a.lock_time).getTime() - new Date(b.lock_time).getTime()
      );
    });
}

export async function getFightsForPicks(
  tab: PickTab,
  sportFilter: SportFilter,
  userId?: string,
  eventFilter: EventCardFilter = "all"
): Promise<FightWithRelations[]> {
  const effectiveUserId = userId ?? MOCK_USER_ID;
  let fights = getMockFightWithRelations(effectiveUserId);

  if (hasSupabaseConfig()) {
    // Supabase integration placeholder — falls back to mock until wired
    fights = getMockFightWithRelations(effectiveUserId);
  }

  return filterFightsForPicksView(fights, tab, sportFilter, eventFilter);
}

/** Events that have at least one fight in the current picks tab + sport filter */
export async function getEventsForPicks(
  tab: PickTab,
  sportFilter: SportFilter,
  userId?: string
): Promise<Event[]> {
  const fights = await getFightsForPicks(tab, sportFilter, userId, "all");
  const eventIds = [...new Set(fights.map((f) => f.event_id))];
  return getMockEvents()
    .filter((e) => eventIds.includes(e.id))
    .sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );
}

export function groupFightsByEvent(
  fights: FightWithRelations[]
): { event: Event; fights: FightWithRelations[] }[] {
  const map = new Map<string, FightWithRelations[]>();
  for (const fight of fights) {
    const list = map.get(fight.event_id) ?? [];
    list.push(fight);
    map.set(fight.event_id, list);
  }
  return [...map.entries()]
    .map(([, cardFights]) => ({
      event: cardFights[0].event,
      fights: cardFights,
    }))
    .sort(
      (a, b) =>
        new Date(a.event.event_date).getTime() -
        new Date(b.event.event_date).getTime()
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
