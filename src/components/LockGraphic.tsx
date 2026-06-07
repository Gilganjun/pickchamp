import Image from "next/image";
import { cn } from "@/lib/utils";

export const LOCK_GRAPHIC_SRC = "/graphics/Lock.png";

/** Intrinsic asset size (Graphics/Lock.png — display size set via VARIANT classes). */
const NATIVE_WIDTH = 205;
const NATIVE_HEIGHT = 205;

const VARIANT = {
  /** Centered overlay on collapsed event cards */
  card: "h-[4.5rem] w-[4.5rem] sm:h-[5.5rem] sm:w-[5.5rem]",
  /** Individual fight pick-locked notice */
  notice: "h-14 w-14 sm:h-16 sm:w-16",
} as const;

export type LockGraphicVariant = keyof typeof VARIANT;

interface LockGraphicProps {
  variant?: LockGraphicVariant;
  className?: string;
  /** Knocks out the asset's black backdrop on dark UI */
  blend?: boolean;
}

export function LockGraphic({
  variant = "notice",
  className,
  blend = true,
}: LockGraphicProps) {
  return (
    <Image
      src={LOCK_GRAPHIC_SRC}
      alt=""
      width={NATIVE_WIDTH}
      height={NATIVE_HEIGHT}
      sizes={variant === "card" ? "5.5rem" : "4rem"}
      aria-hidden
      className={cn(
        "object-contain object-center",
        blend && "mix-blend-screen",
        VARIANT[variant],
        className
      )}
    />
  );
}
