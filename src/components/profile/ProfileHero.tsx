import { ProfileQuickStats } from "@/components/profile/ProfileQuickStats";
import { ProgressBar } from "@/components/profile/ProgressBar";
import { RankGraphic } from "@/components/profile/RankGraphic";
import {
  getEligibilityThreshold,
  getGradedCountForTab,
  getPredictorTitle,
  getProgress,
} from "@/lib/profile/display";
import { getTierIndex } from "@/lib/profile/rankGraphics";
import {
  getPickFistScoreDisplay,
  getPointsToNextRankLabel,
  getRatingTier,
} from "@/lib/profile/ratingTiers";
import { cn } from "@/lib/utils";
import type { Profile, RankDisplay } from "@/types";

interface ProfileHeroProps {
  profile: Profile;
  rank: RankDisplay;
  accuracy: number;
  totalPicks: number;
  currentStreak: number;
  perfectPicks: number;
}

function qualificationLine(
  rank: RankDisplay,
  remaining: number
): string | null {
  if (rank.status === "official") return null;
  if (rank.status === "inactive") {
    return "Make your first pick to enter rankings";
  }
  return `${remaining} pick${remaining === 1 ? "" : "s"} to enter rankings`;
}

export function ProfileHero({
  profile,
  rank,
  accuracy,
  totalPicks,
  currentStreak,
  perfectPicks,
}: ProfileHeroProps) {
  const initials =
    profile.avatar_initials ?? profile.username.slice(0, 2).toUpperCase();
  const tier = getRatingTier(profile.global_rating);
  const predictorTitle = getPredictorTitle(profile.global_rating);
  const threshold = getEligibilityThreshold("global");
  const graded = getGradedCountForTab(profile, "global");
  const qualification = getProgress(graded, threshold);
  const isOfficial = rank.status === "official";
  const qualLine = qualificationLine(rank, qualification.remaining);
  const tierIndex = getTierIndex(tier.currentTierName);
  const pickFistScore = getPickFistScoreDisplay(tier);

  return (
    <section className="rounded-xl border border-[#2a2a2a] bg-gradient-to-br from-[#181818] to-[#111111] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold text-white">
            @{profile.username}
          </h1>
          <p className="text-[10px] font-semibold text-[#d4a853]">
            {predictorTitle}
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
          <RankGraphic tierName={tier.currentTierName} size="sm" />
          <p className="mt-0.5 text-center text-[7px] font-bold uppercase leading-none tracking-wide text-[#d4a853]">
            Tier {tierIndex} of 12
          </p>
        </div>

        <div className="min-w-0 px-1 text-center">
          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">
            PickFist Score
          </p>
          <p className="mt-0.5 text-2xl font-black tabular-nums leading-none text-[#d4a853]">
            {pickFistScore}
          </p>
          {!tier.isMaxTier ? (
            <div className="mt-2">
              <ProgressBar percent={tier.progressPercent} variant="gold" />
              <p className="mt-1 text-[9px] font-semibold text-zinc-400">
                {getPointsToNextRankLabel(tier)}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-[9px] font-semibold text-zinc-400">
              Maximum rank reached
            </p>
          )}
        </div>

        <div className="min-w-[4.5rem] border-l border-[#2a2a2a] pl-2 text-center">
          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">
            Global Rank
          </p>
          {isOfficial ? (
            <>
              <p className="mt-0.5 text-xl font-black tabular-nums leading-none text-white">
                #{rank.rank?.toLocaleString() ?? "—"}
              </p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-400">
                World
              </p>
            </>
          ) : (
            <>
              <p
                className={cn(
                  "mt-0.5 font-black uppercase leading-none tracking-tight text-white",
                  qualLine && qualLine.length > 22 ? "text-sm" : "text-base"
                )}
              >
                Unranked
              </p>
              {qualLine ? (
                <p className="mt-1 text-[8px] leading-tight text-zinc-500">
                  {qualLine}
                </p>
              ) : null}
            </>
          )}
        </div>
      </div>

      <ProfileQuickStats
        accuracy={accuracy}
        totalPicks={totalPicks}
        currentStreak={currentStreak}
        perfectPicks={perfectPicks}
      />
    </section>
  );
}
