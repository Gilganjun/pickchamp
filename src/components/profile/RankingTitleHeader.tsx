import { WorldGlobeIcon } from "@/components/profile/WorldGlobeIcon";
import { cn } from "@/lib/utils";

interface RankingTitleHeaderProps {
  name: string;
  nameClassName?: string;
  trailing?: React.ReactNode;
  align?: "left" | "center";
  size?: "hero" | "card";
  className?: string;
}

export function RankingTitleHeader({
  name,
  nameClassName = "text-[#d4a853]",
  trailing,
  align = "left",
  size = "card",
  className,
}: RankingTitleHeaderProps) {
  const isHero = size === "hero";

  return (
    <header
      className={cn(
        align === "center" && "text-center",
        isHero && "border-b border-white/8 pb-2",
        className
      )}
    >
      <div
        className={cn(
          "flex items-start gap-1.5",
          align === "center" && "justify-center"
        )}
      >
        <WorldGlobeIcon
          size={isHero ? 14 : 15}
          className={cn("shrink-0", isHero ? "mt-0.5" : "mt-1")}
        />
        <div className="min-w-0">
          <h3
            className={cn(
              "font-[family-name:var(--font-teko)] font-bold uppercase leading-[0.92] tracking-wide",
              isHero ? "text-lg" : "text-xl",
              nameClassName
            )}
          >
            {name}
          </h3>
          <p
            className={cn(
              "font-[family-name:var(--font-teko)] font-bold uppercase leading-none tracking-wide text-white",
              isHero ? "text-base" : "text-lg"
            )}
          >
            Ranking
          </p>
        </div>
        {trailing ? (
          <span className="ml-auto shrink-0 opacity-80" aria-hidden>
            {trailing}
          </span>
        ) : null}
      </div>
    </header>
  );
}
