"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RankingCard } from "@/components/RankingCard";
import { RankingsPageHeader } from "@/components/rankings/RankingsPageHeader";
import { TabBar } from "@/components/TabBar";
import {
  getRankingsPickProgressAction,
  loadLeaderboardAction,
} from "@/app/actions/rankings";
import { getRankingsEmptyMessage } from "@/lib/brand/rankingsCopy";
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
  const [pickCount, setPickCount] = useState(0);
  const [threshold, setThreshold] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadLeaderboardAction(tab),
      getRankingsPickProgressAction(tab),
    ]).then(([leaderboard, progress]) => {
      setRows(leaderboard);
      setPickCount(progress.pickCount);
      setThreshold(progress.threshold);
      setLoading(false);
    });
  }, [tab]);

  return (
    <AppShell showTagline={false} centeredBrand>
      <RankingsPageHeader
        tab={tab}
        pickCount={pickCount}
        threshold={threshold}
      />

      <div className="mt-3">
        <TabBar tabs={tabs} value={tab} onChange={setTab} />
      </div>

      <div className="mt-3 space-y-3">
        {loading ? (
          <p className="py-8 text-center text-sm text-zinc-400">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">
            {getRankingsEmptyMessage()}
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
              tab={tab}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
