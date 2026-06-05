import type {
  Event,
  Fight,
  FightResult,
  FightWithRelations,
  Prediction,
  Profile,
} from "@/types";

export function mapProfile(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    username: String(row.username),
    display_name: (row.display_name as string | null) ?? null,
    avatar_initials: (row.avatar_initials as string | null) ?? null,
    global_rating: Number(row.global_rating),
    boxing_rating: Number(row.boxing_rating),
    mma_rating: Number(row.mma_rating),
    total_picks: Number(row.total_picks),
    total_correct: Number(row.total_correct),
    boxing_picks: Number(row.boxing_picks),
    boxing_correct: Number(row.boxing_correct),
    mma_picks: Number(row.mma_picks),
    mma_correct: Number(row.mma_correct),
    perfect_picks: Number(row.perfect_picks),
    current_streak: Number(row.current_streak),
    best_streak: Number(row.best_streak),
    is_admin: Boolean(row.is_admin),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapEvent(row: Record<string, unknown>): Event {
  return {
    id: String(row.id),
    name: String(row.name),
    promotion: (row.promotion as string | null) ?? null,
    location: (row.location as string | null) ?? null,
    timezone: (row.timezone as string | null) ?? null,
    event_date: String(row.event_date),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapFight(row: Record<string, unknown>): Fight {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    sport: row.sport as Fight["sport"],
    fighter_a_name: String(row.fighter_a_name),
    fighter_b_name: String(row.fighter_b_name),
    scheduled_rounds: Number(row.scheduled_rounds),
    weight_class: (row.weight_class as string | null) ?? null,
    fight_order: row.fight_order != null ? Number(row.fight_order) : null,
    lock_time: String(row.lock_time),
    status: row.status as Fight["status"],
    favourite_side: row.favourite_side as Fight["favourite_side"],
    favourite_level: row.favourite_level as Fight["favourite_level"],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapFightResult(row: Record<string, unknown>): FightResult {
  return {
    id: String(row.id),
    fight_id: String(row.fight_id),
    outcome: row.outcome as FightResult["outcome"],
    method: row.method as FightResult["method"],
    result_round:
      row.result_round != null ? Number(row.result_round) : null,
    official_notes: (row.official_notes as string | null) ?? null,
    settled_at: (row.settled_at as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export function mapPrediction(row: Record<string, unknown>): Prediction {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    fight_id: String(row.fight_id),
    predicted_outcome: row.predicted_outcome as Prediction["predicted_outcome"],
    predicted_method:
      (row.predicted_method as Prediction["predicted_method"]) ?? null,
    predicted_round:
      row.predicted_round != null ? Number(row.predicted_round) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    locked_at: (row.locked_at as string | null) ?? null,
    graded_at: (row.graded_at as string | null) ?? null,
    rating_change:
      row.rating_change != null ? Number(row.rating_change) : null,
    main_correct:
      row.main_correct != null ? Boolean(row.main_correct) : null,
    method_correct:
      row.method_correct != null ? Boolean(row.method_correct) : null,
    round_correct:
      row.round_correct != null ? Boolean(row.round_correct) : null,
    perfect_pick:
      row.perfect_pick != null ? Boolean(row.perfect_pick) : null,
    grading_details: (row.grading_details as Prediction["grading_details"]) ?? null,
  };
}

export function joinFightsWithRelations(
  fights: Fight[],
  events: Event[],
  results: FightResult[],
  predictions: Prediction[]
): FightWithRelations[] {
  return fights.flatMap((fight) => {
    const event = events.find((e) => e.id === fight.event_id);
    if (!event) return [];
    const result = results.find((r) => r.fight_id === fight.id) ?? null;
    const userPrediction =
      predictions.find((p) => p.fight_id === fight.id) ?? null;
    return [{ ...fight, event, result, userPrediction }];
  });
}
