import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-4xl font-black tracking-tight">
          <span className="text-white">PICK</span>
          <span className="text-red-500">CHAMP</span>
        </h1>
        <p className="mt-4 text-lg text-zinc-400 leading-relaxed">
          You Don&apos;t Know S*** About Fighting.
          <br />
          Prove It.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/picks"
            className="rounded-xl bg-red-600 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-500"
          >
            Make Your Picks
          </Link>
          <Link
            href="/rankings"
            className="rounded-xl border border-[#2a2a2a] bg-[#111111] px-8 py-4 text-sm font-bold uppercase tracking-wide text-white hover:border-zinc-600"
          >
            View Rankings
          </Link>
        </div>

        <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
          <section>
            <h2 className="text-sm font-bold uppercase text-red-500">
              Pick winners
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Predict boxing and MMA fight outcomes before lock time.
            </p>
          </section>
          <section>
            <h2 className="text-sm font-bold uppercase text-red-500">
              Climb rankings
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Earn rating points for rare correct picks — not raw accuracy alone.
            </p>
          </section>
          <section>
            <h2 className="text-sm font-bold uppercase text-red-500">
              Prove knowledge
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Skill-based competition. No betting. No real money.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
