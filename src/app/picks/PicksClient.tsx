"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  EventCardFilter,
  type EventCardFilterValue,
} from "@/components/EventCardFilter";
import { FightCard } from "@/components/FightCard";
import { SportFilter } from "@/components/SportFilter";
import { TabBar } from "@/components/TabBar";
import {
  getEventsForPicks,
  getFightsForPicks,
  groupFightsByEvent,
} from "@/lib/data/fights";
import { formatEventDateTime } from "@/lib/datetime";
import type { Event, FightWithRelations, PickTab, SportFilter as SF } from "@/types";

const tabs: { id: PickTab; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "live", label: "Live" },
  { id: "settled", label: "Settled" },
];

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
  return (
    <section className="space-y-3">
      <div className="rounded-xl border border-[#2a2a2a] bg-[#181818] px-4 py-3">
        <h2 className="text-sm font-bold uppercase tracking-tight text-white">
          {event.name}
        </h2>
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
  const [tab, setTab] = useState<PickTab>("upcoming");
  const [sport, setSport] = useState<SF>("all");
  const [eventCard, setEventCard] = useState<EventCardFilterValue>("all");
  const [pickEvents, setPickEvents] = useState<Event[]>([]);
  const [fights, setFights] = useState<FightWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const events = await getEventsForPicks(tab, sport);
    setPickEvents(events);
    let filter: EventCardFilterValue = eventCard;
    if (filter !== "all" && !events.some((e) => e.id === filter)) {
      filter = "all";
      setEventCard("all");
    }
    const data = await getFightsForPicks(tab, sport, undefined, filter);
    setFights(data);
    setLoading(false);
  }, [tab, sport, eventCard]);

  useEffect(() => {
    load();
  }, [load]);

  const groupedByCard = useMemo(() => groupFightsByEvent(fights), [fights]);

  const multiCardView =
    eventCard === "all" && groupedByCard.length > 1;

  return (
    <AppShell prominentBrand showTagline>
      <TabBar tabs={tabs} value={tab} onChange={setTab} />
      <div className="mt-4">
        <SportFilter value={sport} onChange={setSport} />
      </div>
      <div className="mt-4">
        <EventCardFilter
          value={eventCard}
          onChange={setEventCard}
          events={pickEvents}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <span className="text-[10px] text-zinc-600">
          {multiCardView ? "Grouped by card" : "Sort: Card order"}
        </span>
      </div>

      <div className="mt-3 space-y-4">
        {loading ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            Loading fights…
          </p>
        ) : fights.length === 0 ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            No fights in this view. Try another tab, sport, or event card.
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
