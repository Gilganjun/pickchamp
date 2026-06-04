"use client";

import {
  formatRatingPoints,
  formatRatingSwingShort,
  getPotentialWinCeiling,
  getRatingScenarios,
  type PickPotential,
} from "@/lib/rating/getPickPotential";
import { methodLabel } from "@/lib/profile/display";
import type { PredictedMethod } from "@/types";
import { cn } from "@/lib/utils";

export function PickFistLine({ label }: { label: string }) {
  return (
    <p className="mt-2 text-center text-[10px] text-zinc-600">
      <span className="font-semibold text-zinc-500">PickFist Line:</span> {label}
    </p>
  );
}

export function RatingSwingInline({
  potential,
  showTier = true,
  compact = false,
  className,
}: {
  potential: PickPotential;
  showTier?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "block font-medium normal-case leading-tight",
        compact ? "text-[9px]" : "text-[10px]",
        className
      )}
    >
      {showTier ? (
        <span className="text-zinc-300">{potential.tierLabel} · </span>
      ) : null}
      <span className="text-amber-200/90">
        Correct {formatRatingPoints(potential.correctBase)}
      </span>
      <span className="text-zinc-500"> · </span>
      <span className="text-red-300/90">
        Wrong {formatRatingPoints(potential.wrongRisk)}
      </span>
    </span>
  );
}

function winCeilingHint(
  potential: PickPotential,
  method: PredictedMethod | null,
  round: number | null
): string {
  if (method && round && potential.perfectBonus > 0) {
    return "Perfect pick — all details correct";
  }
  if (method || round) {
    return "Includes method & round bonus";
  }
  return "Winner only — add method & round below for more";
}

/** Standalone rating swing for the selected fighter + optional extras. */
export function PickRatingSwingCard({
  potential,
  method,
  round,
}: {
  potential: PickPotential | null;
  method: PredictedMethod | null;
  round: number | null;
}) {
  if (!potential) {
    return (
      <div className="mt-4 rounded-xl border border-[#2a2a2a] bg-[#181818] px-4 py-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Rating swing
        </p>
        <p className="mt-2 text-center text-xs font-semibold text-zinc-500">
          Select a fighter above to see how many points you could win or lose
        </p>
      </div>
    );
  }

  const winCeiling = getPotentialWinCeiling(potential);
  const bonusFromExtras = winCeiling - potential.correctBase;
  const hint = winCeilingHint(potential, method, round);

  return (
    <div className="mt-4 rounded-xl border border-[#2a2a2a] bg-[#181818] px-4 py-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          Rating swing
        </p>
        <p className="text-[10px] font-semibold text-zinc-400">
          {potential.tierLabel}
        </p>
      </div>

      <div
        className="mt-3 grid grid-cols-2 gap-2"
        aria-label={`If correct ${formatRatingPoints(winCeiling)}, if wrong ${formatRatingPoints(potential.wrongRisk)}`}
      >
        <div className="rounded-xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/15 to-[#111111] px-2 py-3 text-center sm:px-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-amber-300/90">
            If correct
          </p>
          <p className="mt-0.5 text-2xl font-black tabular-nums leading-none text-amber-200 sm:text-3xl">
            {formatRatingPoints(winCeiling)}
          </p>
          <p className="mt-1 text-[9px] leading-tight text-zinc-500">{hint}</p>
        </div>
        <div className="rounded-xl border-2 border-red-500/35 bg-gradient-to-b from-red-500/10 to-[#111111] px-2 py-3 text-center sm:px-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-red-300/90">
            If wrong
          </p>
          <p className="mt-0.5 text-2xl font-black tabular-nums leading-none text-red-300 sm:text-3xl">
            {formatRatingPoints(potential.wrongRisk)}
          </p>
          <p className="mt-1 text-[9px] leading-tight text-zinc-500">
            Wrong fighter wins
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-400">
        <span className="font-semibold text-zinc-300">Winner</span>{" "}
        {formatRatingPoints(potential.correctBase)}
        {bonusFromExtras > 0 ? (
          <>
            {" "}
            <span className="text-zinc-600">+</span>{" "}
            <span className="font-semibold text-amber-200/90">bonus</span>{" "}
            {formatRatingPoints(bonusFromExtras)}
          </>
        ) : (
          <>
            {" "}
            <span className="text-zinc-600">·</span> optional method &amp; round
            below
          </>
        )}
      </p>
    </div>
  );
}

export function RatingSwingButtonFooter({
  potential,
}: {
  potential: PickPotential;
}) {
  return (
    <>
      <span className="hidden min-[360px]:inline">
        <RatingSwingInline potential={potential} showTier={false} />
      </span>
      <span className="min-[360px]:hidden text-[9px] font-medium normal-case">
        <span className="text-amber-200/90">
          {formatRatingSwingShort(
            potential.correctBase,
            potential.wrongRisk
          )}
        </span>
      </span>
    </>
  );
}

