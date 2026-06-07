import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import {
  EventCardHeaderContent,
  EventCardShell,
} from "@/components/events/EventCardShell";
import { getEventsWithMeta, type EventWithMeta } from "@/lib/data/events";

export default async function EventsPage() {
  const { upcoming, settled } = await getEventsWithMeta();

  return (
    <AppShell showTagline={false}>
      <h1 className="text-xl font-black uppercase">Events</h1>

      <section className="mt-6">
        <h2 className="text-xs font-bold uppercase text-zinc-500">
          Upcoming
        </h2>
        <div className="mt-3 space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-sm text-zinc-500">No upcoming events.</p>
          ) : (
            upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </section>

      <section className="mt-8 pb-4">
        <h2 className="text-xs font-bold uppercase text-zinc-500">Settled</h2>
        <div className="mt-3 space-y-3">
          {settled.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function EventCard({ event }: { event: EventWithMeta }) {
  return (
    <EventCardShell event={event} surface="default" className="hover:border-zinc-600">
      <Link
        href={`/events/${event.id}`}
        className="relative z-[2] block px-4 py-3 transition-colors hover:bg-white/[0.02]"
      >
        <EventCardHeaderContent
          event={event}
          fightLine={`${event.fightCount} fight${event.fightCount === 1 ? "" : "s"} · ${event.sports.join(", ").toUpperCase()}`}
        />
      </Link>
    </EventCardShell>
  );
}
