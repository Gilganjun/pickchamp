import type { EffectiveTier, FavouriteLevel, FavouriteSide } from "./tierTypes";

export interface PopularityDistribution {
  fighterA: number;
  fighterB: number;
  draw: number;
}

export interface GradingDetails {
  effectiveTier: EffectiveTier;
  favouriteSide: FavouriteSide;
  favouriteLevel: FavouriteLevel;
  baseTierScore: number;
  methodAdjustment: number;
  roundAdjustment: number;
  perfectBonus: number;
  popularity: PopularityDistribution;
  finalRatingChange: number;
  explanation: string;
  voided?: boolean;
  isSuperPick?: boolean;
  superPickPoints?: number;
}

export function buildPopularityPercentages(
  counts: { fighterA: number; fighterB: number; draw: number },
  total: number
): PopularityDistribution {
  if (total <= 0) {
    return { fighterA: 0, fighterB: 0, draw: 0 };
  }
  const pct = (n: number) => Math.round((n / total) * 1000) / 10;
  return {
    fighterA: pct(counts.fighterA),
    fighterB: pct(counts.fighterB),
    draw: pct(counts.draw),
  };
}
