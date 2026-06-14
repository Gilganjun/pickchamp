import Link from "next/link";
import {
  getRankingsCtaCopy,
  type RankingsCtaVariant,
} from "@/lib/rankings/rankingsDisplay";

interface RankingsCtaBannerProps {
  variant: RankingsCtaVariant;
}

export function RankingsCtaBanner({ variant }: RankingsCtaBannerProps) {
  const copy = getRankingsCtaCopy(variant);

  return (
    <section className="mt-4 rounded-xl border border-red-500/25 bg-gradient-to-br from-[#1a1010] to-[#111111] px-4 py-3">
      <p className="font-[family-name:var(--font-teko)] text-lg font-bold uppercase tracking-wide text-white">
        {copy.headline}
      </p>
      <p className="mt-0.5 text-xs text-zinc-400">{copy.body}</p>
      <Link
        href={copy.href}
        className="mt-3 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-500"
      >
        {copy.button} →
      </Link>
    </section>
  );
}
