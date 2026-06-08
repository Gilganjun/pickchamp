import { ProgressBar } from "@/components/profile/ProgressBar";
import { RankGraphic } from "@/components/profile/RankGraphic";
import { RankingTitleHeader } from "@/components/profile/RankingTitleHeader";
import { WorldRankDisplay } from "@/components/profile/WorldRankDisplay";
import {
  formatSportRecord,
  getLockedPickCountForSport,
  getSportPickStats,
  getSportRankHeroState,
} from "@/lib/profile/display";
import {
  formatTierDisplayName,
  getPointsToNextRankLabel,
  getRatingTier,
} from "@/lib/profile/ratingTiers";
import { cn } from "@/lib/utils";
import type {
  FightWithRelations,
  Prediction,
  Profile,
  RankDisplay,
  Sport,
} from "@/types";

interface SportBreakdownCardProps {
  sport: Sport;
  profile: Profile;
  rank: RankDisplay;
  rating: number;
  predictions: Prediction[];
  fights: FightWithRelations[];
  compact?: boolean;
}

const SPORT_META: Record<
  Sport,
  {
    label: string;
    icon: string;
    accent: string;
    accentBg: string;
    barVariant: "red" | "gold";
  }
> = {
  boxing: {
    label: "Boxing",
    icon: "🥊",
    accent: "text-red-400",
    accentBg: "from-red-950/40",
    barVariant: "red",
  },
  mma: {
    label: "MMA",
    icon: "⚡",
    accent: "text-purple-400",
    accentBg: "from-purple-950/40",
    barVariant: "gold",
  },
};

export function SportBreakdownCard({
  sport,
  profile,
  rank,
  rating,
  predictions,
  fights,
  compact = false,
}: SportBreakdownCardProps) {
  const meta = SPORT_META[sport];
  const tier = getRatingTier(rating);
  const pickStats = getSportPickStats(profile, sport);
  const lockedPickCount = getLockedPickCountForSport(predictions, fights, sport);
  const rankState = getSportRankHeroState(sport, lockedPickCount, rank);
  const sportBorder =
    sport === "boxing" ? "border-red-600/40" : "border-purple-600/40";
  const progressLabel = tier.isMaxTier
    ? "Max rank"
    : getPointsToNextRankLabel(tier).replace(" points", " pts");

  if (compact) {
    return (
      <article
        className={cn(
          "rounded-lg border bg-gradient-to-b to-[#0d0d0d] p-3",
          meta.accentBg,
          sportBorder
        )}
      >
        <RankingTitleHeader
          name={meta.label}
          nameClassName={meta.accent}
          trailing={meta.icon}
        />

        <div className="mt-2.5">
          <WorldRankDisplay state={rankState} label="" variant="sport" />
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 border-t border-white/5 pt-2.5">
          <RankGraphic tierName={tier.currentTierName} size="xs" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-black uppercase leading-tight tracking-wide text-zinc-200">
              {formatTierDisplayName(tier.currentTierName)}
            </p>
            {!tier.isMaxTier ? (
              <>
                <p className="mt-0.5 text-[8px] leading-tight text-zinc-500">
                  {progressLabel}
                </p>
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

        {pickStats.picks > 0 ? (
          <p className="mt-2 text-[9px] tabular-nums text-zinc-500">
            {formatSportRecord(
              pickStats.correct,
              pickStats.incorrect,
              pickStats.accuracy
            )}
          </p>
        ) : null}
      </article>
    );
  }

  return (
    <section
      className={cn(
        "rounded-xl border bg-gradient-to-b to-[#111111] p-4",
        meta.accentBg,
        sportBorder
      )}
    >
      <RankingTitleHeader
        name={meta.label}
        nameClassName={meta.accent}
        trailing={meta.icon}
      />

      <div className="mt-3">
        <WorldRankDisplay state={rankState} label="" variant="sport" />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <RankGraphic tierName={tier.currentTierName} size="sm" />
        <p className="text-xs font-black uppercase tracking-wide text-zinc-200">
          {formatTierDisplayName(tier.currentTierName)}
        </p>
      </div>

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

      {pickStats.picks > 0 && (
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
    </section>
  );
}
