import type { EffectiveTier } from "./tierTypes";

export interface TierRatingValues {
  correct: number;
  wrong: number;
}

/** Central difficulty-based rating table (V2). Do not scatter these values. */
export const TIER_RATINGS: Record<EffectiveTier, TierRatingValues> = {
  heavy_favourite: { correct: 5, wrong: -15 },
  favourite: { correct: 10, wrong: -12 },
  even: { correct: 15, wrong: -15 },
  underdog: { correct: 25, wrong: -10 },
  heavy_underdog: { correct: 40, wrong: -8 },
  draw: { correct: 20, wrong: -15 },
};

export function getTierRatingValues(tier: EffectiveTier): TierRatingValues {
  return TIER_RATINGS[tier];
}
