export type Sport = "boxing" | "mma";

export type FightStatus =
  | "upcoming"
  | "locked"
  | "result_pending"
  | "settled"
  | "cancelled"
  | "no_contest";

export type PredictedOutcome = "fighterA" | "fighterB" | "draw";

export type PredictedMethod =
  | "decision"
  | "ko_tko"
  | "submission"
  | "dq"
  | "technical_decision"
  | "draw";

export type ResultOutcome =
  | "fighterA"
  | "fighterB"
  | "draw"
  | "no_contest"
  | "cancelled";

export type ResultMethod =
  | "decision"
  | "ko_tko"
  | "submission"
  | "dq"
  | "technical_decision"
  | "draw"
  | "no_contest"
  | "cancelled";

export type FavouriteSide = "fighterA" | "fighterB" | "none";

export type FavouriteLevel = "heavy_favourite" | "favourite" | "even";

/** Editorial marketing tier — optional, set manually in mock/seed data. */
export type EventCardTier = "featured" | "title_fight" | "hot" | "test";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_initials: string | null;
  global_rating: number;
  boxing_rating: number;
  mma_rating: number;
  total_picks: number;
  total_correct: number;
  boxing_picks: number;
  boxing_correct: number;
  mma_picks: number;
  mma_correct: number;
  perfect_picks: number;
  current_streak: number;
  best_streak: number;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
}

/** Billing entitlement — separate from profile identity. */
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export interface Subscription {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  trial_started_at: string;
  trial_ends_at: string;
  checkout_trial_adjusted_at: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  promotion: string | null;
  location: string | null;
  /** IANA timezone for display (e.g. Europe/London). Overrides location inference. */
  timezone?: string | null;
  event_date: string;
  /** Editorial badge for enhanced event cards (mock/seed only until DB column exists). */
  card_tier?: EventCardTier | null;
  created_at: string;
  updated_at: string;
}

export interface Fight {
  id: string;
  event_id: string;
  sport: Sport;
  fighter_a_name: string;
  fighter_b_name: string;
  scheduled_rounds: number;
  weight_class: string | null;
  fight_order: number | null;
  lock_time: string;
  status: FightStatus;
  favourite_side: FavouriteSide;
  favourite_level: FavouriteLevel;
  created_at: string;
  updated_at: string;
  event?: Event;
}

export interface FightResult {
  id: string;
  fight_id: string;
  outcome: ResultOutcome;
  method: ResultMethod;
  result_round: number | null;
  official_notes: string | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  fight_id: string;
  predicted_outcome: PredictedOutcome;
  predicted_method: PredictedMethod | null;
  predicted_round: number | null;
  created_at: string;
  updated_at: string;
  locked_at: string | null;
  graded_at: string | null;
  rating_change: number | null;
  main_correct: boolean | null;
  method_correct: boolean | null;
  round_correct: boolean | null;
  perfect_pick: boolean | null;
  grading_details: Record<string, unknown> | null;
}

export interface FightWithRelations extends Fight {
  event: Event;
  result?: FightResult | null;
  userPrediction?: Prediction | null;
}

export type PickTab = "upcoming" | "live" | "settled";
export type SportFilter = "all" | Sport;
export type RankingTab = "global" | "boxing" | "mma";

export interface RankDisplay {
  label: string;
  status: "inactive" | "provisional" | "official";
  rank?: number;
  progress?: string;
}
