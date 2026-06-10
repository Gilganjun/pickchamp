import { SportBadge } from "@/components/profile/SportBadge";
import { formatEventHeaderLine } from "@/lib/pickRecord/pickRecord";
import type { FightWithRelations } from "@/types";

interface PickRecordEventHeaderProps {
  sport: FightWithRelations["sport"];
  eventName: string;
  eventDateLabel: string;
}

export function PickRecordEventHeader({
  sport,
  eventName,
  eventDateLabel,
}: PickRecordEventHeaderProps) {
  return (
    <div className="flex items-center gap-1.5 px-0.5 pt-3 pb-1 first:pt-0">
      <SportBadge sport={sport} />
      <p className="min-w-0 truncate text-[10px] font-bold uppercase tracking-wide text-zinc-400">
        {formatEventHeaderLine(sport, eventName, eventDateLabel)}
      </p>
    </div>
  );
}
