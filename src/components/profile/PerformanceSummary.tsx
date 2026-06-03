interface PerformanceSummaryProps {
  accuracy: number;
  totalPicks: number;
  perfectPicks: number;
  bestStreak: number;
}

const METRICS = [
  { key: "accuracy", label: "Accuracy", format: (v: number) => `${v}%` },
  { key: "totalPicks", label: "Total Picks", format: (v: number) => String(v) },
  { key: "perfectPicks", label: "Perfect Picks", format: (v: number) => String(v) },
  { key: "bestStreak", label: "Best Streak", format: (v: number) => String(v) },
] as const;

export function PerformanceSummary({
  accuracy,
  totalPicks,
  perfectPicks,
  bestStreak,
}: PerformanceSummaryProps) {
  const values = { accuracy, totalPicks, perfectPicks, bestStreak };

  return (
    <section className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        Performance
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
        {METRICS.map(({ key, label, format }) => (
          <div key={key} className="flex items-baseline justify-between gap-2">
            <dt className="text-xs text-zinc-500">{label}</dt>
            <dd className="text-sm font-bold tabular-nums text-white">
              {format(values[key])}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
