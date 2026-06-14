"use client";

import { useCallback, useEffect, useId, useState } from "react";
import type { ReactNode } from "react";
import type { RankingsPointsHelpContext } from "@/app/actions/rankings";
import {
  DEFAULT_RATING,
  SUPER_PICK_POINTS,
} from "@/lib/rating/constants";
import { formatRatingPoints } from "@/lib/rating/getPickPotential";
import type { SuperPickMotivation } from "@/lib/brand/rankingsPointsHelp";
import {
  RANKINGS_POINTS_HELP_TITLE,
  RANKINGS_POINTS_HELP_TRIGGER,
  SUPER_PICK_INFO_TEXT,
  SUPER_PICK_MOTIVATION_NEUTRAL,
} from "@/lib/brand/rankingsPointsHelp";
import { cn } from "@/lib/utils";

/** Shared panel block — consistent size and padding for every info section. */
function HelpBlock({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2.5 text-center text-sm leading-relaxed text-zinc-300",
        className
      )}
    >
      {children}
    </div>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn("h-3.5 w-3.5", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" strokeLinecap="round" />
    </svg>
  );
}

function SuperPickInfoIcon() {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#d4a853]/35 text-[#d4a853]/70 hover:border-[#d4a853]/55 hover:text-[#f5e6b8]"
        aria-label={SUPER_PICK_INFO_TEXT}
      >
        <InfoIcon className="h-2.5 w-2.5" />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-52 -translate-x-1/2 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-2.5 py-2 text-[10px] leading-relaxed text-zinc-400 shadow-lg group-hover:block group-focus-within:block sm:w-60"
      >
        {SUPER_PICK_INFO_TEXT}
      </span>
    </span>
  );
}

function MotivationBanner({ motivation }: { motivation: SuperPickMotivation }) {
  if (motivation.variant === "world_number_one") {
    return (
      <HelpBlock className="border-[#d4a853]/30 bg-[#d4a853]/8">
        You&apos;re currently{" "}
        <span className="font-[family-name:var(--font-teko)] font-bold uppercase tracking-wide text-[#f5e6b8]">
          World #1
        </span>
        .
      </HelpBlock>
    );
  }

  if (motivation.variant === "neutral") {
    return (
      <HelpBlock className="text-zinc-400">
        {motivation.line || SUPER_PICK_MOTIVATION_NEUTRAL}
      </HelpBlock>
    );
  }

  const count = motivation.superPickCount ?? 0;
  const pickLabel = count === 1 ? "Super Pick" : "Super Picks";
  const enterTarget =
    motivation.variant === "to_number_one" ? "World #1" : "World Top 10";

  return (
    <HelpBlock className="border-red-500/25 bg-red-500/5">
      <span className="text-xs text-zinc-500">At today&apos;s scores</span>
      <p className="mt-1">
        Pick{" "}
        <span className="font-[family-name:var(--font-teko)] font-bold tabular-nums text-white">
          {count}
        </span>{" "}
        <span className="font-semibold uppercase tracking-wide text-[#f0c14b]">
          {pickLabel}
        </span>{" "}
        to enter the{" "}
        <span className="font-[family-name:var(--font-teko)] font-bold uppercase tracking-wide text-[#d4a853]">
          {enterTarget}
        </span>
        .
      </p>
    </HelpBlock>
  );
}

function ScoringHelpBody({ motivation }: { motivation: SuperPickMotivation }) {
  return (
    <div className="space-y-2.5">
      <HelpBlock>
        <span className="font-semibold italic text-white">Everyone</span> starts
        with{" "}
        <span className="font-[family-name:var(--font-teko)] font-bold tabular-nums text-[#d4a853]">
          {DEFAULT_RATING.toLocaleString()}
        </span>{" "}
        points.
      </HelpBlock>

      <div className="grid grid-cols-2 gap-2.5">
        <HelpBlock className="border-emerald-500/25 bg-emerald-500/5">
          Pick{" "}
          <span className="font-semibold uppercase text-emerald-400">right</span>
          ,{" "}
          <span className="font-[family-name:var(--font-teko)] font-bold uppercase text-emerald-200">
            climb higher
          </span>
          .
        </HelpBlock>
        <HelpBlock className="border-red-500/25 bg-red-500/5">
          Pick{" "}
          <span className="font-semibold uppercase text-red-400">wrong</span>,{" "}
          <span className="font-[family-name:var(--font-teko)] font-bold uppercase text-red-300">
            fall lower
          </span>
          .
        </HelpBlock>
      </div>

      <HelpBlock>
        Pick the{" "}
        <span className="font-semibold text-emerald-300">right winner</span>,{" "}
        <span className="font-semibold text-white">round</span> and{" "}
        <span className="font-semibold text-white">method</span> to win{" "}
        <span className="font-semibold uppercase tracking-wide text-amber-300">
          MORE
        </span>{" "}
        points.
      </HelpBlock>

      <HelpBlock className="border-[#d4a853]/25 bg-[#d4a853]/5">
        A perfect{" "}
        <span className="italic text-zinc-200">heavy-underdog</span> prediction
        is a{" "}
        <span className="inline-flex items-center gap-0.5">
          <span className="font-semibold uppercase tracking-wide text-[#f0c14b]">
            Super Pick
          </span>
          <SuperPickInfoIcon />
        </span>{" "}
        worth{" "}
        <span className="font-[family-name:var(--font-teko)] font-bold tabular-nums text-[#f0c14b]">
          {formatRatingPoints(SUPER_PICK_POINTS)}
        </span>{" "}
        points.
      </HelpBlock>

      <MotivationBanner motivation={motivation} />

      <p className="hidden text-center text-xs leading-relaxed text-zinc-600 sm:block">
        {SUPER_PICK_INFO_TEXT}
      </p>
    </div>
  );
}

function RankingsPointsHelpPanel({
  open,
  onClose,
  titleId,
  helpContext,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  helpContext: RankingsPointsHelpContext;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close scoring help"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-t-2xl border border-[#2a2a2a] bg-[#111111] shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[#2a2a2a] px-4 py-3.5">
          <h2
            id={titleId}
            className="font-[family-name:var(--font-teko)] text-xl font-bold uppercase tracking-wide text-white"
          >
            {RANKINGS_POINTS_HELP_TITLE}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-[#2a2a2a] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="px-4 py-4">
          <ScoringHelpBody motivation={helpContext.motivation} />
        </div>
      </div>
    </div>
  );
}

interface RankingsPointsHelpProps {
  helpContext: RankingsPointsHelpContext;
}

export function RankingsPointsHelp({ helpContext }: RankingsPointsHelpProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto mt-2 flex min-h-[36px] items-center justify-center gap-1.5 rounded-full border border-[#d4a853]/30 bg-[#d4a853]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#d4a853]/90 transition-colors hover:border-[#d4a853]/50 hover:bg-[#d4a853]/10 hover:text-[#f5e6b8]"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <InfoIcon className="text-[#d4a853]" />
        {RANKINGS_POINTS_HELP_TRIGGER}
      </button>

      <RankingsPointsHelpPanel
        open={open}
        onClose={close}
        titleId={titleId}
        helpContext={helpContext}
      />
    </>
  );
}
