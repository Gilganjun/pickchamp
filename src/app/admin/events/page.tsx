import { createEvent, getAdminData } from "@/app/actions/admin";
import { AdminFormSection } from "@/components/AdminFormSection";
import Link from "next/link";

export default async function AdminEventsPage() {
  const { events } = await getAdminData();

  return (
    <div className="min-h-dvh bg-zinc-950 p-6 text-white max-w-2xl">
      <Link href="/admin" className="text-sm text-zinc-500">
        ← Admin
      </Link>
      <h1 className="mt-2 text-xl font-bold">Events</h1>

      <form action={createEvent} className="mt-6">
        <AdminFormSection title="Create Event">
          <div className="space-y-3">
            <label className="block text-xs text-zinc-400">
              Name *
              <input
                name="name"
                required
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              Promotion
              <input
                name="promotion"
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              Location
              <input
                name="location"
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              Event date *
              <input
                name="event_date"
                type="datetime-local"
                required
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-sm font-bold"
            >
              Create Event
            </button>
          </div>
        </AdminFormSection>
      </form>

      <ul className="mt-8 space-y-2 text-sm">
        {events.map((e) => (
          <li key={e.id} className="border-b border-zinc-800 py-2">
            {e.name} — {new Date(e.event_date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
