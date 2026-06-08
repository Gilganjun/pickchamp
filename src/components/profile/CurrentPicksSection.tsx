"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CurrentPickCard } from "@/components/profile/CurrentPickCard";
import type { CurrentPickItem } from "@/lib/profile/display";
import { cn } from "@/lib/utils";

interface CurrentPicksSectionProps {
  items: CurrentPickItem[];
  isOwnProfile: boolean;
  showHiddenMessage: boolean;
}

type HeadingCuePhase = "down" | "left" | "right";

const arrowSvgProps = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function DownArrowIcon({ className }: { className?: string }) {
  return (
    <svg {...arrowSvgProps} className={className} aria-hidden>
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </svg>
  );
}

function LeftArrowIcon({ className }: { className?: string }) {
  return (
    <svg {...arrowSvgProps} className={className} aria-hidden>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function RightArrowIcon({ className }: { className?: string }) {
  return (
    <svg {...arrowSvgProps} className={className} aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

const DOWN_FLASH_MS = 1400;
const SWIPE_FLASH_MS = 1100;
const DOWN_FLASH_COUNT = 3;

function HeadingScrollCue({
  side,
  phase,
  cycleKey,
  enableSwipeCycle,
}: {
  side: "left" | "right";
  phase: HeadingCuePhase;
  cycleKey: number;
  enableSwipeCycle: boolean;
}) {
  const iconClass =
    "h-5 w-5 shrink-0 text-sky-400 current-picks-heading-cue-glow sm:h-6 sm:w-6";
  const swipeClass =
    "current-picks-swipe-word text-[8px] font-black uppercase tracking-wider text-sky-400 sm:text-[9px]";

  const showDown =
    phase === "down" ||
    (phase === "left" && side === "right") ||
    (phase === "right" && side === "left");

  if (showDown) {
    return (
      <DownArrowIcon
        key={phase === "down" ? `down-${cycleKey}` : `down-idle-${side}`}
        className={cn(
          iconClass,
          phase === "down" &&
            (enableSwipeCycle
              ? "current-picks-heading-cue--down"
              : "current-picks-heading-cue--down-loop")
        )}
      />
    );
  }

  if (phase === "left" && side === "left") {
    return (
      <div
        key={`left-${cycleKey}`}
        className="flex items-center gap-0.5"
        aria-hidden
      >
        <span className={swipeClass}>Swipe</span>
        <LeftArrowIcon
          className={cn(iconClass, "current-picks-heading-cue--left")}
        />
      </div>
    );
  }

  return (
    <div
      key={`right-${cycleKey}`}
      className="flex items-center gap-0.5"
      aria-hidden
    >
      <RightArrowIcon
        className={cn(iconClass, "current-picks-heading-cue--right")}
      />
      <span className={swipeClass}>Swipe</span>
    </div>
  );
}

function CurrentPicksHeading({
  itemCount,
  hasOverflow,
}: {
  itemCount: number;
  hasOverflow: boolean;
}) {
  const [phase, setPhase] = useState<HeadingCuePhase>("down");
  const [cycleKey, setCycleKey] = useState(0);
  const enableSwipeCycle = hasOverflow;

  useEffect(() => {
    if (!enableSwipeCycle) {
      setPhase("down");
      return;
    }

    const duration =
      phase === "down"
        ? DOWN_FLASH_MS * DOWN_FLASH_COUNT
        : SWIPE_FLASH_MS;

    const timer = setTimeout(() => {
      if (phase === "right") {
        setCycleKey((key) => key + 1);
      }
      setPhase((current) => {
        if (current === "down") return "left";
        if (current === "left") return "right";
        return "down";
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [phase, enableSwipeCycle]);

  const showCues = itemCount > 0;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {showCues ? (
        <HeadingScrollCue
          side="left"
          phase={phase}
          cycleKey={cycleKey}
          enableSwipeCycle={enableSwipeCycle}
        />
      ) : null}
      <h2 className="text-center font-[family-name:var(--font-teko)] text-xl font-bold uppercase tracking-wide text-white">
        Current Picks{" "}
        <span className="text-sky-400">= {itemCount}</span>
      </h2>
      {showCues ? (
        <HeadingScrollCue
          side="right"
          phase={phase}
          cycleKey={cycleKey}
          enableSwipeCycle={enableSwipeCycle}
        />
      ) : null}
    </div>
  );
}

function CarouselArrow({
  direction,
  visible,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  visible: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "left" ? "Scroll picks left" : "Scroll picks right"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full",
        "border border-white/10 bg-black/45 text-white/85 shadow-lg backdrop-blur-sm",
        "transition-all duration-200 hover:bg-black/60 hover:text-white",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400",
        direction === "left" ? "left-2" : "right-2",
        visible && !disabled
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
        aria-hidden
      >
        {direction === "left" ? (
          <path d="M15 6l-6 6 6 6" />
        ) : (
          <path d="M9 6l6 6-6 6" />
        )}
      </svg>
    </button>
  );
}

export function CurrentPicksSection({
  items,
  isOwnProfile,
  showHiddenMessage,
}: CurrentPicksSectionProps) {
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hideArrowsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 4;
    setHasOverflow(overflow);
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const revealArrows = useCallback(() => {
    if (hideArrowsTimer.current) {
      clearTimeout(hideArrowsTimer.current);
      hideArrowsTimer.current = null;
    }
    setShowArrows(true);
  }, []);

  const hideArrowsSoon = useCallback(() => {
    if (hideArrowsTimer.current) clearTimeout(hideArrowsTimer.current);
    hideArrowsTimer.current = setTimeout(() => setShowArrows(false), 1200);
  }, []);

  const scrollByDirection = useCallback((direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-carousel-card]");
    const gap = 12;
    const amount = firstCard
      ? firstCard.offsetWidth + gap
      : Math.round(el.clientWidth * 0.85);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
    revealArrows();
  }, [revealArrows]);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items.length, updateScrollState]);

  useEffect(
    () => () => {
      if (hideArrowsTimer.current) clearTimeout(hideArrowsTimer.current);
    },
    []
  );

  return (
    <section>
      <CurrentPicksHeading itemCount={items.length} hasOverflow={hasOverflow} />

      {items.length === 0 ? (
        <div className="mt-2 rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
          {showHiddenMessage ? (
            <p className="text-sm text-zinc-400">
              Current picks are hidden until fights lock.
            </p>
          ) : isOwnProfile ? (
            <>
              <p className="text-sm text-zinc-400">No current picks yet.</p>
              <Link
                href="/picks"
                className="mt-3 inline-block text-sm font-semibold text-red-500 hover:text-red-400"
              >
                Make your first pick →
              </Link>
            </>
          ) : (
            <p className="text-sm text-zinc-400">No locked picks to show yet.</p>
          )}
        </div>
      ) : (
        <>
          <div
            className="relative -mx-4 mt-2"
            tabIndex={hasOverflow ? 0 : undefined}
            onMouseEnter={revealArrows}
            onMouseLeave={() => setShowArrows(false)}
            onTouchStart={revealArrows}
            onTouchEnd={hideArrowsSoon}
            onFocus={revealArrows}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setShowArrows(false);
              }
            }}
          >
            {hasOverflow ? (
              <>
                <CarouselArrow
                  direction="left"
                  visible={showArrows}
                  disabled={!canScrollLeft}
                  onClick={() => scrollByDirection(-1)}
                />
                <CarouselArrow
                  direction="right"
                  visible={showArrows}
                  disabled={!canScrollRight}
                  onClick={() => scrollByDirection(1)}
                />
              </>
            ) : null}

            <div
              ref={scrollRef}
              className="pickfist-horizontal-scroll flex gap-3 px-4 pb-1"
              aria-label="Current picks — swipe or use arrows to see more"
            >
              {items.map((item) => (
                <CurrentPickCard key={item.prediction.id} item={item} />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
