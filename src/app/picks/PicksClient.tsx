"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FightCard } from "@/components/FightCard";
import { SportFilter } from "@/components/SportFilter";
import { TabBar } from "@/components/TabBar";
import { getFightsForPicks } from "@/lib/data/fights";
import type { FightWithRelations, PickTab, SportFilter as SF } from "@/types";

const tabs: { id: PickTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "live", label: "Live" },
  { id: "settled", label: "Settled" },
];

export function PicksClient() {
  const [tab, setTab] = useState<PickTab>("upcoming");
  const [sport, setSport] = useState<SF>("all");
  const [fights, setFights] = useState<FightWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getFightsForPicks(tab, sport);
    setFights(data);
    setLoading(false);
  }, [tab, sport]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AppShell prominentBrand showTagline>
      <TabBar tabs={tabs} value={tab} onChange={setTab} />
      <div className="mt-4">
        <SportFilter value={sport} onChange={setSport} />
      </div>

      <div className="mt-3 flex justify-end">
        <span className="text-[10px] text-zinc-600">Sort: Earliest</span>
      </div>

      <div className="mt-3 space-y-4">
        {loading ? (
          <p className="py-12 text-center text-sm text-zinc-500">Loading fights…</p>
        ) : fights.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            No fights in this view. Check another tab or sport filter.
          </p>
        ) : (
          fights.map((fight) => (
            <FightCard key={fight.id} fight={fight} onSaved={load} />
          ))
        )}
      </div>
    </AppShell>
  );
}
