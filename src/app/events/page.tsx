import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getEventsWithMeta } from "@/lib/data/events";
import { formatFightDate } from "@/lib/utils";

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

function EventCard({
  event,
}: {
  event: {
    id: string;
    name: string;
    promotion: string | null;
    event_date: string;
    fightCount: number;
    sports: string[];
  };
}) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="block rounded-xl border border-[#2a2a2a] bg-[#111111] p-4 hover:border-zinc-600"
    >
      <p className="font-bold">{event.name}</p>
      <p className="mt-1 text-xs text-zinc-500">
        {formatFightDate(event.event_date)}
      </p>
      {event.promotion && (
        <p className="text-xs text-zinc-600">{event.promotion}</p>
      )}
      <p className="mt-2 text-xs text-zinc-400">
        {event.fightCount} fights · {event.sports.join(", ").toUpperCase()}
      </p>
    </Link>
  );
}
