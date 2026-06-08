import type { RankingTab } from "@/types";

export function getRankingsWorldRankingLabel(tab: RankingTab): string {
  if (tab === "boxing") return "Boxing World Ranking";
  if (tab === "mma") return "MMA World Ranking";
  return "World Ranking";
}

export interface RankingsPickGoalCopy {
  count: number;
  useMore: boolean;
  rankingLabel: string;
  showGoal: boolean;
}

export function getRankingsPickGoalCopy(
  tab: RankingTab,
  pickCount: number,
  threshold: number
): RankingsPickGoalCopy {
  const remaining = Math.max(0, threshold - pickCount);
  return {
    count: remaining,
    useMore: pickCount > 0,
    rankingLabel: getRankingsWorldRankingLabel(tab),
    showGoal: remaining > 0,
  };
}

export function getRankingsEmptyMessage(): string {
  return "No ranked users yet. Make picks — world rankings appear as results come in.";
}
