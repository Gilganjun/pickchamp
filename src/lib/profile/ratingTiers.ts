export interface RatingTierInfo {
  currentTierName: string;
  currentTierMin: number;
  currentTierMax: number | null;
  nextTierName: string | null;
  pointsIntoTier: number;
  pointsToNextTier: number;
  progressPercent: number;
  isMaxTier: boolean;
  rating: number;
  tierSpan: number;
}

const TIERS = [
  { name: "ROOKIE", min: 0, max: 999 },
  { name: "PROSPECT", min: 1000, max: 1099 },
  { name: "CONTENDER", min: 1100, max: 1249 },
  { name: "TITLE CHALLENGER", min: 1250, max: 1499 },
  { name: "CHAMPION", min: 1500, max: 1799 },
  { name: "HALL OF FAME", min: 1800, max: null as number | null },
] as const;

export function normalizeRating(rating: number | null | undefined): number {
  if (rating == null || Number.isNaN(rating)) return 1000;
  return Math.max(0, Math.floor(rating));
}

export function formatTierDisplayName(tierName: string): string {
  return tierName
    .split(" ")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export function getRatingTier(
  ratingInput: number | null | undefined
): RatingTierInfo {
  const rating = normalizeRating(ratingInput);

  let tierIndex = TIERS.findIndex(
    (tier) =>
      tier.max == null
        ? rating >= tier.min
        : rating >= tier.min && rating <= tier.max
  );
  if (tierIndex < 0) tierIndex = 0;

  const current = TIERS[tierIndex];
  const isMaxTier = current.max == null;
  const next = isMaxTier ? null : TIERS[tierIndex + 1];

  const tierSpan = isMaxTier ? 1 : current.max! - current.min + 1;
  const pointsIntoTier = isMaxTier ? 0 : rating - current.min;
  const pointsToNextTier = isMaxTier ? 0 : next!.min - rating;
  const progressPercent = isMaxTier
    ? 100
    : Math.min(100, Math.round((pointsIntoTier / tierSpan) * 100));

  return {
    currentTierName: current.name,
    currentTierMin: current.min,
    currentTierMax: current.max,
    nextTierName: next?.name ?? null,
    pointsIntoTier,
    pointsToNextTier,
    progressPercent,
    isMaxTier,
    rating,
    tierSpan,
  };
}

export function getPointsUntilNextLabel(tier: RatingTierInfo): string {
  if (tier.isMaxTier) return "Maximum tier reached";
  const next = formatTierDisplayName(tier.nextTierName!);
  const pts = tier.pointsToNextTier;
  return `${pts} point${pts === 1 ? "" : "s"} until ${next}`;
}

export function getTowardNextLabel(tier: RatingTierInfo): string {
  if (tier.isMaxTier) return "Maximum tier reached";
  const next = formatTierDisplayName(tier.nextTierName!);
  return `${tier.pointsIntoTier} / ${tier.tierSpan} toward ${next}`;
}
