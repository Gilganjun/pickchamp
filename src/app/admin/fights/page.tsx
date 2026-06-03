import { createFight, getAdminData } from "@/app/actions/admin";
import { AdminFightFields } from "@/components/admin/AdminFightFields";
import { AdminFormSection } from "@/components/AdminFormSection";
import Link from "next/link";

export default async function AdminFightsPage() {
  const { events, fights } = await getAdminData();

  return (
    <div className="min-h-dvh bg-zinc-950 p-6 text-white max-w-2xl">
      <Link href="/admin" className="text-sm text-zinc-500">
        ← Admin
      </Link>
      <h1 className="mt-2 text-xl font-bold">Fights</h1>

      <form action={createFight} className="mt-6">
        <AdminFormSection title="Add Fight">
          <div className="space-y-3">
            <label className="block text-xs text-zinc-400">
              Event *
              <select
                name="event_id"
                required
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-zinc-400">
              Sport *
              <select
                name="sport"
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              >
                <option value="boxing">Boxing</option>
                <option value="mma">MMA</option>
              </select>
            </label>
            <label className="block text-xs text-zinc-400">
              Fighter A *
              <input
                name="fighter_a_name"
                required
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              Fighter B *
              <input
                name="fighter_b_name"
                required
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <AdminFightFields />
            <label className="block text-xs text-zinc-400">
              Scheduled rounds * (not hardcoded — admin enters per fight)
              <input
                name="scheduled_rounds"
                type="number"
                min={1}
                required
                placeholder="e.g. 12 boxing, 5 MMA"
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              Weight class
              <input
                name="weight_class"
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              Lock time *
              <input
                name="lock_time"
                type="datetime-local"
                required
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              Fight order
              <input
                name="fight_order"
                type="number"
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded bg-red-600 px-4 py-2 text-sm font-bold"
            >
              Add Fight
            </button>
          </div>
        </AdminFormSection>
      </form>

      <ul className="mt-8 space-y-2 text-sm">
        {fights.map((f) => (
          <li key={f.id} className="border-b border-zinc-800 py-2">
            {f.fighter_a_name} vs {f.fighter_b_name} ({f.scheduled_rounds} rds,{" "}
            {f.sport}) — {f.favourite_side}/{f.favourite_level} — {f.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
