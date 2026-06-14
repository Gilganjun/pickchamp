import { TabBar } from "@/components/TabBar";
import type { RankingTab } from "@/types";

const tabs: { id: RankingTab; label: string }[] = [
  { id: "global", label: "Global" },
  { id: "boxing", label: "Boxing" },
  { id: "mma", label: "MMA" },
];

interface RankingsHeroProps {
  tab: RankingTab;
  onTabChange: (tab: RankingTab) => void;
}

export function RankingsHero({ tab, onTabChange }: RankingsHeroProps) {
  return (
    <header className="rankings-hero relative -mx-4 overflow-hidden rounded-b-xl px-4 pb-0 pt-3">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-red-950/25 via-[#0a0a0a]/80 to-[#0a0a0a]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] rankings-hero-grid" />

      <div className="relative text-center">
        <h1 className="bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text font-[family-name:var(--font-teko)] text-3xl font-bold uppercase tracking-wide text-transparent">
          World Rankings
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          Climb the ladder. Prove you&apos;re the best.
        </p>
      </div>

      <div className="relative mt-3">
        <TabBar tabs={tabs} value={tab} onChange={onTabChange} />
      </div>
    </header>
  );
}
