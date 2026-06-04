import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getEventDetail } from "@/lib/data/events";
import { formatEventDateTime, formatPickLockDateTime } from "@/lib/datetime";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getEventDetail(id);
  if (!data) notFound();

  const { event, fights } = data;

  return (
    <AppShell showTagline={false} showBottomNav>
      <Link href="/events" className="text-xs text-zinc-500 hover:text-white">
        ← Events
      </Link>
      <h1 className="mt-2 text-xl font-black">{event.name}</h1>
      <p className="text-sm text-zinc-500">{formatEventDateTime(event)}</p>
      {event.promotion && (
        <p className="text-xs text-zinc-600">{event.promotion}</p>
      )}

      <div className="mt-6 space-y-3">
        {fights.map((fight) => (
          <div
            key={fight.id}
            className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4"
          >
            <div className="flex justify-between">
              <span className="text-[10px] font-bold uppercase text-red-500">
                {fight.sport}
              </span>
              <span className="text-[10px] uppercase text-zinc-500">
                {fight.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-2 font-bold">
              {fight.fighter_a_name} vs {fight.fighter_b_name}
            </p>
            <p className="text-xs text-zinc-500">
              {fight.scheduled_rounds} rounds · picks lock{" "}
              {formatPickLockDateTime(fight.lock_time, event)}
            </p>
            <Link
              href="/picks"
              className="mt-3 inline-block text-xs font-semibold text-red-500"
            >
              Make pick →
            </Link>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
