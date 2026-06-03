import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandHeaderProps {
  showTagline?: boolean;
  compact?: boolean;
  prominent?: boolean;
  /** Center logo + tagline within the content column (Picks page) */
  centered?: boolean;
}

export function BrandHeader({
  showTagline = true,
  compact = false,
  prominent = false,
  centered = false,
}: BrandHeaderProps) {
  return (
    <header
      className={cn(
        "w-full",
        centered && "text-center",
        compact ? "pt-4 pb-2" : prominent ? "pt-6 pb-4" : "pt-6 pb-3"
      )}
    >
      <Link
        href="/picks"
        className={cn(
          "inline-flex items-center gap-1.5",
          centered && "justify-center"
        )}
      >
        <span
          className={cn(
            "font-black tracking-tight text-white",
            prominent ? "text-3xl" : compact ? "text-lg" : "text-xl"
          )}
        >
          PICK
        </span>
        <span
          className={cn(
            "relative font-black tracking-tight text-red-500",
            prominent ? "text-3xl" : compact ? "text-lg" : "text-xl"
          )}
        >
          CHAMP
          <span
            className={cn(
              "absolute left-1/2 -translate-x-1/2 text-red-500",
              prominent ? "-top-2.5 text-[10px]" : "-top-2 text-[8px]"
            )}
          >
            ♛
          </span>
        </span>
      </Link>
      {showTagline && (
        <p
          className={cn(
            "text-zinc-400 leading-snug",
            centered ? "mx-auto max-w-sm" : "max-w-sm",
            prominent ? "mt-1.5 text-sm" : "mt-2 text-xs"
          )}
        >
          You Don&apos;t Know S*** About Fighting.
        </p>
      )}
    </header>
  );
}
