import Link from "next/link";

interface BrandHeaderProps {
  showTagline?: boolean;
  compact?: boolean;
}

export function BrandHeader({
  showTagline = true,
  compact = false,
}: BrandHeaderProps) {
  return (
    <header className={compact ? "px-4 pt-4" : "px-4 pt-6 pb-2"}>
      <Link href="/picks" className="inline-flex items-center gap-1">
        <span className="text-lg font-black tracking-tight text-white">
          PICK
        </span>
        <span className="relative text-lg font-black tracking-tight text-red-500">
          CHAMP
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-red-500">
            ♛
          </span>
        </span>
      </Link>
      {showTagline && (
        <p className="mt-2 text-xs text-zinc-400 leading-snug max-w-xs">
          You Don&apos;t Know S*** About Fighting. Prove It.
        </p>
      )}
    </header>
  );
}
