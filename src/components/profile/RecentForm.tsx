import type { FormOutcome } from "@/lib/profile/display";

interface RecentFormProps {
  outcomes: FormOutcome[];
  currentStreak: number;
}

function FormDot({ outcome }: { outcome: FormOutcome }) {
  const color =
    outcome === "win"
      ? "bg-green-500"
      : outcome === "loss"
        ? "bg-red-500"
        : "bg-zinc-600";
  return (
    <span
      className={`inline-block h-3 w-3 shrink-0 rounded-full ${color}`}
      title={outcome === "win" ? "Correct" : outcome === "loss" ? "Incorrect" : "Pending"}
      aria-hidden
    />
  );
}

export function RecentForm({ outcomes, currentStreak }: RecentFormProps) {
  const hasForm = outcomes.length > 0;

  return (
    <section className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        Recent Form
      </h2>

      {!hasForm ? (
        <p className="mt-3 text-sm text-zinc-400">
          No recent form yet.
          <br />
          Make your first pick.
        </p>
      ) : (
        <>
          <div
            className="mt-4 flex flex-wrap items-center gap-2"
            aria-label="Recent prediction results"
          >
            {outcomes.map((outcome, i) => (
              <FormDot key={i} outcome={outcome} />
            ))}
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-zinc-600">
            {outcomes
              .map((o) => (o === "win" ? "W" : o === "loss" ? "L" : "·"))
              .join(" ")}
          </p>
          <p className="mt-3 text-sm text-zinc-400">
            Current Streak:{" "}
            <span className="font-semibold text-white">
              {currentStreak} correct
            </span>
          </p>
        </>
      )}
    </section>
  );
}
