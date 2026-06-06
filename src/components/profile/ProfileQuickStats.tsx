interface ProfileQuickStatsProps {
  accuracy: number;
  totalPicks: number;
  currentStreak: number;
  perfectPicks: number;
}

function StatCell({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-1 text-center">
      <div className={accent}>{icon}</div>
      <p className="mt-1 text-sm font-black tabular-nums text-white">{value}</p>
      <p className="text-[8px] font-bold uppercase leading-tight tracking-wide text-zinc-500">
        {label}
      </p>
    </div>
  );
}

export function ProfileQuickStats({
  accuracy,
  totalPicks,
  currentStreak,
  perfectPicks,
}: ProfileQuickStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-1 border-t border-[#2a2a2a] pt-2">
      <StatCell
        icon={
          <svg viewBox="0 0 20 20" className="mx-auto h-4 w-4" aria-hidden>
            <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="3" fill="currentColor" />
          </svg>
        }
        value={`${accuracy}%`}
        label="Accuracy"
        accent="text-red-400"
      />
      <StatCell
        icon={
          <svg viewBox="0 0 20 20" className="mx-auto h-4 w-4" aria-hidden>
            <rect x="4" y="3" width="12" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path stroke="currentColor" strokeWidth="1.5" d="M7 8h6M7 11h4" />
          </svg>
        }
        value={String(totalPicks)}
        label="Total Picks"
        accent="text-sky-400"
      />
      <StatCell
        icon={
          <svg viewBox="0 0 20 20" className="mx-auto h-4 w-4" aria-hidden>
            <path
              fill="currentColor"
              d="M10 2c1.2 2.8 3.5 4.2 6 4.5-1.2 4.5-3.8 7-6 9.5C7.5 13.7 4.9 11.2 4 6.5 6.5 6.2 8.8 4.8 10 2Z"
            />
          </svg>
        }
        value={String(currentStreak)}
        label="Streak"
        accent="text-green-400"
      />
      <StatCell
        icon={
          <svg viewBox="0 0 20 20" className="mx-auto h-4 w-4" aria-hidden>
            <path
              fill="currentColor"
              d="M10 2.5l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L4.2 6.7l4-.6L10 2.5Z"
            />
          </svg>
        }
        value={String(perfectPicks)}
        label="Perfect"
        accent="text-[#d4a853]"
      />
    </div>
  );
}
