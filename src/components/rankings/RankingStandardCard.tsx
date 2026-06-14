import Link from "next/link";
import { formatSportRecord, getProfilePublicName } from "@/lib/profile/display";
import { formatTierDisplayName, getRatingTier } from "@/lib/profile/ratingTiers";
import { formatPickFistScore } from "@/lib/rankings/rankingsDisplay";
import { cn, getInitials } from "@/lib/utils";
import type { Profile, RankingTab } from "@/types";

interface RankingStandardCardProps {
  rank: number;
  profile: Profile;
  rating: number;
  accuracy: number;
  picks: number;
  tab: RankingTab;
  isCurrentUser?: boolean;
}

export function RankingStandardCard({
  rank,
  profile,
  rating,
  accuracy,
  picks,
  tab,
  isCurrentUser = false,
}: RankingStandardCardProps) {
  const tier = getRatingTier(rating);
  const tierLabel = formatTierDisplayName(tier.currentTierName);
  const correct =
    tab === "boxing"
      ? profile.boxing_correct
      : tab === "mma"
        ? profile.mma_correct
        : profile.total_correct;
  const incorrect = Math.max(0, picks - correct);
  const publicName = getProfilePublicName(profile);

  return (
    <Link
      href={`/profile/${profile.username}`}
      className={cn(
        "block rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2.5 transition-colors hover:border-[#3a3a3a] hover:bg-[#141414] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4a853]",
        isCurrentUser && "border-red-500/35 bg-[#141010]"
      )}
      aria-label={`Rank ${rank}, ${publicName}, ${formatPickFistScore(rating)} PickFist Score`}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex w-9 shrink-0 flex-col items-center">
          <span className="font-[family-name:var(--font-teko)] text-xl font-bold tabular-nums leading-none text-white">
            {rank}
          </span>
          {isCurrentUser ? (
            <span className="mt-0.5 text-[7px] font-black uppercase tracking-wide text-red-500">
              You
            </span>
          ) : null}
        </div>

        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#181818] text-[10px] font-bold text-red-500 ring-1 ring-[#2a2a2a]"
          aria-hidden
        >
          {profile.avatar_initials ?? getInitials(publicName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-semibold text-white">
              {publicName}
            </p>
            <p className="shrink-0 font-[family-name:var(--font-teko)] text-lg font-bold tabular-nums leading-none text-white">
              {formatPickFistScore(rating)}
            </p>
          </div>
          <p className="mt-0.5 text-[10px] text-zinc-500">
            <span className="font-bold uppercase tracking-wide text-[#d4a853]/90">
              {tierLabel}
            </span>
            {" · "}
            {formatSportRecord(correct, incorrect, accuracy)}
          </p>
        </div>
      </div>
    </Link>
  );
}
