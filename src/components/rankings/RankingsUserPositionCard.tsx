import Link from "next/link";
import type { ReactNode } from "react";
import {
  formatGradedPicksRemaining,
  formatPickFistScore,
  type RankingsUserContext,
} from "@/lib/rankings/rankingsDisplay";

interface RankingsUserPositionCardProps {
  context: RankingsUserContext;
}

function InlineDot() {
  return <span className="text-zinc-600" aria-hidden>·</span>;
}

export function RankingsUserPositionCard({
  context,
}: RankingsUserPositionCardProps) {
  let body: ReactNode = null;

  if (context.state === "guest") {
    body = (
      <>
        <span className="text-zinc-400">Sign in to track your rank.</span>
        <Link
          href="/login?next=/rankings"
          className="shrink-0 font-semibold text-red-500 hover:text-red-400"
        >
          Sign in
        </Link>
      </>
    );
  }

  if (context.state === "provisional") {
    body = (
      <>
        <span className="font-semibold uppercase tracking-wide text-[#d4a853]">
          Provisional
        </span>
        <InlineDot />
        <span className="truncate text-zinc-400">
          {formatGradedPicksRemaining(context.picksRemaining, context.tab)}
        </span>
      </>
    );
  }

  if (context.state === "official_outside") {
    body = (
      <>
        <span className="font-[family-name:var(--font-teko)] text-base font-bold tabular-nums text-white">
          #{context.officialRank}
        </span>
        <InlineDot />
        <span className="font-[family-name:var(--font-teko)] text-base font-bold tabular-nums text-white">
          {formatPickFistScore(context.score)}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-zinc-500">
          score
        </span>
        {context.gapToTop10 != null && context.gapToTop10 > 0 ? (
          <>
            <InlineDot />
            <span className="truncate text-zinc-400">
              {context.gapToTop10} pt{context.gapToTop10 === 1 ? "" : "s"} to
              Top 10
            </span>
          </>
        ) : null}
      </>
    );
  }

  if (context.state === "official_inside") {
    body = (
      <>
        <span className="font-[family-name:var(--font-teko)] text-base font-bold tabular-nums text-white">
          #{context.officialRank}
        </span>
        <InlineDot />
        <span className="font-[family-name:var(--font-teko)] text-base font-bold tabular-nums text-white">
          {formatPickFistScore(context.score)}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-zinc-500">
          score
        </span>
        <InlineDot />
        <span className="shrink-0 font-semibold uppercase tracking-wide text-[#d4a853]">
          In Top 10
        </span>
      </>
    );
  }

  return (
    <section
      className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-[#2a2a2a]/90 bg-[#111111]/60 px-3 py-2 text-xs leading-snug"
      aria-label="Your position on this leaderboard"
    >
      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">
        You
      </span>
      <InlineDot />
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
        {body}
      </div>
    </section>
  );
}
