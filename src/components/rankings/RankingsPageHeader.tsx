import { getRankingsPickGoalCopy } from "@/lib/brand/rankingsCopy";
import type { RankingTab } from "@/types";

interface RankingsPageHeaderProps {
  tab: RankingTab;
  pickCount: number;
  threshold: number;
}

export function RankingsPageHeader({
  tab,
  pickCount,
  threshold,
}: RankingsPageHeaderProps) {
  const goal = getRankingsPickGoalCopy(tab, pickCount, threshold);

  return (
    <header className="text-center">
      <h1 className="font-[family-name:var(--font-teko)] text-3xl font-bold uppercase tracking-wide text-white">
        Rankings
      </h1>

      {goal.showGoal ? (
        <p className="mt-2 text-sm leading-snug text-zinc-300">
          Make{" "}
          <span className="font-[family-name:var(--font-teko)] text-3xl font-bold leading-none text-[#d4a853]">
            {goal.count}
          </span>
          {goal.useMore ? " more " : " "}
          Pick{goal.count === 1 ? "" : "s"} for a {goal.rankingLabel}.
        </p>
      ) : null}
    </header>
  );
}
