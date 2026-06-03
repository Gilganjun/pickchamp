export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculatePopularity(
  countForOutcome: number,
  totalPredictions: number
): number {
  if (totalPredictions <= 0) return 0;
  return countForOutcome / totalPredictions;
}

export function isNearRound(
  predictedRound: number | null | undefined,
  resultRound: number | null | undefined
): boolean {
  if (
    predictedRound == null ||
    resultRound == null ||
    predictedRound < 1 ||
    resultRound < 1
  ) {
    return false;
  }
  return Math.abs(predictedRound - resultRound) <= 1;
}

export function isFinishMethod(method: string | null | undefined): boolean {
  if (!method) return false;
  return ["ko_tko", "submission", "dq", "technical_decision"].includes(method);
}
