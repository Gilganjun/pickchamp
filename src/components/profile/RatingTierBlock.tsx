import { ProgressBar } from "@/components/profile/ProgressBar";
import {
  getRatingTier,
  getTierProgressFractionLabel,
  getTierProgressPercentLabel,
} from "@/lib/profile/ratingTiers";
import { cn } from "@/lib/utils";

interface RatingTierBlockProps {
  rating: number | null | undefined;
  compact?: boolean;
  className?: string;
}

export function RatingTierBlock({
  rating,
  compact = false,
  className,
}: RatingTierBlockProps) {
  const tier = getRatingTier(rating);

  return (
    <div className={cn(compact ? "mt-2" : "mt-5", className)}>
      <p
        className={cn(
          "font-black uppercase tracking-widest text-white",
          compact ? "text-sm" : "text-2xl"
        )}
      >
        {tier.currentTierName}
      </p>

      {!tier.isMaxTier ? (
        <>
          <p
            className={cn(
              "font-medium text-[#d4a853]",
              compact ? "mt-1 text-xs" : "mt-2 text-sm"
            )}
          >
            {getTierProgressPercentLabel(tier)}
          </p>
          <div className={cn(compact ? "mt-2" : "mt-3")}>
            <ProgressBar percent={tier.progressPercent} variant="gold" />
          </div>
          <p
            className={cn(
              "text-zinc-500",
              compact ? "mt-1 text-[10px]" : "mt-2 text-xs"
            )}
          >
            {getTierProgressFractionLabel(tier)}
          </p>
        </>
      ) : null}

      <p
        className={cn(
          "text-zinc-600",
          compact ? "mt-1 text-[10px]" : "mt-2 text-xs"
        )}
      >
        Internal rating (advanced): {tier.rawRating}
      </p>
    </div>
  );
}
