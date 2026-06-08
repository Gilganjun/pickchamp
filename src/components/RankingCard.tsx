import { WorldGlobeIcon } from "@/components/profile/WorldGlobeIcon";
import { formatSportRecord } from "@/lib/profile/display";
import { formatTierDisplayName, getRatingTier } from "@/lib/profile/ratingTiers";
import { getInitials } from "@/lib/utils";
import type { Profile, RankingTab } from "@/types";

interface RankingCardProps {
  rank: number;
  profile: Profile;
  rating: number;
  accuracy: number;
  picks: number;
  tab: RankingTab;
}

export function RankingCard({
  rank,
  profile,
  rating,
  accuracy,
  picks,
  tab,
}: RankingCardProps) {
  const tier = getRatingTier(rating);
  const tierLabel = formatTierDisplayName(tier.currentTierName);
  const correct =
    tab === "boxing"
      ? profile.boxing_correct
      : tab === "mma"
        ? profile.mma_correct
        : profile.total_correct;
  const incorrect = Math.max(0, picks - correct);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
      <div className="flex w-10 shrink-0 flex-col items-center gap-0.5">
        <WorldGlobeIcon size={12} className="text-zinc-500" />
        <span className="text-center text-lg font-black tabular-nums text-white">
          #{rank}
        </span>
      </div>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#181818] text-xs font-bold text-red-500 ring-1 ring-[#2a2a2a]"
        aria-hidden
      >
        {profile.avatar_initials ?? getInitials(profile.username)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{profile.username}</p>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#d4a853]">
          {tierLabel}
        </p>
        <p className="text-xs text-zinc-500">
          {formatSportRecord(correct, incorrect, accuracy)}
        </p>
      </div>
    </div>
  );
}
