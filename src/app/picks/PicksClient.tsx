"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FightCard } from "@/components/FightCard";
import {
  PicksFilterBar,
  resolveCardFilterForSport,
  type CardFilterValue,
} from "@/components/picks/PicksFilterBar";
import {
  getEventsForPicks,
  getFightsForPicks,
  groupFightsByEvent,
} from "@/lib/data/fights";
import { formatEventDateTime } from "@/lib/datetime";
import { inferFightTab } from "@/lib/utils";
import type { Event, FightWithRelations, SportFilter as SF } from "@/types";

function PicksFightList({
  fights,
  onSaved,
}: {
  fights: FightWithRelations[];
  onSaved: () => void;
}) {
  return (
    <>
      {fights.map((fight) => (
        <FightCard
          key={fight.id}
          fight={fight}
          onSaved={onSaved}
          enablePickImpact
        />
      ))}
    </>
  );
}

function EventCardSection({
  event,
  fights,
  onSaved,
}: {
  event: Event;
  fights: FightWithRelations[];
  onSaved: () => void;
}) {
  const isLiveCard = fights.some(
    (fight) => inferFightTab(fight.status, fight.lock_time) === "live"
  );

  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-[#2a2a2a] bg-[#181818] px-4 py-3">
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
      <PicksFightList fights={fights} onSaved={onSaved} />
    </section>
  );
}

export function PicksClient() {
  const [sport, setSport] = useState<SF>("all");
  const [eventCard, setEventCard] = useState<CardFilterValue>("all");
  const [pickEvents, setPickEvents] = useState<Event[]>([]);
  const [fights, setFights] = useState<FightWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const events = await getEventsForPicks(sport);
    setPickEvents(events);
    const resolvedCard = resolveCardFilterForSport(eventCard, events);
    if (resolvedCard !== eventCard) {
      setEventCard(resolvedCard);
    }
    const data = await getFightsForPicks(sport, undefined, resolvedCard);
    setFights(data);
    setLoading(false);
  }, [sport, eventCard]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSportChange = (next: SF) => {
    setSport(next);
  };

  const groupedByCard = useMemo(() => groupFightsByEvent(fights), [fights]);

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
        {loading ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            Loading fights…
          </p>
        ) : fights.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            No fights in this view. Try another sport or event card.
          </p>
        ) : (
          groupedByCard.map(({ event, fights: cardFights }) => (
            <EventCardSection
              key={event.id}
              event={event}
              fights={cardFights}
              onSaved={load}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
