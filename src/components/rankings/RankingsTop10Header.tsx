interface RankingsTop10HeaderProps {
  tabLabel?: string;
}

export function RankingsTop10Header({
  tabLabel = "World",
}: RankingsTop10HeaderProps) {
  return (
    <div className="rankings-top10-header relative py-2">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[#d4a853]/50 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-[14rem] flex-col items-center px-4 text-center">
        <div className="rounded-full border border-[#d4a853]/35 bg-[#0a0a0a] px-5 py-2 shadow-[0_0_20px_rgba(212,168,83,0.12)]">
          <p className="font-[family-name:var(--font-teko)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4a853]/80">
            {tabLabel}
          </p>
          <h2 className="bg-gradient-to-b from-[#f5e6b8] via-[#d4a853] to-[#a8842a] bg-clip-text font-[family-name:var(--font-teko)] text-3xl font-bold uppercase leading-none tracking-wide text-transparent">
            Top 10
          </h2>
        </div>
        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          Official leaderboard
        </p>
      </div>
    </div>
  );
}
