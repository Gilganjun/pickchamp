import Link from "next/link";
import { RotatingSubheading } from "@/components/RotatingSubheading";
import { cn } from "@/lib/utils";

interface BrandHeaderProps {
  showTagline?: boolean;
  compact?: boolean;
  prominent?: boolean;
  /** Center logo + tagline within the content column (Picks page) */
  centered?: boolean;
  showProfileLink?: boolean;
}

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className="h-6 w-6"
      aria-hidden
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
    </svg>
  );
}

export function BrandHeader({
  showTagline = true,
  compact = false,
  prominent = false,
  centered = false,
  showProfileLink = false,
}: BrandHeaderProps) {
  return (
    <header
      className={cn(
        "relative w-full",
        centered && "text-center",
        compact ? "pt-4 pb-2" : prominent ? "pt-4 pb-2 sm:pt-5 sm:pb-3" : "pt-6 pb-3"
      )}
    >
      {showProfileLink ? (
        <Link
          href="/profile"
          className="absolute right-0 top-3 flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/5 hover:text-white sm:top-4"
          aria-label="Profile"
        >
          <ProfileIcon />
        </Link>
      ) : null}
      <Link
        href="/picks"
        className={cn(
          "inline-flex items-center gap-1.5",
          centered && "justify-center",
          showProfileLink && "mx-auto"
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
          FIST
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
        <RotatingSubheading
          className={cn(
            "text-zinc-400",
            centered && "mx-auto",
            prominent ? "mt-1 text-xs sm:text-sm" : "mt-2 text-xs"
          )}
        />
      )}
    </header>
  );
}
