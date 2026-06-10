import Link from "next/link";
import type { PickRecordCounts } from "@/lib/pickRecord/pickRecord";

interface PickRecordHeroButtonProps {
  counts: PickRecordCounts;
}

function PickRecordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <path d="M9 5a2 2 0 014 0" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
      <path d="M9 8h6" />
    </svg>
  );
}

export function PickRecordHeroButton({ counts }: PickRecordHeroButtonProps) {
  return (
    <Link
      href="/pick-record"
      title={`Pick Record — ${counts.upcoming} upcoming, ${counts.settled} settled`}
      className="pick-record-hero-pulse group inline-flex shrink-0 items-center gap-1 rounded-md border border-red-600/75 bg-red-600/15 px-1.5 py-0.5 transition-colors hover:border-red-500 hover:bg-red-600/25"
    >
      <PickRecordIcon className="h-3 w-3 text-red-400" />
      <span className="font-[family-name:var(--font-teko)] text-[11px] font-bold uppercase leading-none tracking-wide text-white">
        Pick Record
      </span>
    </Link>
  );
}
