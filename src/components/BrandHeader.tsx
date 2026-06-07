import Link from "next/link";
import { PickFistLogo } from "@/components/PickFistLogo";
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
        compact
          ? "pt-3 pb-1"
          : prominent
            ? "pt-3 pb-0 sm:pt-4"
            : "pt-5 pb-2"
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
          "inline-flex items-center",
          centered && "justify-center",
          showProfileLink && "mx-auto"
        )}
        aria-label="PickFist home"
      >
        <PickFistLogo
          size={prominent ? "lg" : compact ? "sm" : "md"}
          priority={prominent}
          className={showTagline ? "object-bottom" : undefined}
        />
      </Link>
      {showTagline && (
        <RotatingSubheading
          className={cn(
            "text-zinc-400",
            centered && "mx-auto",
            prominent ? "-mt-2.5 text-xs sm:-mt-3 sm:text-sm" : "mt-0.5 text-xs"
          )}
        />
      )}
    </header>
  );
}
