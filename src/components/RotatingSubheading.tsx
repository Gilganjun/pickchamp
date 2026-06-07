"use client";

import { useEffect, useState } from "react";
import {
  ROTATING_SUBHEADING_PHRASES,
  ROTATING_SUBHEADING_TRANSITION_MS,
  ROTATING_SUBHEADING_VISIBLE_MS,
} from "@/lib/brand/subheadingPhrases";
import { cn } from "@/lib/utils";

interface RotatingSubheadingProps {
  className?: string;
  intervalMs?: number;
  transitionMs?: number;
}

export function RotatingSubheading({
  className,
  intervalMs = ROTATING_SUBHEADING_VISIBLE_MS,
  transitionMs = ROTATING_SUBHEADING_TRANSITION_MS,
}: RotatingSubheadingProps) {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [hasCycled, setHasCycled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let visibleTimer: ReturnType<typeof setTimeout> | undefined;
    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    const scheduleCycle = () => {
      visibleTimer = setTimeout(() => {
        setIsExiting(true);
        exitTimer = setTimeout(() => {
          setIsExiting(false);
          setHasCycled(true);
          setIndex((current) => (current + 1) % ROTATING_SUBHEADING_PHRASES.length);
          scheduleCycle();
        }, transitionMs);
      }, intervalMs);
    };

    scheduleCycle();

    return () => {
      if (visibleTimer) clearTimeout(visibleTimer);
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, [reducedMotion, intervalMs, transitionMs]);

  const phrase = ROTATING_SUBHEADING_PHRASES[index];
  const animationClass = isExiting
    ? "rotating-subheading-exit"
    : hasCycled
      ? "rotating-subheading-enter"
      : "";

  return (
    <div
      className={cn(
        "relative mx-auto flex min-h-[1.5rem] w-full max-w-sm items-center justify-center overflow-hidden sm:min-h-[1.75rem]",
        className
      )}
    >
      <p className={cn("w-full text-center leading-snug", animationClass)}>
        {phrase}
      </p>
    </div>
  );
}
