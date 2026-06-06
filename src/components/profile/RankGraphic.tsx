import Image from "next/image";
import { getRankGraphicSrc } from "@/lib/profile/rankGraphics";
import { cn } from "@/lib/utils";

interface RankGraphicProps {
  tierName: string;
  size?: "xs" | "sm" | "md";
  className?: string;
  imageClassName?: string;
  showLabel?: boolean;
}

/** Native asset dimensions (Graphics/ — tight-cropped canvases). */
const NATIVE_WIDTH = 310;
const NATIVE_HEIGHT = 365;

const SIZE = {
  xs: {
    className: "h-[2.8rem] w-[2.375rem]",
    labelMaxW: "max-w-[2.5rem]",
  },
  sm: {
    className: "h-[4.25rem] w-[3.625rem]",
    labelMaxW: "max-w-[3.75rem]",
  },
  md: {
    className: "h-[5.5rem] w-[4.7rem]",
    labelMaxW: "max-w-[4.85rem]",
  },
} as const;

function rankLabelSize(tierName: string, size: "xs" | "sm" | "md"): string {
  if (size === "xs") {
    if (tierName.length > 16) return "text-[5px]";
    if (tierName.length > 12) return "text-[6px]";
    return "text-[7px]";
  }
  if (size === "md") {
    return tierName.length > 16 ? "text-[10px]" : "text-xs";
  }
  if (tierName.length > 18) return "text-[6px]";
  if (tierName.length > 14) return "text-[7px]";
  return "text-[9px]";
}

export function RankGraphic({
  tierName,
  size = "sm",
  className,
  imageClassName,
  showLabel = true,
}: RankGraphicProps) {
  const dims = SIZE[size];
  const src = getRankGraphicSrc(tierName);

  return (
    <div className={cn("flex flex-col items-center gap-0", className)}>
      <Image
        src={src}
        alt={`${tierName} rank`}
        width={NATIVE_WIDTH}
        height={NATIVE_HEIGHT}
        className={cn(
          "object-contain object-center",
          dims.className,
          imageClassName
        )}
        priority={size !== "xs"}
      />
      {showLabel ? (
        <p
          className={cn(
            "mt-0.5 text-center font-black uppercase leading-none tracking-wide text-white",
            dims.labelMaxW,
            rankLabelSize(tierName, size)
          )}
        >
          {tierName}
        </p>
      ) : null}
    </div>
  );
}
