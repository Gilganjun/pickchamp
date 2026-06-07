import Image from "next/image";
import { cn } from "@/lib/utils";

export const PICKFIST_LOGO_SRC = "/graphics/PickfistLogo.png";

/** Intrinsic asset size (Graphics/PickfistLogo.png). */
const NATIVE_WIDTH = 327;
const NATIVE_HEIGHT = 131;

/** Heights scaled ~65% above the original text-logo equivalents. */
const SIZE = {
  sm: "h-[2.9rem] w-auto max-w-[17.3rem]",
  md: "h-[3.3rem] w-auto max-w-[19.8rem]",
  lg: "h-[3.7rem] w-auto max-w-[22.3rem] sm:h-[4.1rem] sm:max-w-[24.75rem]",
  auth: "h-[3.3rem] w-auto max-w-[19.8rem]",
} as const;

export type PickFistLogoSize = keyof typeof SIZE;

interface PickFistLogoProps {
  size?: PickFistLogoSize;
  className?: string;
  priority?: boolean;
}

export function PickFistLogo({
  size = "md",
  className,
  priority = false,
}: PickFistLogoProps) {
  return (
    <Image
      src={PICKFIST_LOGO_SRC}
      alt="PickFist"
      width={NATIVE_WIDTH}
      height={NATIVE_HEIGHT}
      sizes="(max-width: 640px) 22.3rem, 24.75rem"
      priority={priority}
      className={cn("object-contain object-center", SIZE[size], className)}
    />
  );
}
