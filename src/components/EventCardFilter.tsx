"use client";

import { cn } from "@/lib/utils";
import type { Event } from "@/types";

export type EventCardFilterValue = "all" | string;

interface EventCardFilterProps {
  value: EventCardFilterValue;
  onChange: (value: EventCardFilterValue) => void;
  events: Event[];
}

export function EventCardFilter({
  value,
  onChange,
  events,
}: EventCardFilterProps) {
  if (events.length === 0) return null;

  return (
    <div className="w-full">
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        Event / Card
      </p>
      <div className="flex w-full justify-center pb-1">
        <div className="flex max-w-full flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => onChange("all")}
            className={cn(
              "shrink-0 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors",
              value === "all"
                ? "border-[#d4a853] bg-[#d4a853]/10 text-[#d4a853]"
                : "border-[#2a2a2a] bg-[#111111] text-zinc-400 hover:border-zinc-600"
            )}
          >
            All Cards
          </button>
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onChange(event.id)}
              title={event.name}
              className={cn(
                "max-w-[11rem] shrink-0 truncate rounded-full border px-3 py-2 text-[11px] font-semibold tracking-wide transition-colors",
                value === event.id
                  ? "border-[#d4a853] bg-[#d4a853]/10 text-[#d4a853]"
                  : "border-[#2a2a2a] bg-[#111111] text-zinc-400 hover:border-zinc-600"
              )}
            >
              {event.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
