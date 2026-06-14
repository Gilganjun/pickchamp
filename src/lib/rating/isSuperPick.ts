import type { PredictedMethod } from "./calculateRatingChange";
import { isFinishMethod } from "./helpers";
import type { EffectiveTier } from "./tierTypes";

export interface EvaluateSuperPickInput {
  effectiveTier: EffectiveTier;
  mainCorrect: boolean;
  methodCorrect: boolean | null;
  roundCorrect: boolean | null;
  predictedMethod: PredictedMethod;
  resultMethod: PredictedMethod | "no_contest" | "cancelled" | null | undefined;
}

/** Maximum-value heavy-underdog prediction (finish or decision path). */
export function evaluateSuperPick(input: EvaluateSuperPickInput): boolean {
  if (!input.mainCorrect) return false;
  if (input.effectiveTier !== "heavy_underdog") return false;
  if (input.methodCorrect !== true) return false;

  const resultMethod = input.resultMethod ?? "decision";
  if (resultMethod === "no_contest" || resultMethod === "cancelled") {
    return false;
  }

  if (isFinishMethod(resultMethod)) {
    return input.roundCorrect === true;
  }

  return input.predictedMethod === "decision";
}
