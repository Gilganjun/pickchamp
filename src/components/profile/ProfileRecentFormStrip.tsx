import type { FormOutcome } from "@/lib/profile/display";

interface ProfileRecentFormStripProps {
  outcomes: FormOutcome[];
}

function FormChip({ outcome }: { outcome: FormOutcome }) {
  const styles =
    outcome === "win"
      ? "border-green-500/40 bg-green-500/10 text-green-400"
      : outcome === "loss"
        ? "border-red-500/40 bg-red-500/10 text-red-400"
        : "border-zinc-600 bg-zinc-800/80 text-zinc-500";

  const label = outcome === "win" ? "W" : outcome === "loss" ? "L" : "·";

  return (
    <span
      className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[8px] font-black leading-none ${styles}`}
      aria-hidden
    >
      {label}
    </span>
  );
}

export function ProfileRecentFormStrip({ outcomes }: ProfileRecentFormStripProps) {
  if (outcomes.length === 0) return null;

  const wins = outcomes.filter((outcome) => outcome === "win").length;
  const losses = outcomes.filter((outcome) => outcome === "loss").length;
  const recordLabel = `${wins}–${losses}`;

  return (
    <div
      className="mt-1 flex flex-wrap items-center gap-1"
      aria-label={`Recent form: ${recordLabel} from last ${outcomes.length} picks`}
    >
      <span className="text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
        Recent
      </span>
      <div className="flex items-center gap-0.5">
        {outcomes.map((outcome, index) => (
          <FormChip key={index} outcome={outcome} />
        ))}
      </div>
      <span className="text-[9px] font-semibold tabular-nums text-zinc-500">
        {recordLabel}
      </span>
    </div>
  );
}
