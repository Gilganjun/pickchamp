export interface RatingTierInfo {
  currentTierName: string;
  currentTierMin: number;
  currentTierMax: number | null;
  nextTierName: string | null;
  pointsIntoTier: number;
  pointsToNextTier: number;
  progressPercent: number;
  isMaxTier: boolean;
  /** Internal numeric rating (unchanged storage value). */
  rawRating: number;
  /** @deprecated Use rawRating — kept for existing callers. */
  rating: number;
  tierSpan: number;
}

/** Display-only progression ladder. Does not affect V2 scoring math. */
const DISPLAY_TIERS = [
  { name: "NOVICE", min: 0, max: 999 },
  { name: "ROOKIE", min: 1000, max: 1049 },
  { name: "PROSPECT", min: 1050, max: 1099 },
  { name: "CONTENDER", min: 1100, max: 1149 },
  { name: "#1 CONTENDER", min: 1150, max: 1199 },
  { name: "TITLE CHALLENGER", min: 1200, max: 1249 },
  { name: "WORLD TITLE CHALLENGER", min: 1250, max: 1299 },
  { name: "CHAMPION", min: 1300, max: 1399 },
  { name: "UNIFIED CHAMPION", min: 1400, max: 1499 },
  { name: "UNDISPUTED CHAMPION", min: 1500, max: 1649 },
  { name: "HALL OF FAME", min: 1650, max: 1799 },
  { name: "ALL-TIME GREAT", min: 1800, max: null as number | null },
] as const;

export function normalizeRating(rating: number | null | undefined): number {
  if (rating == null || Number.isNaN(rating)) return 1000;
  return Math.max(0, Math.floor(rating));
}

export function formatTierDisplayName(tierName: string): string {
  if (tierName.startsWith("#")) return tierName;
  return tierName
    .split(" ")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export function getRatingTier(
  ratingInput: number | null | undefined
): RatingTierInfo {
  const rawRating = normalizeRating(ratingInput);

  let tierIndex = DISPLAY_TIERS.findIndex(
    (tier) =>
      tier.max == null
        ? rawRating >= tier.min
        : rawRating >= tier.min && rawRating <= tier.max
  );
  if (tierIndex < 0) tierIndex = 0;

  const current = DISPLAY_TIERS[tierIndex];
  const isMaxTier = current.max == null;
  const next = isMaxTier ? null : DISPLAY_TIERS[tierIndex + 1];

  const tierSpan = isMaxTier ? 1 : current.max! - current.min + 1;
  const pointsIntoTier = isMaxTier ? 0 : rawRating - current.min;
  const pointsToNextTier = isMaxTier ? 0 : next!.min - rawRating;
  const progressPercent = isMaxTier
    ? 100
    : tierSpan > 0
      ? Math.min(100, Math.round((pointsIntoTier / tierSpan) * 100))
      : 0;

  return {
    currentTierName: current.name,
    currentTierMin: current.min,
    currentTierMax: current.max,
    nextTierName: next?.name ?? null,
    pointsIntoTier,
    pointsToNextTier,
    progressPercent,
    isMaxTier,
    rawRating,
    rating: rawRating,
    tierSpan,
  };
}

export function getPointsUntilNextLabel(tier: RatingTierInfo): string {
  if (tier.isMaxTier) return "Maximum rank reached";
  return `${tier.pointsToNextTier} pts to ${tier.nextTierName}`;
}

export function getTowardNextLabel(tier: RatingTierInfo): string {
  if (tier.isMaxTier) return "Maximum rank reached";
  return `${tier.pointsIntoTier} / ${tier.tierSpan} to ${tier.nextTierName}`;
}

export function getTierProgressPercentLabel(tier: RatingTierInfo): string {
  if (tier.isMaxTier) return "Maximum rank reached";
  return `${tier.progressPercent}% to ${tier.nextTierName}`;
}

export function getTierProgressFractionLabel(tier: RatingTierInfo): string {
  if (tier.isMaxTier) return "Maximum rank reached";
  return `${tier.pointsIntoTier} / ${tier.tierSpan} to ${tier.nextTierName}`;
}

/** User-facing PickFist Score within the current display rank band. */
export function getPickFistScoreDisplay(tier: RatingTierInfo): string {
  if (tier.isMaxTier) return "100 / 100";
  return `${tier.pointsIntoTier} / ${tier.tierSpan}`;
}

export function getPointsToNextRankLabel(tier: RatingTierInfo): string {
  if (tier.isMaxTier) return "Maximum rank reached";
  return `${tier.pointsToNextTier} points to ${tier.nextTierName}`;
}

/** Threshold table for docs/tests — display ranks only. */
export const DISPLAY_TIER_THRESHOLDS = DISPLAY_TIERS.map((tier) => ({
  name: tier.name,
  min: tier.min,
  max: tier.max,
}));
