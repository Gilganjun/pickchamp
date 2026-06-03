import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-dvh bg-zinc-950 p-6 text-white">
      <h1 className="text-2xl font-bold">PickChamp Admin</h1>
      <p className="mt-2 text-sm text-zinc-400">
        MVP admin (mock mode). Secured via profiles.is_admin or ADMIN_EMAILS
        when Supabase is connected.
      </p>
      <nav className="mt-8 flex flex-col gap-3 max-w-sm">
        <Link
          href="/admin/events"
          className="rounded-lg border border-zinc-700 px-4 py-3 hover:bg-zinc-900"
        >
          Events →
        </Link>
        <Link
          href="/admin/fights"
          className="rounded-lg border border-zinc-700 px-4 py-3 hover:bg-zinc-900"
        >
          Fights →
        </Link>
        <Link
          href="/admin/results"
          className="rounded-lg border border-zinc-700 px-4 py-3 hover:bg-zinc-900"
        >
          Results & Grading →
        </Link>
        <Link href="/picks" className="text-sm text-zinc-500 mt-4">
          ← Back to app
        </Link>
      </nav>
    </div>
  );
}
