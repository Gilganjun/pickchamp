import type { FormOutcome } from "@/lib/profile/display";

interface RecentFormProps {
  outcomes: FormOutcome[];
  summaryLabel: string | null;
}

function FormDot({ outcome }: { outcome: FormOutcome }) {
  const styles =
    outcome === "win"
      ? "border-green-500/50 bg-green-500/15 text-green-400"
      : outcome === "loss"
        ? "border-red-500/50 bg-red-500/15 text-red-400"
        : "border-zinc-600 bg-zinc-800 text-zinc-500";

  const label = outcome === "win" ? "W" : outcome === "loss" ? "L" : "·";

  return (
    <span
      className={`relative z-10 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-black ${styles}`}
      title={
        outcome === "win"
          ? "Correct"
          : outcome === "loss"
            ? "Incorrect"
            : "Pending"
      }
      aria-hidden
    >
      {label}
    </span>
  );
}

export function RecentForm({ outcomes, summaryLabel }: RecentFormProps) {
  const hasForm = outcomes.length > 0;

  if (!hasForm) {
    return (
      <section className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-3">
        <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Recent Form
        </h2>
        <p className="mt-2 text-[11px] text-zinc-500">No graded picks yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-3">
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        Recent Form
      </h2>

      <div
        className="relative mt-3 flex items-center justify-between gap-1"
        aria-label="Recent prediction results"
      >
        <div
          className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2 bg-[#2a2a2a]"
          aria-hidden
        />
        {outcomes.map((outcome, i) => (
          <FormDot key={i} outcome={outcome} />
        ))}
      </div>

      {summaryLabel ? (
        <p className="mt-2 text-[11px] font-semibold tabular-nums text-zinc-400">
          {summaryLabel}
        </p>
      ) : null}
    </section>
  );
}