function activeScenarioId(
  potential: PickPotential,
  method: PredictedMethod | null,
  round: number | null
): string | null {
  if (method && round) return "perfect";
  if (method) return "winner-method-right";
  return "winner-only";
}

export function RatingPointsGuide({
  potential,
  method,
  round,
}: {
  potential: PickPotential | null;
  method: PredictedMethod | null;
  round: number | null;
}) {
  if (!potential) {
    return (
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          How many points can I earn?
        </p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Select a fighter (or draw) above to see every outcome and how many
          rating points you would gain or lose.
        </p>
      </div>
    );
  }

  const scenarios = getRatingScenarios(potential);
  const activeId = activeScenarioId(potential, method, round);
  const targetPoints = getPotentialWinCeiling(potential);

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        How many points can I earn?
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
        {potential.tierLabel} pick — each row is a separate outcome. Only one
        applies after the fight.
      </p>

      {method || round ? (
        <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-300">
            Your pick right now
          </p>
          <p className="mt-0.5 text-xs text-zinc-200">
            {method
              ? `Method: ${methodLabel(method)}`
              : "No method selected yet"}
            {round ? ` · Round ${round}` : ""}
          </p>
          <p className="mt-1 text-sm font-bold text-amber-200">
            Up to {formatRatingPoints(targetPoints)} if it all lands
          </p>
        </div>
      ) : null}

      <ul className="mt-3 space-y-2">
        {scenarios.map((row) => {
          const isActive = row.id === activeId;
          const isLoss = row.kind === "loss";
          const isCeiling = row.kind === "ceiling";

          return (
            <li
              key={row.id}
              className={cn(
                "rounded-lg border px-3 py-2.5",
                isActive
                  ? "border-amber-500/50 bg-amber-500/10"
                  : "border-[#2a2a2a] bg-[#1a1a1a]",
                isCeiling && !isActive && "border-zinc-600/40"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-xs font-semibold leading-snug",
                      isLoss ? "text-zinc-300" : "text-white"
                    )}
                  >
                    {row.headline}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-relaxed text-zinc-500">
                    {row.detail}
                  </p>
                </div>
                <p
                  className={cn(
                    "shrink-0 text-sm font-black tabular-nums",
                    isLoss
                      ? "text-red-300"
                      : isCeiling
                        ? "text-amber-200"
                        : "text-amber-200/90"
                  )}
                >
                  {formatRatingPoints(row.points)}
                </p>
              </div>
              {isActive ? (
                <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wide text-amber-400">
                  Matches your current extras
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-[10px] leading-relaxed text-zinc-600">
        Wrong fighter = always {formatRatingPoints(potential.wrongRisk)}. Method
        and round only count if your main pick (winner) is correct.
      </p>
    </div>
  );
}

export function CurrentPickSummary({
  hasSaved,
  dirty,
  savedLine,
  draftLine,
  showDraft,
}: {
  hasSaved: boolean;
  dirty: boolean;
  savedLine: string | null;
  draftLine: string | null;
  showDraft: boolean;
}) {
  return (
    <div className="border-b border-[#2a2a2a] px-4 py-3">
      {hasSaved ? (
        <>
          <p className="text-[10px] font-bold uppercase tracking-wider text-green-500">
            Your current pick
          </p>
          <p className="mt-1 text-sm font-bold leading-snug text-white">
            {savedLine}
          </p>
          {dirty && showDraft ? (
            <p className="mt-2 text-[11px] text-amber-400">
              <span className="font-semibold uppercase tracking-wide">
                Unsaved change →{" "}
              </span>
              {draftLine}
            </p>
          ) : null}
        </>
      ) : showDraft ? (
        <>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Ready to lock
          </p>
          <p className="mt-1 text-sm font-bold leading-snug text-white">
            {draftLine}
          </p>
        </>
      ) : (
        <>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Your current pick
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            None yet — select a fighter above
          </p>
        </>
      )}
    </div>
  );
}

export function UpdatePickButton({
  pending,
  disabled,
  hasSaved,
  dirty,
  showDraft,
  draftLine,
  onSubmit,
}: {
  pending: boolean;
  disabled: boolean;
  hasSaved: boolean;
  dirty: boolean;
  showDraft: boolean;
  draftLine: string | null;
  onSubmit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={disabled}
      className="flex w-full flex-col items-center gap-0.5 border-b border-[#2a2a2a] bg-white px-4 py-3.5 text-black transition-opacity hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="text-sm font-bold uppercase tracking-wide">
        {pending
          ? "Saving…"
          : hasSaved
            ? dirty
              ? "Save updated pick"
              : "Update my pick"
            : "Lock my pick"}
      </span>
      {showDraft && !pending ? (
        <span className="text-[10px] font-medium normal-case text-zinc-600">
          {dirty ? "Confirm change: " : "Will lock: "}
          {draftLine}
        </span>
      ) : hasSaved && !dirty && !pending ? (
        <span className="text-[10px] font-medium normal-case text-zinc-600">
          Tap a fighter above to change, then save
        </span>
      ) : null}
    </button>
  );
}
