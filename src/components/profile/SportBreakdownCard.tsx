import { ProgressBar } from "@/components/profile/ProgressBar";
import { RankGraphic } from "@/components/profile/RankGraphic";
import {
  formatSportRecord,
  getEligibilityThreshold,
  getGradedCountForTab,
  getProgress,
  getSportPickStats,
} from "@/lib/profile/display";
import {
  formatTierDisplayName,
  getPointsToNextRankLabel,
  getRatingTier,
} from "@/lib/profile/ratingTiers";
import { cn } from "@/lib/utils";
import type { Profile, RankDisplay, Sport } from "@/types";

interface SportBreakdownCardProps {
  sport: Sport;
  profile: Profile;
  rank: RankDisplay;
  rating: number;
  compact?: boolean;
}

const SPORT_META: Record<
  Sport,
  { label: string; icon: string; accent: string; barVariant: "red" | "gold" }
> = {
  boxing: {
    label: "Boxing",
    icon: "🥊",
    accent: "text-red-400",
    barVariant: "red",
  },
  mma: {
    label: "MMA",
    icon: "⚡",
    accent: "text-purple-400",
    barVariant: "gold",
  },
};

export function SportBreakdownCard({
  sport,
  profile,
  rank,
  rating,
  compact = false,
}: SportBreakdownCardProps) {
  const meta = SPORT_META[sport];
  const tier = getRatingTier(rating);
  const threshold = getEligibilityThreshold(sport);
  const graded = getGradedCountForTab(profile, sport);
  const progress = getProgress(graded, threshold);
  const pickStats = getSportPickStats(profile, sport);
  const sportBorder =
    sport === "boxing" ? "border-red-600/30" : "border-purple-600/30";
  const progressLabel = tier.isMaxTier
    ? "Max rank"
    : getPointsToNextRankLabel(tier).replace(" points", " pts");

  if (compact) {
    return (
      <article
        className={cn(
          "rounded-lg border bg-[#0d0d0d] p-2.5",
          sportBorder
        )}
      >
        <div className="flex items-center gap-1.5">
          <RankGraphic tierName={tier.currentTierName} size="xs" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm" aria-hidden>
                {meta.icon}
              </span>
              <h3
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wide",
                  meta.accent
                )}
              >
                {meta.label}
              </h3>
            </div>
            <p className="mt-0.5 text-lg font-black tabular-nums text-white">
              {tier.rawRating}
            </p>
            {!tier.isMaxTier ? (
              <>
                <p className="mt-0.5 text-[8px] text-zinc-500">{progressLabel}</p>
                <div className="mt-1">
                  <ProgressBar
                    percent={tier.progressPercent}
                    variant={meta.barVariant}
                    className="h-1"
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </article>
    );
  }

  return (
    <section
      className={cn(
        "rounded-xl border bg-[#111111] p-4",
        sportBorder
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-base" aria-hidden>
          {meta.icon}
        </span>
        <h2
          className={cn(
            "text-sm font-bold uppercase tracking-wide",
            meta.accent
          )}
        >
          {meta.label}
        </h2>
      </div>

      <p className="mt-3 text-2xl font-black tabular-nums text-white">
        {tier.rawRating}
      </p>
      <p className="mt-1 text-xs font-black uppercase tracking-wide text-zinc-200">
        {formatTierDisplayName(tier.currentTierName)}
      </p>
      {!tier.isMaxTier ? (
        <>
          <p className="mt-1 text-[10px] text-zinc-500">{progressLabel}</p>
          <div className="mt-2">
            <ProgressBar
              percent={tier.progressPercent}
              variant={meta.barVariant}
            />
          </div>
        </>
      ) : null}

      {rank.status === "inactive" && (
        <p className="mt-3 text-xs text-zinc-500">
          Make your first {meta.label} pick
        </p>
      )}

      {graded > 0 && (
        <p className="mt-3 text-sm text-zinc-300">
          Record:{" "}
          <span className="font-semibold text-white">
            {formatSportRecord(
              pickStats.correct,
              pickStats.incorrect,
              pickStats.accuracy
            )}
          </span>
        </p>
      )}

      {rank.status === "provisional" && (
        <p className="mt-2 text-xs text-zinc-400">
          Provisional · {progress.remaining} pick
          {progress.remaining === 1 ? "" : "s"} to rank
        </p>
      )}

      {rank.status === "official" && (
        <p className="mt-2 text-xs text-zinc-400">
          #{rank.rank?.toLocaleString() ?? "—"} {meta.label}
        </p>
      )}
    </section>
  );
}
