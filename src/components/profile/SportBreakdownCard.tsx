import { ProgressBar } from "@/components/profile/ProgressBar";
import {
  formatRankStatus,
  getEligibilityThreshold,
  getGradedCountForTab,
  getProgress,
  getSportPickStats,
} from "@/lib/profile/display";
import type { Profile, RankDisplay, Sport } from "@/types";

interface SportBreakdownCardProps {
  sport: Sport;
  profile: Profile;
  rank: RankDisplay;
  rating: number;
}

const SPORT_META: Record<
  Sport,
  { label: string; icon: string; inactiveCta: string }
> = {
  boxing: {
    label: "Boxing",
    icon: "🥊",
    inactiveCta: "Make your first Boxing pick",
  },
  mma: {
    label: "MMA",
    icon: "⚡",
    inactiveCta: "Make your first MMA pick",
  },
};

export function SportBreakdownCard({
  sport,
  profile,
  rank,
  rating,
}: SportBreakdownCardProps) {
  const meta = SPORT_META[sport];
  const tab = sport;
  const threshold = getEligibilityThreshold(tab);
  const graded = getGradedCountForTab(profile, tab);
  const progress = getProgress(graded, threshold);
  const pickStats = getSportPickStats(profile, sport);

  return (
    <section className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
      <div className="flex items-center gap-2">
        <span className="text-base" aria-hidden>
          {meta.icon}
        </span>
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          {meta.label}
        </h2>
      </div>
      <p className="mt-3 text-xs text-zinc-500">Rating</p>
      <p className="text-2xl font-black tabular-nums text-white">{rating}</p>

      {rank.status === "inactive" && (
        <>
          <p className="mt-3 text-sm font-semibold text-zinc-400">Inactive</p>
          <p className="mt-1 text-xs text-zinc-500">{meta.inactiveCta}</p>
        </>
      )}

      {rank.status === "provisional" && (
        <>
          <p className="mt-3 text-sm font-semibold text-[#d4a853]">
            {formatRankStatus(rank.status)}
          </p>
          <p className="text-xs text-zinc-400">
            {progress.remaining} Pick{progress.remaining === 1 ? "" : "s"} Away
          </p>
          <div className="mt-3">
            <ProgressBar percent={progress.percent} />
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">
            {progress.current} / {threshold}
          </p>
        </>
      )}

      {rank.status === "official" && (
        <>
          <p className="mt-3 text-sm font-semibold text-[#d4a853]">
            Official Rank
          </p>
          <p className="text-xl font-black text-white">
            #{rank.rank?.toLocaleString() ?? "—"}
          </p>
        </>
      )}

      {graded > 0 && (
        <div className="mt-4 border-t border-[#2a2a2a] pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Pick Record
          </p>
          <dl className="mt-2 space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-zinc-500">Correct</dt>
              <dd className="font-semibold tabular-nums text-green-500">
                {pickStats.correct}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-zinc-500">Incorrect</dt>
              <dd className="font-semibold tabular-nums text-red-500">
                {pickStats.incorrect}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-zinc-500">Total Picks</dt>
              <dd className="font-semibold tabular-nums text-zinc-300">
                {pickStats.picks}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-zinc-500">Accuracy</dt>
              <dd className="font-semibold tabular-nums text-zinc-300">
                {pickStats.accuracy}%
              </dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
