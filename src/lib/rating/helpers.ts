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

export function isFinishMethod(method: string | null | undefined): boolean {
  if (!method) return false;
  return ["ko_tko", "submission", "dq", "technical_decision"].includes(method);
}
