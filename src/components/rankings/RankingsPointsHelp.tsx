"use client";

import { useCallback, useEffect, useId, useState } from "react";
import {
  getRankingsPointsHelpBonusesLine,
  getRankingsTierHelpRows,
  RANKINGS_POINTS_HELP_SUMMARY,
  RANKINGS_POINTS_HELP_TITLE,
  RANKINGS_POINTS_HELP_TRIGGER,
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

function RankingsPointsHelpPanel({
  open,
  onClose,
  titleId,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
}) {
  const tierRows = getRankingsTierHelpRows();
  const bonusesLine = getRankingsPointsHelpBonusesLine();

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
      <div className="relative flex max-h-[min(88vh,640px)] w-full max-w-md flex-col rounded-t-2xl border border-[#2a2a2a] bg-[#111111] shadow-xl sm:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#2a2a2a] px-4 py-3.5">
          <div>
            <h2
              id={titleId}
              className="font-[family-name:var(--font-teko)] text-xl font-bold uppercase tracking-wide text-white"
            >
              {RANKINGS_POINTS_HELP_TITLE}
            </h2>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Quick reference — full detail on each fight when you pick.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-[#2a2a2a] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-3.5">
          <ul className="space-y-2.5 text-xs leading-relaxed text-zinc-300">
            {RANKINGS_POINTS_HELP_SUMMARY.map((line) => (
              <li key={line} className="flex gap-2">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#d4a853]"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 overflow-hidden rounded-xl border border-[#2a2a2a]">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#0a0a0a] text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                  <th scope="col" className="px-3 py-2 font-bold">
                    Pick type
                  </th>
                  <th scope="col" className="px-2 py-2 text-right font-bold">
                    Win
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-bold">
                    Lose
                  </th>
                </tr>
              </thead>
              <tbody>
                {tierRows.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-[#2a2a2a]/80 last:border-0"
                  >
                    <td className="px-3 py-2 text-zinc-200">{row.label}</td>
                    <td className="px-2 py-2 text-right font-semibold tabular-nums text-amber-200/90">
                      {row.correct}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold tabular-nums text-red-300/90">
                      {row.wrong}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-zinc-500">
            {bonusesLine}
          </p>
        </div>
      </div>
    </div>
  );
}

export function RankingsPointsHelp() {
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
      />
    </>
  );
}
