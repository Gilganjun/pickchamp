import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types";

interface RankingCardProps {
  rank: number;
  profile: Profile;
  rating: number;
  accuracy: number;
  picks: number;
}

export function RankingCard({
  rank,
  profile,
  rating,
  accuracy,
  picks,
}: RankingCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
      <span className="w-8 text-center text-lg font-black text-zinc-500">
        {rank}
      </span>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#181818] text-xs font-bold text-red-500 ring-1 ring-[#2a2a2a]"
        aria-hidden
      >
        {profile.avatar_initials ?? getInitials(profile.username)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{profile.username}</p>
        <p className="text-xs text-zinc-500">
          {picks} picks · {accuracy}% acc
        </p>
      </div>
      <div className="text-right">
        <p className="text-lg font-black text-[#d4a853]">{rating}</p>
        <p className="text-[10px] uppercase text-zinc-500">Rating</p>
      </div>
    </div>
  );
}
