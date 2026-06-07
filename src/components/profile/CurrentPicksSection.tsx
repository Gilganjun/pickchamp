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

function DownArrowCue() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="current-picks-heading-arrow h-5 w-5 shrink-0 text-sky-400 sm:h-6 sm:w-6"
      aria-hidden
    >
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </svg>
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
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {items.length > 0 ? <DownArrowCue /> : null}
        <h2 className="text-center font-[family-name:var(--font-teko)] text-xl font-bold uppercase tracking-wide text-white">
          Current Picks{" "}
          <span className="text-sky-400">= {items.length}</span>
        </h2>
        {items.length > 0 ? <DownArrowCue /> : null}
      </div>

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
