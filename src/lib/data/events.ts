import {
  getMockEvents,
  getMockFightWithRelations,
  getMockFights,
} from "@/data/mock";
import { hasSupabaseConfig } from "@/lib/config";
import {
  fetchAllEvents,
  fetchAllFights,
  fetchFightWithRelations,
} from "@/lib/data/supabase-fetch";
import type { Event, FightWithRelations } from "@/types";

export interface EventWithMeta extends Event {
  fightCount: number;
  sports: string[];
  isSettled: boolean;
}

function buildEventsWithMeta(
  events: Event[],
  fights: { event_id: string; sport: string; status: string }[]
): { upcoming: EventWithMeta[]; settled: EventWithMeta[] } {
  const withMeta: EventWithMeta[] = events.map((event) => {
    const eventFights = fights.filter((f) => f.event_id === event.id);
    const sports = [...new Set(eventFights.map((f) => f.sport))];
    const isSettled =
      eventFights.length > 0 &&
      eventFights.every(
        (f) => f.status === "settled" || f.status === "cancelled"
      );
    return {
      ...event,
      fightCount: eventFights.length,
      sports,
      isSettled,
    };
  });

  return {
    upcoming: withMeta.filter((e) => !e.isSettled),
    settled: withMeta.filter((e) => e.isSettled),
  };
}

export async function getEventsWithMeta(): Promise<{
  upcoming: EventWithMeta[];
  settled: EventWithMeta[];
}> {
  if (hasSupabaseConfig()) {
    const [events, fights] = await Promise.all([
      fetchAllEvents(),
      fetchAllFights(),
    ]);
    return buildEventsWithMeta(events, fights);
  }

  const events = getMockEvents();
  const fights = getMockFights();
  return buildEventsWithMeta(events, fights);
}

export async function getEventDetail(
  eventId: string
): Promise<{ event: Event; fights: FightWithRelations[] } | null> {
  if (hasSupabaseConfig()) {
    const events = await fetchAllEvents();
    const event = events.find((e) => e.id === eventId);
    if (!event) return null;
    const fights = (await fetchFightWithRelations()).filter(
      (f) => f.event_id === eventId
    );
    return { event, fights };
  }

  const events = getMockEvents();
  const event = events.find((e) => e.id === eventId);
  if (!event) return null;
  const fights = getMockFightWithRelations().filter(
    (f) => f.event_id === eventId
  );
  return { event, fights };
}
