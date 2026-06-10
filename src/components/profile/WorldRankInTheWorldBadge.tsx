import { cn } from "@/lib/utils";
import type { Sport } from "@/types";

interface WorldRankInTheWorldBadgeProps {
  sport: Sport;
  className?: string;
}

const BADGE_STYLES: Record<Sport, string> = {
  boxing: "border-red-500/55 bg-red-600/20 text-red-300",
  mma: "border-purple-500/55 bg-purple-600/20 text-purple-300",
};

export function WorldRankInTheWorldBadge({
  sport,
  className,
}: WorldRankInTheWorldBadgeProps) {
  return (
    <span
      className={cn(
        "mb-0.5 inline-block -rotate-12 rounded-sm border px-1 py-0.5 font-[family-name:var(--font-teko)] text-[8px] font-bold uppercase leading-[1.05] tracking-[0.14em] shadow-sm",
        BADGE_STYLES[sport],
        className
      )}
    >
      in the world
    </span>
  );
}
