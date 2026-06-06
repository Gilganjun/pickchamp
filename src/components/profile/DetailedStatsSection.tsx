import {
  getEligibilityThreshold,
  getGradedCountForTab,
  getProgress,
  getSportPickStats,
} from "@/lib/profile/display";
import type { Profile, RankDisplay } from "@/types";

interface DetailedStatsSectionProps {
  profile: Profile;
  ranks: {
    global: RankDisplay;
    boxing: RankDisplay;
    mma: RankDisplay;
  };
}

export function DetailedStatsSection({
  profile,
  ranks,
}: DetailedStatsSectionProps) {
  const globalThreshold = getEligibilityThreshold("global");
  const globalGraded = getGradedCountForTab(profile, "global");
  const globalProgress = getProgress(globalGraded, globalThreshold);
  const boxingStats = getSportPickStats(profile, "boxing");
  const mmaStats = getSportPickStats(profile, "mma");

  return (
    <details className="group rounded-xl border border-[#2a2a2a] bg-[#111111]">
      <summary className="cursor-pointer list-none px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-2">
          Detailed Stats
          <span className="text-zinc-600 transition-transform group-open:rotate-180">
            ▾
          </span>
        </span>
      </summary>
      <div className="space-y-4 border-t border-[#2a2a2a] px-4 py-4 text-xs">
        <div>
          <p className="font-bold uppercase tracking-wider text-zinc-500">
            Global Qualification
          </p>
          <p className="mt-1 text-zinc-300">
            {globalProgress.current} / {globalThreshold} graded picks ·{" "}
            {ranks.global.status}
          </p>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider text-red-400">
            Boxing Breakdown
          </p>
          <dl className="mt-2 space-y-1 text-zinc-400">
            <div className="flex justify-between">
              <dt>Correct</dt>
              <dd className="font-semibold text-green-500">
                {boxingStats.correct}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Incorrect</dt>
              <dd className="font-semibold text-red-500">
                {boxingStats.incorrect}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Total</dt>
              <dd className="font-semibold text-zinc-200">
                {boxingStats.picks}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Accuracy</dt>
              <dd className="font-semibold text-zinc-200">
                {boxingStats.accuracy}%
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider text-purple-400">
            MMA Breakdown
          </p>
          <dl className="mt-2 space-y-1 text-zinc-400">
            <div className="flex justify-between">
              <dt>Correct</dt>
              <dd className="font-semibold text-green-500">{mmaStats.correct}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Incorrect</dt>
              <dd className="font-semibold text-red-500">
                {mmaStats.incorrect}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Total</dt>
              <dd className="font-semibold text-zinc-200">{mmaStats.picks}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Accuracy</dt>
              <dd className="font-semibold text-zinc-200">
                {mmaStats.accuracy}%
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="font-bold uppercase tracking-wider text-zinc-500">
            Streaks
          </p>
          <p className="mt-1 text-zinc-300">
            Best streak: {profile.best_streak} correct
          </p>
        </div>
      </div>
    </details>
  );
}
