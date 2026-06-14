import Link from "next/link";
import { ProgressBar } from "@/components/profile/ProgressBar";
import { CrownIcon, MedalIcon } from "@/components/rankings/RankingsIcons";
import { formatSportRecord } from "@/lib/profile/display";
import {
  formatTierDisplayName,
  getRatingTier,
} from "@/lib/profile/ratingTiers";
import {
  formatPickFistScore,
  getPointsToNextTierLabel,
  type PodiumVariant,
} from "@/lib/rankings/rankingsDisplay";
import { cn, getInitials } from "@/lib/utils";
import type { Profile, RankingTab } from "@/types";

const PODIUM_STYLES: Record<
  PodiumVariant,
  {
    border: string;
    rankText: string;
    scoreText: string;
    avatarRing: string;
    barVariant: "gold" | "silver" | "bronze";
  }
> = {
  gold: {
    border:
      "border-[#d4a853]/70 shadow-[0_0_14px_rgba(212,168,83,0.22)] rankings-podium-gold",
    rankText: "text-[#f0c14b]",
    scoreText: "text-[#f0c14b]",
    avatarRing: "ring-[#d4a853]/60",
    barVariant: "gold",
  },
  silver: {
    border: "border-[#c0c0c0]/55 shadow-[0_0_10px_rgba(192,192,192,0.12)]",
    rankText: "text-[#c0c0c0]",
    scoreText: "text-[#c0c0c0]",
    avatarRing: "ring-[#c0c0c0]/50",
    barVariant: "silver",
  },
  bronze: {
    border: "border-[#cd7f32]/55 shadow-[0_0_10px_rgba(205,127,50,0.14)]",
    rankText: "text-[#cd7f32]",
    scoreText: "text-[#cd7f32]",
    avatarRing: "ring-[#cd7f32]/50",
    barVariant: "bronze",
  },
};

interface RankingPodiumCardProps {
  rank: number;
  profile: Profile;
  rating: number;
  accuracy: number;
  picks: number;
  tab: RankingTab;
  variant: PodiumVariant;
  isCurrentUser?: boolean;
}

export function RankingPodiumCard({
  rank,
  profile,
  rating,
  accuracy,
  picks,
  tab,
  variant,
  isCurrentUser = false,
}: RankingPodiumCardProps) {
  const styles = PODIUM_STYLES[variant];
  const tier = getRatingTier(rating);
  const tierLabel = formatTierDisplayName(tier.currentTierName);
  const progressLabel = getPointsToNextTierLabel(tier);
  const correct =
    tab === "boxing"
      ? profile.boxing_correct
      : tab === "mma"
        ? profile.mma_correct
        : profile.total_correct;
  const incorrect = Math.max(0, picks - correct);

  return (
    <Link
      href={`/profile/${profile.username}`}
      className={cn(
        "block rounded-xl border bg-[#111111] p-3 transition-colors hover:bg-[#141414] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a853]",
        styles.border,
        isCurrentUser && "ring-1 ring-red-500/40"
      )}
      aria-label={`Rank ${rank}, ${profile.username}, ${formatPickFistScore(rating)} PickFist Score`}
    >
      <div className="flex gap-3">
        <div className="flex w-11 shrink-0 flex-col items-center">
          {variant === "gold" ? (
            <CrownIcon className="mb-0.5 text-[#f0c14b]" />
          ) : (
            <MedalIcon
              variant={variant === "silver" ? "silver" : "bronze"}
              className="mb-0.5"
            />
          )}
          <span
            className={cn(
              "font-[family-name:var(--font-teko)] text-3xl font-bold leading-none tabular-nums",
              styles.rankText
            )}
          >
            {rank}
          </span>
          {isCurrentUser ? (
            <span className="mt-1 text-[8px] font-black uppercase tracking-wide text-red-500">
              You
            </span>
          ) : null}
        </div>

        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#181818] text-xs font-bold text-red-500 ring-1",
            styles.avatarRing
          )}
          aria-hidden
        >
          {profile.avatar_initials ?? getInitials(profile.username)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">
                {profile.username}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#d4a853]">
                {tierLabel}
              </p>
              <p className="text-[10px] text-zinc-500">
                {formatSportRecord(correct, incorrect, accuracy)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p
                className={cn(
                  "font-[family-name:var(--font-teko)] text-2xl font-bold leading-none tabular-nums",
                  styles.scoreText
                )}
              >
                {formatPickFistScore(rating)}
              </p>
              <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-zinc-500">
                PickFist Score
              </p>
            </div>
          </div>

          {!tier.isMaxTier ? (
            <div className="mt-2">
              <ProgressBar
                percent={tier.progressPercent}
                variant={styles.barVariant}
                className="h-1"
              />
              {progressLabel ? (
                <p className="mt-1 text-[9px] text-zinc-500">{progressLabel}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
