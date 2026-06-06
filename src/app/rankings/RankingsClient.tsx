"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RankingCard } from "@/components/RankingCard";
import { TabBar } from "@/components/TabBar";
import { loadLeaderboardAction } from "@/app/actions/rankings";
import {
  getEligibilityThreshold,
  getGlobalQualificationSportHint,
  getSportQualificationHint,
} from "@/lib/profile/display";
import type { RankingTab } from "@/types";

const tabs: { id: RankingTab; label: string }[] = [
  { id: "global", label: "Global" },
  { id: "boxing", label: "Boxing" },
  { id: "mma", label: "MMA" },
];

function qualificationDescription(tab: RankingTab): string {
  const threshold = getEligibilityThreshold(tab);
  if (tab === "global") {
    return `Official global ranking requires ${threshold} graded qualifying picks ${getGlobalQualificationSportHint()}.`;
  }
  return `Official ${tab} ranking requires ${threshold} graded ${tab} picks ${getSportQualificationHint(tab)}.`;
}

export function RankingsClient() {
  const [tab, setTab] = useState<RankingTab>("global");
  const [rows, setRows] = useState<
    Awaited<ReturnType<typeof loadLeaderboardAction>>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadLeaderboardAction(tab).then((data) => {
      setRows(data);
      setLoading(false);
    });
  }, [tab]);

  return (
    <AppShell showTagline={false}>
      <h1 className="text-xl font-black uppercase tracking-tight">Rankings</h1>
      <p className="mt-1 text-xs text-zinc-500">{qualificationDescription(tab)}</p>

      <div className="mt-4">
        <TabBar tabs={tabs} value={tab} onChange={setTab} />
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="py-8 text-center text-sm text-zinc-500">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No eligible users yet. Keep picking to unlock the leaderboard.
          </p>
        ) : (
          rows.map((row) => (
            <RankingCard
              key={row.profile.id}
              profile={row.profile}
              rank={row.rank}
              rating={row.rating}
              accuracy={row.accuracy}
              picks={row.picks}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
