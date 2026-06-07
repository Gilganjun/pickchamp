"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const CARD_EXPAND_POINTER_SRC = "/graphics/Pointer1.png";

/** Intrinsic asset size — update if Pointer1.png dimensions differ. */
const NATIVE_WIDTH = 128;
const NATIVE_HEIGHT = 128;

function PointerGraphicFallback({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={cn(
        "card-expand-pointer-image h-14 w-14 text-white sm:h-16 sm:w-16",
        className
      )}
    >
      <path
        d="M18 8c-2 0-4 2-4 5v22c0 4 3 7 7 7h3l9 14c1 2 4 2 5 0l2-3c1-1 0-3-2-4l-8-7h8c3 0 5-2 5-5V13c0-3-2-5-5-5H18z"
        fill="currentColor"
        stroke="#dc2626"
        strokeWidth="2"
      />
      <path
        d="M44 46l10 10"
        stroke="#dc2626"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface CardExpandPointerProps {
  className?: string;
}

export function CardExpandPointer({ className }: CardExpandPointerProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={cn(
        "card-expand-pointer pointer-events-none absolute z-[4] flex flex-col items-center justify-center gap-0.5",
        className
      )}
    >
      {imageFailed ? (
        <PointerGraphicFallback />
      ) : (
        <Image
          src={CARD_EXPAND_POINTER_SRC}
          alt=""
          width={NATIVE_WIDTH}
          height={NATIVE_HEIGHT}
          sizes="4.5rem"
          unoptimized
          onError={() => setImageFailed(true)}
          aria-hidden
          className={cn(
            "card-expand-pointer-image h-14 w-14 object-contain object-center sm:h-16 sm:w-16",
            "mix-blend-screen"
          )}
        />
      )}
      <span className="card-expand-pointer-label text-center text-[11px] font-bold uppercase leading-none tracking-[0.12em] text-white sm:text-xs">
        Tap to Open
      </span>
    </div>
  );
}
