import type {
  EffectiveTier,
  FavouriteLevel,
  FavouriteSide,
  PredictedOutcomeForTier,
} from "./tierTypes";

export interface GetEffectivePickTierInput {
  predictedOutcome: PredictedOutcomeForTier;
  favouriteSide: FavouriteSide;
  favouriteLevel: FavouriteLevel;
}

export function getEffectivePickTier(
  input: GetEffectivePickTierInput
): EffectiveTier {
  const { predictedOutcome, favouriteSide, favouriteLevel } = input;

  if (predictedOutcome === "draw") {
    return "draw";
  }

  if (favouriteSide === "none" && favouriteLevel === "even") {
    return "even";
  }

  if (favouriteSide === "fighterA" && favouriteLevel === "heavy_favourite") {
    return predictedOutcome === "fighterA" ? "heavy_favourite" : "heavy_underdog";
  }

  if (favouriteSide === "fighterB" && favouriteLevel === "heavy_favourite") {
    return predictedOutcome === "fighterB" ? "heavy_favourite" : "heavy_underdog";
  }

  if (favouriteSide === "fighterA" && favouriteLevel === "favourite") {
    return predictedOutcome === "fighterA" ? "favourite" : "underdog";
  }

  if (favouriteSide === "fighterB" && favouriteLevel === "favourite") {
    return predictedOutcome === "fighterB" ? "favourite" : "underdog";
  }

  // Fallback for invalid admin combos — treat as even
  return "even";
}
