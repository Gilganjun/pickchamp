"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RankingsCtaBanner } from "@/components/rankings/RankingsCtaBanner";
import { RankingsHero } from "@/components/rankings/RankingsHero";
import { RankingsLeaderboard } from "@/components/rankings/RankingsLeaderboard";
import { RankingsUserPositionCard } from "@/components/rankings/RankingsUserPositionCard";
import {
  getRankingsUserContextAction,
  loadLeaderboardAction,
} from "@/app/actions/rankings";
import { getRankingsEmptyMessage } from "@/lib/brand/rankingsCopy";
import {
  getRankingsCtaVariant,
  getUserStateFromContext,
  type RankingsUserContext,
} from "@/lib/rankings/rankingsDisplay";
import type { RankingTab } from "@/types";

export function RankingsClient() {
  const [tab, setTab] = useState<RankingTab>("global");
  const [rows, setRows] = useState<
    Awaited<ReturnType<typeof loadLeaderboardAction>>
  >([]);
  const [userContext, setUserContext] = useState<RankingsUserContext>({
    state: "guest",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadLeaderboardAction(tab),
      getRankingsUserContextAction(tab),
    ]).then(([leaderboard, context]) => {
      setRows(leaderboard);
      setUserContext(context);
      setLoading(false);
    });
  }, [tab]);

  const currentUserId =
    userContext.state === "guest" ? null : userContext.userId;
  const ctaVariant = getRankingsCtaVariant(getUserStateFromContext(userContext));

  return (
    <AppShell showTagline={false} centeredBrand>
      <RankingsHero tab={tab} onTabChange={setTab} />

      <div className="mt-3">
        {!loading ? (
          <RankingsUserPositionCard context={userContext} />
        ) : null}

        {loading ? (
          <p className="py-8 text-center text-sm text-zinc-400">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">
            {getRankingsEmptyMessage()}
          </p>
        ) : (
          <div className="rankings-top10-wrap mt-5 border-t border-[#2a2a2a] pt-4">
            <RankingsLeaderboard
              rows={rows}
              tab={tab}
              currentUserId={currentUserId}
            />
          </div>
        )}

        {!loading ? (
          <div className="mt-4">
            <RankingsCtaBanner variant={ctaVariant} />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
