import { cn } from "@/lib/utils";

interface ProfileQuickStatsProps {
  accuracy: number;
  totalPicks: number;
  wins: number;
  perfectPicks: number;
}

function RecordCell({
  value,
  label,
  valueClassName,
}: {
  value: string;
  label: string;
  valueClassName: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-0.5 text-center">
      <p
        className={cn(
          "text-sm font-black tabular-nums leading-none",
          valueClassName
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-[8px] font-bold uppercase leading-tight tracking-wide text-zinc-500">
        {label}
      </p>
    </div>
  );
}

export function ProfileQuickStats({
  accuracy,
  totalPicks,
  wins,
  perfectPicks,
}: ProfileQuickStatsProps) {
  const losses = Math.max(0, totalPicks - wins);
  const accuracyLabel =
    accuracy % 1 === 0 ? `${accuracy}%` : `${accuracy.toFixed(1)}%`;

  return (
    <div className="border-t border-[#2a2a2a] pt-2">
      <div
        className="grid grid-cols-5 gap-0.5"
        aria-label={`${totalPicks} picks, ${wins} won, ${losses} lost, ${perfectPicks} perfect, ${accuracyLabel} accuracy`}
      >
        <RecordCell
          value={String(totalPicks)}
          label="Picks"
          valueClassName="text-white"
        />
        <RecordCell
          value={String(wins)}
          label="Won"
          valueClassName="text-green-400"
        />
        <RecordCell
          value={String(losses)}
          label="Lost"
          valueClassName="text-red-400"
        />
        <RecordCell
          value={String(perfectPicks)}
          label="Perfect"
          valueClassName="text-[#d4a853]"
        />
        <RecordCell
          value={accuracyLabel}
          label="Acc"
          valueClassName="text-white"
        />
      </div>
    </div>
  );
}
