"use client";

import { useCallback, useEffect, useId, useState } from "react";
import type { RankingsPointsHelpContext } from "@/app/actions/rankings";
import {
  RANKINGS_POINTS_HELP_BODY,
  RANKINGS_POINTS_HELP_SUPER_PICK_PREFIX,
  RANKINGS_POINTS_HELP_SUPER_PICK_SUFFIX,
  RANKINGS_POINTS_HELP_TITLE,
  RANKINGS_POINTS_HELP_TRIGGER,
  SUPER_PICK_INFO_TEXT,
} from "@/lib/brand/rankingsPointsHelp";
import { cn } from "@/lib/utils";

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn("h-4 w-4", className)}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7h.01" strokeLinecap="round" />
    </svg>
  );
}

function SuperPickInfoIcon() {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#d4a853]/40 text-[#d4a853]/80 hover:border-[#d4a853]/70 hover:text-[#f5e6b8]"
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

  const { motivation } = helpContext;

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

        <div className="space-y-3 px-4 py-4">
          {RANKINGS_POINTS_HELP_BODY.map((line) => (
            <p key={line} className="text-sm leading-relaxed text-zinc-300">
              {line}
            </p>
          ))}

          <p className="text-sm leading-relaxed text-zinc-300">
            {RANKINGS_POINTS_HELP_SUPER_PICK_PREFIX}{" "}
            <span className="inline-flex items-center gap-1">
              <span className="font-black uppercase tracking-[0.08em] text-[#f0c14b]">
                Super Pick
              </span>
              <span className="hidden sm:inline-flex">
                <SuperPickInfoIcon />
              </span>
            </span>{" "}
            {RANKINGS_POINTS_HELP_SUPER_PICK_SUFFIX}
          </p>
          <p className="text-[10px] leading-relaxed text-zinc-500 sm:hidden">
            {SUPER_PICK_INFO_TEXT}
          </p>

          <p
            className={cn(
              "rounded-lg border px-3 py-2.5 text-xs leading-relaxed",
              motivation.variant === "world_number_one"
                ? "border-[#d4a853]/35 bg-[#d4a853]/10 text-[#f5e6b8]"
                : motivation.variant === "neutral"
                  ? "border-[#2a2a2a] bg-[#0a0a0a] text-zinc-400"
                  : "border-red-500/25 bg-red-500/5 text-zinc-300"
            )}
          >
            {motivation.line}
          </p>
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
