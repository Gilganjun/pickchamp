import { WorldGlobeIcon } from "@/components/profile/WorldGlobeIcon";
import { formatPicksToQualifyLabel } from "@/lib/profile/display";
import type { GlobalRankHeroState } from "@/lib/profile/display";
import { cn } from "@/lib/utils";

interface WorldRankDisplayProps {
  state: GlobalRankHeroState;
  label: string;
  variant?: "hero" | "compact" | "sport";
  className?: string;
}

export function WorldRankDisplay({
  state,
  label,
  variant = "compact",
  className,
}: WorldRankDisplayProps) {
  const isHero = variant === "hero";
  const isSport = variant === "sport";

  return (
    <div className={cn("min-w-0", className)}>
      {!isSport ? (
        <div
          className={cn(
            "flex items-center gap-1",
            isHero ? "justify-center" : "justify-start"
          )}
        >
          <WorldGlobeIcon size={isHero ? 14 : 12} />
          {state.kind === "official" ? (
            <p
              className={cn(
                "font-black tabular-nums leading-none text-white",
                isHero ? "text-xl" : "text-base"
              )}
            >
              #{state.rank.toLocaleString()}
            </p>
          ) : state.kind === "waiting_results" ? (
            <div className={cn(isHero ? "text-center" : "min-w-0")}>
              <p
                className={cn(
                  "font-black uppercase leading-tight tracking-tight text-[#d4a853]",
                  isHero ? "text-xs" : "text-[10px]"
                )}
              >
                Qualified
              </p>
              <p
                className={cn(
                  "font-semibold uppercase leading-tight tracking-wide text-zinc-500",
                  isHero ? "mt-1 text-[8px]" : "text-[7px]"
                )}
              >
                Waiting for results
              </p>
            </div>
          ) : (
            <p
              className={cn(
                "font-black uppercase leading-tight tracking-tight text-orange-500",
                isHero ? "text-xs" : "text-[10px]"
              )}
            >
              {formatPicksToQualifyLabel(state.remaining)}
            </p>
          )}
        </div>
      ) : (
        <div className="min-w-0">
          {state.kind === "official" ? (
            <p className="font-[family-name:var(--font-teko)] text-2xl font-bold tabular-nums leading-none text-white">
              #{state.rank.toLocaleString()}
            </p>
          ) : state.kind === "waiting_results" ? (
            <>
              <p className="text-xs font-black uppercase tracking-wide text-[#d4a853]">
                Qualified
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                Waiting for results
              </p>
            </>
          ) : (
            <p className="text-xs font-black uppercase tracking-wide text-orange-500">
              {formatPicksToQualifyLabel(state.remaining)}
            </p>
          )}
        </div>
      )}

      {label ? (
        <p
          className={cn(
            "font-bold uppercase leading-tight tracking-[0.08em] text-zinc-500",
            isHero ? "mt-0.5 text-[8px]" : "mt-0.5 text-[7px]",
            variant === "compact" && "break-words"
          )}
        >
          {label}
        </p>
      ) : null}
    </div>
  );
}
