import { cn } from "@/lib/utils";
import type { EventCardPickSummary } from "@/lib/picks/eventCardPickSummary";

const STATUS_STYLES = {
  win: {
    text: "text-green-400",
    bg: "bg-green-500/15",
    border: "border-green-500/35",
    label: "Won",
  },
  loss: {
    text: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-red-500/35",
    label: "Lost",
  },
  pending: {
    text: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
    label: "Pending",
  },
  void: {
    text: "text-zinc-500",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
    label: "Void",
  },
} as const;

function formatSignedPoints(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function PointsValue({
  value,
  size = "sm",
  className,
}: {
  value: number;
  size?: "sm" | "lg" | "hero";
  className?: string;
}) {
  const positive = value >= 0;
  const sizeClass =
    size === "hero"
      ? "text-4xl leading-none"
      : size === "lg"
        ? "text-lg leading-none"
        : "text-sm leading-none";

  return (
    <span
      className={cn(
        "font-bold tabular-nums",
        sizeClass,
        positive ? "text-green-400" : "text-red-400",
        className
      )}
    >
      {formatSignedPoints(value)}
    </span>
  );
}

function CardTotalHero({
  summary,
}: {
  summary: EventCardPickSummary;
}) {
  if (!summary.hasScoredPicks) {
    return (
      <div className="rounded-lg border border-zinc-600/40 bg-zinc-800/40 px-4 py-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
          Card total
        </p>
        <p className="mt-1 text-sm font-semibold text-zinc-500">
          Awaiting results
        </p>
      </div>
    );
  }

  const positive = summary.totalPoints >= 0;

  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-center",
        positive
          ? "border-green-500/45 bg-green-500/10 shadow-[0_0_24px_rgba(74,222,128,0.08)]"
          : "border-red-500/45 bg-red-500/10 shadow-[0_0_24px_rgba(248,113,113,0.08)]"
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
        Your card total
      </p>
      <p
        className={cn(
          "mt-1 font-[family-name:var(--font-teko)] font-bold tabular-nums tracking-tight",
          positive ? "text-green-400" : "text-red-400"
        )}
        style={{ fontSize: "2.75rem", lineHeight: 1 }}
      >
        {formatSignedPoints(summary.totalPoints)}
      </p>
      <p
        className={cn(
          "text-[11px] font-bold uppercase tracking-widest",
          positive ? "text-green-400/80" : "text-red-400/80"
        )}
      >
        points {positive ? "won" : "lost"}
      </p>
    </div>
  );
}

function RecordStats({ summary }: { summary: EventCardPickSummary }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="rounded-md border border-[#2a2a2a] bg-[#111111] px-2 py-2 text-center">
        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
          Picks
        </p>
        <p className="mt-0.5 text-base font-black tabular-nums text-white">
          {summary.picksMade}
        </p>
      </div>
      <div className="rounded-md border border-green-500/30 bg-green-500/10 px-2 py-2 text-center">
        <p className="text-[9px] font-bold uppercase tracking-wider text-green-400/80">
          Won
        </p>
        <p className="mt-0.5 text-base font-black tabular-nums text-green-400">
          {summary.wins}
        </p>
      </div>
      <div className="rounded-md border border-red-500/30 bg-red-500/10 px-2 py-2 text-center">
        <p className="text-[9px] font-bold uppercase tracking-wider text-red-400/80">
          Lost
        </p>
        <p className="mt-0.5 text-base font-black tabular-nums text-red-400">
          {summary.losses}
        </p>
      </div>
    </div>
  );
}

interface EventCardPickSummaryProps {
  summary: EventCardPickSummary;
  variant?: "compact" | "detailed";
  className?: string;
}

export function EventCardPickSummary({
  summary,
  variant = "compact",
  className,
}: EventCardPickSummaryProps) {
  if (summary.picksMade === 0) {
    return (
      <p className={cn("text-xs leading-snug text-zinc-500", className)}>
        No picks on this card
      </p>
    );
  }

  const pickRows = (
    <ul className="space-y-2">
      {summary.rows.map((row) => {
        const style = STATUS_STYLES[row.status];
        return (
          <li
            key={row.fightId}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5",
              style.border,
              style.bg
            )}
          >
            <div className="min-w-0 flex-1">
              {variant === "detailed" ? (
                <p className="text-[11px] font-semibold leading-snug text-zinc-100">
                  {row.pickLine}
                </p>
              ) : (
                <p className="truncate text-xs font-bold uppercase tracking-wide text-zinc-200">
                  {row.label}
                </p>
              )}
              <p
                className={cn(
                  "mt-0.5 text-[9px] font-bold uppercase tracking-wider",
                  style.text
                )}
              >
                {style.label}
              </p>
            </div>
            <div className="shrink-0 text-right">
              {row.ratingChange != null ? (
                <>
                  <PointsValue
                    value={row.ratingChange}
                    size={variant === "detailed" ? "lg" : "sm"}
                  />
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-500">
                    pts
                  </p>
                </>
              ) : (
                <span className="text-[10px] font-semibold text-zinc-500">
                  —
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      className={cn(
        "space-y-3 rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] p-3",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-300">
          Your card results
        </h3>
        {summary.pending > 0 ? (
          <span className="rounded-full border border-zinc-600/50 bg-zinc-800/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-zinc-400">
            {summary.pending} pending
          </span>
        ) : null}
      </div>

      <CardTotalHero summary={summary} />
      <RecordStats summary={summary} />

      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">
          Pick breakdown
        </p>
        {pickRows}
      </div>
    </div>
  );
}
