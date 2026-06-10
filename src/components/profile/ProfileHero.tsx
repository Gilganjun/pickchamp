import { ProfileQuickStats } from "@/components/profile/ProfileQuickStats";
import { ProgressBar } from "@/components/profile/ProgressBar";
import { RankGraphic } from "@/components/profile/RankGraphic";
import { RankingTitleHeader } from "@/components/profile/RankingTitleHeader";
import { WorldRankDisplay } from "@/components/profile/WorldRankDisplay";
import {
  getGlobalRankHeroState,
  getLockedPickCount,
} from "@/lib/profile/display";
import { getTierIndex } from "@/lib/profile/rankGraphics";
import {
  formatTierDisplayName,
  getPickFistScoreDisplay,
  getRatingTier,
} from "@/lib/profile/ratingTiers";
import { PickRecordHeroButton } from "@/components/profile/PickRecordHeroButton";
import { cn } from "@/lib/utils";
import type { PickRecordCounts } from "@/lib/pickRecord/pickRecord";
import type { FightWithRelations, Profile, Prediction, RankDisplay } from "@/types";

interface ProfileHeroProps {
  profile: Profile;
  rank: RankDisplay;
  predictions: Prediction[];
  fights: FightWithRelations[];
  accuracy: number;
  pickRecordCounts?: PickRecordCounts | null;
}

export function ProfileHero({
  profile,
  rank,
  predictions,
  fights,
  accuracy,
  pickRecordCounts = null,
}: ProfileHeroProps) {
  const initials =
    profile.avatar_initials ?? profile.username.slice(0, 2).toUpperCase();
  const tier = getRatingTier(profile.global_rating);
  const levelName = formatTierDisplayName(tier.currentTierName);
  const lockedPickCount = getLockedPickCount(predictions, fights);
  const globalRankState = getGlobalRankHeroState(lockedPickCount, rank);
  const tierIndex = getTierIndex(tier.currentTierName);
  const pickFistScore = getPickFistScoreDisplay(tier);
  const nextLevelName = tier.nextTierName
    ? formatTierDisplayName(tier.nextTierName)
    : "";

  return (
    <section className="rounded-xl border border-[#2a2a2a] bg-gradient-to-br from-[#181818] to-[#111111] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <h1 className="truncate text-sm font-bold text-white">
              @{profile.username}
            </h1>
            {pickRecordCounts ? (
              <PickRecordHeroButton counts={pickRecordCounts} />
            ) : null}
          </div>
          <p className="font-[family-name:var(--font-teko)] text-2xl font-bold uppercase leading-none tracking-wide text-[#d4a853]">
            {levelName}
          </p>
          <p className="mt-0.5 text-[9px] font-bold uppercase leading-none tracking-wide text-[#d4a853]/90">
            Level {tierIndex} of 12
          </p>
        </div>
        <div className="relative shrink-0">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0a0a] text-xs font-black text-red-500 ring-1 ring-[#d4a853]/50"
            aria-hidden
          >
            {initials}
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#111111] bg-green-500"
            aria-hidden
          />
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-[auto_1fr_auto] items-center gap-1.5">
        <div className="flex shrink-0 flex-col items-center px-0.5">
          <RankGraphic tierName={tier.currentTierName} size="sm" showLabel={false} />
        </div>

        <div className="min-w-0 px-1 text-center">
          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">
            Level Progress
          </p>
          <p className="mt-0.5 text-lg font-black tabular-nums leading-none text-[#d4a853]">
            {pickFistScore}
          </p>
          {!tier.isMaxTier ? (
            <div className="mt-1.5">
              <div className="mx-auto max-w-[6.5rem]">
                <ProgressBar
                  percent={tier.progressPercent}
                  variant="gold"
                  className="h-1.5"
                />
              </div>
              <p className="mt-1.5 leading-tight">
                <span className="text-[8px] font-bold uppercase tracking-wide text-zinc-400">
                  {tier.pointsToNextTier} points to
                </span>
                <br />
                <span
                  className={cn(
                    "font-[family-name:var(--font-teko)] font-bold uppercase leading-none tracking-wide text-[#d4a853]",
                    nextLevelName.length > 16
                      ? "text-xs"
                      : nextLevelName.length > 12
                        ? "text-sm"
                        : "text-base"
                  )}
                >
                  {nextLevelName}
                </span>
              </p>
            </div>
          ) : (
            <p className="mt-1.5 text-[8px] font-bold uppercase tracking-wide text-zinc-400">
              Maximum level reached
            </p>
          )}
        </div>

        <div className="min-w-[6.75rem] border-l border-[#2a2a2a] pl-2.5">
          <RankingTitleHeader
            name="Global"
            nameClassName="text-[#d4a853]"
            align="center"
            size="hero"
          />
          <div className="mt-2 flex justify-center">
            <WorldRankDisplay
              state={globalRankState}
              label=""
              variant="sport"
              className="text-center"
            />
          </div>
        </div>
      </div>

      <ProfileQuickStats
        accuracy={accuracy}
        totalPicks={profile.total_picks}
        wins={profile.total_correct}
        perfectPicks={profile.perfect_picks}
      />
    </section>
  );
}
