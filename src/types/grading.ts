export interface GradingSummary {
  totalPredictions: number;
  fighterAPickCount: number;
  fighterBPickCount: number;
  drawPickCount: number;
  popularity?: {
    fighterA: number;
    fighterB: number;
    draw: number;
  };
  correctCount: number;
  averageRatingChange: number;
  largestGain: number;
  largestLoss: number;
}
