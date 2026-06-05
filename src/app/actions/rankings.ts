"use server";

import { getLeaderboard } from "@/lib/data/profiles";
import type { RankingTab } from "@/types";

export async function loadLeaderboardAction(tab: RankingTab) {
  return getLeaderboard(tab);
}
