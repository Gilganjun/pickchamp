import type { PredictedMethod, PredictedOutcome } from "./calculateRatingChange";

export interface PredictionValidationInput {
  predictedOutcome?: PredictedOutcome | null;
  predictedMethod?: PredictedMethod | null;
  predictedRound?: number | null;
  scheduledRounds: number;
  sport: "boxing" | "mma";
  isLocked: boolean;
  isLoggedIn: boolean;
}

export interface PredictionValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePrediction(
  input: PredictionValidationInput
): PredictionValidationResult {
  const errors: string[] = [];

  if (!input.isLoggedIn) {
    errors.push("You must be logged in to submit a prediction.");
  }

  if (input.isLocked) {
    errors.push("This fight is locked. Predictions can no longer be edited.");
  }

  if (!input.predictedOutcome) {
    errors.push("Winner prediction is required.");
  }

  if (
    input.predictedOutcome === "draw" &&
    input.sport !== "boxing"
  ) {
    errors.push("Draw is only available for boxing fights.");
  }

  if (
    input.predictedMethod === "submission" &&
    input.sport !== "mma"
  ) {
    errors.push("Submission method is only available for MMA.");
  }

  if (input.predictedRound != null) {
    if (
      !Number.isInteger(input.predictedRound) ||
      input.predictedRound < 1 ||
      input.predictedRound > input.scheduledRounds
    ) {
      errors.push(
        `Round must be between 1 and ${input.scheduledRounds} for this fight.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
