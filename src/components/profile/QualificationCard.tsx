import { ProgressBar } from "@/components/profile/ProgressBar";
import {
  formatRankStatus,
  getEligibilityThreshold,
  getGradedCountForTab,
  getProgress,
} from "@/lib/profile/display";
import type { Profile, RankDisplay } from "@/types";

interface QualificationCardProps {
  profile: Profile;
  rank: RankDisplay;
}

export function QualificationCard({ profile, rank }: QualificationCardProps) {
  const threshold = getEligibilityThreshold("global");
  const graded = getGradedCountForTab(profile, "global");
  const progress = getProgress(graded, threshold);

  return (
    <section className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        Global Rank
      </h2>

      {rank.status === "inactive" && (
        <>
          <p className="mt-2 text-lg font-bold text-white">Inactive</p>
          <p className="mt-2 text-sm text-zinc-400">
            Make your first pick to start your ranking journey.
          </p>
        </>
      )}

      {rank.status === "provisional" && (
        <>
          <p className="mt-2 text-lg font-bold text-[#d4a853]">
            {formatRankStatus(rank.status)}
          </p>
          <p className="mt-1 text-sm text-zinc-300">
            {progress.remaining} Pick{progress.remaining === 1 ? "" : "s"}{" "}
            Away From Qualification
          </p>
          <div className="mt-4">
            <ProgressBar percent={progress.percent} variant="gold" />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            <span className="font-semibold text-zinc-300">
              {progress.current} / {threshold}
            </span>
            <span className="ml-2 text-[#d4a853]">{progress.percent}% complete</span>
          </p>
        </>
      )}

      {rank.status === "official" && (
        <>
          <p className="mt-2 text-lg font-bold text-[#d4a853]">Official Rank</p>
          <p className="mt-1 text-3xl font-black tabular-nums text-white">
            #{rank.rank?.toLocaleString() ?? "—"}
          </p>
        </>
      )}
    </section>
  );
}
