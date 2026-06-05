"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RankingCard } from "@/components/RankingCard";
import { TabBar } from "@/components/TabBar";
import { loadLeaderboardAction } from "@/app/actions/rankings";
import type { RankingTab } from "@/types";

const tabs: { id: RankingTab; label: string }[] = [
  { id: "global", label: "Global" },
  { id: "boxing", label: "Boxing" },
  { id: "mma", label: "MMA" },
];

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

  const threshold = tab === "global" ? 50 : 25;

  return (
    <AppShell showTagline={false}>
      <h1 className="text-xl font-black uppercase tracking-tight">Rankings</h1>
      <p className="mt-1 text-xs text-zinc-500">
        Official ranking requires {threshold} graded picks in this category.
      </p>

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
              rank={row.rank}
              profile={row.profile}
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
