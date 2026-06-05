"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FightCard } from "@/components/FightCard";
import { cn } from "@/lib/utils";
import {
  PicksFilterBar,
  resolveCardFilterForSport,
  type CardFilterValue,
} from "@/components/picks/PicksFilterBar";
import { loadPicksPageDataAction } from "@/app/actions/picks";
import {
  groupFightsByEvent,
  orderEventCardGroups,
} from "@/lib/data/fights-utils";
import { formatEventDateTime } from "@/lib/datetime";
import { inferFightTab } from "@/lib/utils";
import type { Event, FightWithRelations, SportFilter as SF } from "@/types";

function PicksFightList({
  fights,
  onSaved,
  isLoggedIn,
}: {
  fights: FightWithRelations[];
  onSaved: () => void;
  isLoggedIn: boolean;
}) {
  return (
    <>
      {fights.map((fight) => (
        <FightCard
          key={fight.id}
          fight={fight}
          onSaved={onSaved}
          enablePickImpact
          isLoggedIn={isLoggedIn}
        />
      ))}
    </>
  );
}

function CardCollapseChevron({ expanded }: { expanded: boolean }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#111111] text-zinc-300 transition-colors",
        "group-hover:border-zinc-600 group-hover:text-white"
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "h-5 w-5 transition-transform duration-200",
          expanded ? "rotate-180" : "rotate-0"
        )}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}

function EventCardSection({
  event,
  fights,
  onSaved,
  isLoggedIn,
  defaultExpanded,
}: {
  event: Event;
  fights: FightWithRelations[];
  onSaved: () => void;
  isLoggedIn: boolean;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isLiveCard = fights.some(
    (fight) => inferFightTab(fight.status, fight.lock_time) === "live"
  );

  return (
    <section className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#181818]">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-tight text-white">
              {event.name}
            </h2>
            {isLiveCard ? (
              <span className="inline-flex items-center rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Live Card
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            {event.promotion && <span>{event.promotion} · </span>}
            {event.location ?? "TBA"}
            <span className="mx-1">·</span>
            {formatEventDateTime(event)}
          </p>
          <p className="mt-1 text-[10px] text-zinc-600">
            {fights.length} fight{fights.length === 1 ? "" : "s"} on this card
          </p>
        </div>
        <CardCollapseChevron expanded={expanded} />
      </button>

      {expanded ? (
        <div className="space-y-3 border-t border-[#2a2a2a] px-3 pb-3 pt-3">
          <PicksFightList
            fights={fights}
            onSaved={onSaved}
            isLoggedIn={isLoggedIn}
          />
        </div>
      ) : null}
    </section>
  );
}

interface PicksClientProps {
  initialIsLoggedIn?: boolean;
  initialEvents?: Event[];
  initialFights?: FightWithRelations[];
  initialError?: string | null;
}

export function PicksClient({
  initialIsLoggedIn = false,
  initialEvents = [],
  initialFights = [],
  initialError = null,
}: PicksClientProps) {
  const [sport, setSport] = useState<SF>("all");
  const [eventCard, setEventCard] = useState<CardFilterValue>("all");
  const [pickEvents, setPickEvents] = useState<Event[]>(initialEvents);
  const [fights, setFights] = useState<FightWithRelations[]>(initialFights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadPicksPageDataAction(sport, "all");
      if (!data.ok) {
        setError(data.error);
        setPickEvents([]);
        setFights([]);
        return;
      }

      const resolvedCard = resolveCardFilterForSport(eventCard, data.events);
      if (resolvedCard !== eventCard) {
        setEventCard(resolvedCard);
      }
      setPickEvents(data.events);
      setFights(data.fights);
      setIsLoggedIn(data.isLoggedIn);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load fight cards."
      );
      setPickEvents([]);
      setFights([]);
    } finally {
      setLoading(false);
    }
  }, [sport, eventCard]);

  useEffect(() => {
    if (sport === "all" && eventCard === "all") {
      return;
    }
    load();
  }, [load, sport, eventCard]);

  const handleSportChange = (next: SF) => {
    setSport(next);
  };

  const groupedByCard = useMemo(
    () => orderEventCardGroups(groupFightsByEvent(fights), eventCard),
    [fights, eventCard]
  );

  return (
    <AppShell prominentBrand showTagline showProfileLink>
      <div className="mt-2">
        <PicksFilterBar
          sport={sport}
          card={eventCard}
          events={pickEvents}
          onSportChange={handleSportChange}
          onCardChange={setEventCard}
        />
      </div>

      <div className="mt-3 space-y-4">
        {error ? (
          <p className="rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-6 text-center text-sm text-red-300">
            {error}
          </p>
        ) : null}
        {loading ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            Loading fights…
          </p>
        ) : fights.length === 0 && !error ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            No fights in this view. Try another sport or event card.
          </p>
        ) : (
          groupedByCard.map(({ event, fights: cardFights }) => (
            <EventCardSection
              key={`${event.id}-${eventCard}`}
              event={event}
              fights={cardFights}
              onSaved={load}
              isLoggedIn={isLoggedIn}
              defaultExpanded={
                eventCard === "all" || event.id === eventCard
              }
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
