import { SportBadge } from "@/components/profile/SportBadge";
import {
  formatCompactPickLine,
  formatCompactResultLine,
  formatRatingChangeLine,
  getPickRecordStatusLabel,
  type PickRecordItem,
} from "@/lib/pickRecord/pickRecord";
import { cn } from "@/lib/utils";

interface PickRecordRowProps {
  item: PickRecordItem;
  showEventMeta?: boolean;
  eventMetaLine?: string;
}

function statusChipClass(status: PickRecordItem["status"]): string {
  switch (status) {
    case "pending":
      return "bg-zinc-700/50 text-zinc-300";
    case "waiting_for_results":
      return "bg-amber-500/15 text-amber-300";
    case "won":
      return "bg-green-500/15 text-green-400";
    case "lost":
      return "bg-red-500/15 text-red-400";
    case "perfect":
      return "bg-[#d4a853]/15 text-[#d4a853]";
  }
}

export function PickRecordRow({
  item,
  showEventMeta = false,
  eventMetaLine,
}: PickRecordRowProps) {
  const { fight, status } = item;
  const matchup = `${fight.fighter_a_name} vs ${fight.fighter_b_name}`;
  const pickLine = formatCompactPickLine(item);
  const resultLine = formatCompactResultLine(item);
  const ratingLine = formatRatingChangeLine(item);
  const sportBorder =
    fight.sport === "boxing" ? "border-red-600/25" : "border-purple-600/25";

  return (
    <article
      className={cn(
        "rounded-lg border bg-[#111111] px-3 py-2.5",
        sportBorder,
        status === "perfect" && "ring-1 ring-[#d4a853]/25"
      )}
    >
      {showEventMeta && eventMetaLine ? (
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <SportBadge sport={fight.sport} />
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
            {eventMetaLine}
          </p>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold leading-snug text-white">
            {matchup}
          </p>
          <p className="mt-0.5 text-[10px] text-zinc-400">{pickLine}</p>
          {resultLine ? (
            <p className="text-[10px] text-zinc-500">{resultLine}</p>
          ) : null}
          {ratingLine ? (
            <p className="mt-0.5 text-[10px] font-semibold tabular-nums text-zinc-200">
              {ratingLine}
            </p>
          ) : null}
        </div>

        <span
          className={cn(
            "shrink-0 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide",
            statusChipClass(status)
          )}
        >
          {getPickRecordStatusLabel(status)}
        </span>
      </div>
    </article>
  );
}
