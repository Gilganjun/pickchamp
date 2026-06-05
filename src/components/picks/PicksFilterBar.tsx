"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Event, SportFilter as SportFilterType } from "@/types";

export type CardFilterValue = "all" | string;

const SPORT_OPTIONS: { id: SportFilterType; label: string }[] = [
  { id: "all", label: "All Sports" },
  { id: "boxing", label: "Boxing" },
  { id: "mma", label: "MMA" },
];

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SportIcon({ sport }: { sport: SportFilterType }) {
  if (sport === "mma") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-purple-400" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2 4 6v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V6l-8-4Zm0 2.2 6 3v4.8c0 3.8-2.5 7.4-6 8.5-3.5-1.1-6-4.7-6-8.5V7.2l6-3Z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-500" aria-hidden>
      <path
        fill="currentColor"
        d="M6 4a2 2 0 00-2 2v12a2 2 0 002 2h1.5l1.2 2.4a1 1 0 001.8 0L11.5 20H14l1.2 2.4a1 1 0 001.8 0L18.5 20H20a2 2 0 002-2V6a2 2 0 00-2-2H6Zm0 2h14v12h-1.1l-.6-1.2a1 1 0 00-.9-.6H12a1 1 0 00-.9.6l-.6 1.2H6V6Zm5 2.5a1 1 0 01.8 1.6l-1.3 1.7h2.5a1 1 0 110 2h-3.5a1 1 0 01-.8-1.6l1.3-1.7H9.5a1 1 0 110-2h3.5Z"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#d4a853]" aria-hidden>
      <path
        fill="currentColor"
        d="M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5Zm2 0v14h12V5H6Zm2 3h8v2H8V8Zm0 4h8v2H8v-2Z"
      />
    </svg>
  );
}

interface FilterSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  icon: ReactNode;
  children: ReactNode;
}

function FilterSelect({
  id,
  value,
  onChange,
  icon,
  children,
}: FilterSelectProps) {
  return (
    <div className="relative min-w-0">
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2">
        {icon}
      </span>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-xl border border-[#2a2a2a] bg-[#181818]",
          "py-2.5 pl-9 pr-9 text-sm font-semibold text-white",
          "transition-colors hover:border-zinc-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
    </div>
  );
}

interface PicksFilterBarProps {
  sport: SportFilterType;
  card: CardFilterValue;
  events: Event[];
  onSportChange: (sport: SportFilterType) => void;
  onCardChange: (card: CardFilterValue) => void;
}

export function PicksFilterBar({
  sport,
  card,
  events,
  onSportChange,
  onCardChange,
}: PicksFilterBarProps) {
  const sportIcon =
    sport === "all" ? <SportIcon sport="boxing" /> : <SportIcon sport={sport} />;

  return (
    <div className="grid grid-cols-2 gap-2">
      <FilterSelect
        id="picks-sport-filter"
        value={sport}
        onChange={(value) => onSportChange(value as SportFilterType)}
        icon={sportIcon}
      >
        {SPORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        id="picks-card-filter"
        value={card}
        onChange={(value) => onCardChange(value as CardFilterValue)}
        icon={<CardIcon />}
      >
        <option value="all">All Cards</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </FilterSelect>
    </div>
  );
}

/** Reset card to All Cards when it is not in the sport-filtered event list. */
export function resolveCardFilterForSport(
  card: CardFilterValue,
  events: Event[]
): CardFilterValue {
  if (card === "all") return "all";
  return events.some((event) => event.id === card) ? card : "all";
}
