import type { FormOutcome } from "@/lib/profile/display";

interface ProfileRecentFormStripProps {
  outcomes: FormOutcome[];
  currentStreak?: number;
  variant?: "default" | "record-footer";
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

export function ProfileRecentFormStrip({
  outcomes,
  currentStreak = 0,
  variant = "default",
}: ProfileRecentFormStripProps) {
  if (outcomes.length === 0 && currentStreak <= 0) return null;

  const wins = outcomes.filter((outcome) => outcome === "win").length;
  const losses = outcomes.filter((outcome) => outcome === "loss").length;
  const recordLabel = `${wins}–${losses}`;
  const isFooter = variant === "record-footer";

  return (
    <div
      className={
        isFooter
          ? "mt-1.5 flex flex-wrap items-center justify-center gap-1 border-t border-[#2a2a2a] pt-1.5"
          : "mt-1 space-y-0.5"
      }
      aria-label={
        outcomes.length > 0
          ? `Recent form: ${recordLabel} from last ${outcomes.length} picks`
          : undefined
      }
    >
      {outcomes.length > 0 ? (
        <>
          <span className="text-[8px] font-bold uppercase tracking-wide text-zinc-600">
            Recent
          </span>
          <div className="flex items-center gap-0.5">
            {outcomes.map((outcome, index) => (
              <FormChip key={index} outcome={outcome} />
            ))}
          </div>
          <span className="text-[8px] font-semibold tabular-nums text-zinc-500">
            {recordLabel}
          </span>
        </>
      ) : null}
      {currentStreak > 0 ? (
        <>
          {outcomes.length > 0 ? (
            <span className="text-[8px] text-zinc-700" aria-hidden>
              ·
            </span>
          ) : null}
          <span className="text-[8px] font-semibold text-zinc-500">
            Streak{" "}
            <span className="tabular-nums text-green-400">{currentStreak}</span>
          </span>
        </>
      ) : null}
    </div>
  );
}
