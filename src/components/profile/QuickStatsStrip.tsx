interface QuickStatsStripProps {
  accuracy: number;
  totalPicks: number;
  currentStreak: number;
  perfectPicks: number;
}

const STATS = [
  { key: "accuracy", label: "Accuracy", format: (v: number) => `${v}%` },
  { key: "totalPicks", label: "Total Picks", format: (v: number) => String(v) },
  { key: "currentStreak", label: "Streak", format: (v: number) => String(v) },
  { key: "perfectPicks", label: "Perfect", format: (v: number) => String(v) },
] as const;

export function QuickStatsStrip({
  accuracy,
  totalPicks,
  currentStreak,
  perfectPicks,
}: QuickStatsStripProps) {
  const values = { accuracy, totalPicks, currentStreak, perfectPicks };

  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {STATS.map(({ key, label, format }) => (
        <div
          key={key}
          className="rounded-xl border border-[#2a2a2a] bg-[#111111] px-3 py-2.5 text-center"
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
            {label}
          </p>
          <p className="mt-1 text-lg font-black tabular-nums text-white">
            {format(values[key])}
          </p>
        </div>
      ))}
    </section>
  );
}
