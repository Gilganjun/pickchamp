export const DEFAULT_RATING = 1000;

export const METHOD_CORRECT_BONUS = 4;
export const METHOD_WRONG_PENALTY = -2;

export const ROUND_EXACT_BONUS = 8;
export const ROUND_WRONG_PENALTY = -3;

export const PERFECT_PICK_BONUS = 5;

export const MAX_TOTAL_GAIN_PER_FIGHT = 75;
export const MAX_TOTAL_LOSS_PER_FIGHT = -20;

export const GLOBAL_RANK_ELIGIBILITY = 10;
export const BOXING_RANK_ELIGIBILITY = 5;
export const MMA_RANK_ELIGIBILITY = 5;

export const FINISH_METHODS = [
  "ko_tko",
  "submission",
  "dq",
  "technical_decision",
] as const;
