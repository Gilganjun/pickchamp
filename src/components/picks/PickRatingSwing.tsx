"use client";

import { useState } from "react";
import {
  formatRatingPoints,
  formatRatingSwingShort,
  getPotentialWinCeiling,
  getRatingScenarios,
  type PickPotential,
  type RatingScenario,
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

function RatingSwingSummary({
  potential,
  method,
  round,
}: {
  potential: PickPotential | null;
  method: PredictedMethod | null;
  round: number | null;
}) {
  if (!potential) {
    return null;
  }

  const winCeiling = getPotentialWinCeiling(potential);
  const bonusFromExtras = winCeiling - potential.correctBase;
  const hint = winCeilingHint(potential, method, round);

  return (
    <div className="mt-3 border-t border-[#2a2a2a] pt-3">
      <div
        className="grid grid-cols-2 gap-2"
        aria-label={`If correct ${formatRatingPoints(winCeiling)}, if wrong ${formatRatingPoints(potential.wrongRisk)}`}
      >
        <div className="rounded-xl border-2 border-amber-500/40 bg-gradient-to-b from-amber-500/15 to-[#111111] px-2 py-2.5 text-center sm:px-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-amber-300/90">
            If correct
          </p>
          <p className="mt-0.5 text-xl font-black tabular-nums leading-none text-amber-200 sm:text-2xl">
            {formatRatingPoints(winCeiling)}
          </p>
          <p className="mt-1 text-[9px] leading-tight text-zinc-500">{hint}</p>
        </div>
        <div className="rounded-xl border-2 border-red-500/35 bg-gradient-to-b from-red-500/10 to-[#111111] px-2 py-2.5 text-center sm:px-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-red-300/90">
            If wrong
          </p>
          <p className="mt-0.5 text-xl font-black tabular-nums leading-none text-red-300 sm:text-2xl">
            {formatRatingPoints(potential.wrongRisk)}
          </p>
          <p className="mt-1 text-[9px] leading-tight text-zinc-500">
            Wrong fighter wins
          </p>
        </div>
      </div>

      <p className="mt-2.5 text-center text-[11px] leading-relaxed text-zinc-400">
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
  method: PredictedMethod | null,
  round: number | null
): string {
  if (method && round) return "perfect";
  if (method) return "winner-method-right";
  return "winner-only";
}

function PointsGuideChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "h-4 w-4 shrink-0 text-amber-300/90 transition-transform duration-200",
        expanded ? "rotate-180" : "rotate-0"
      )}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PointsGuideHeading({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={
        expanded
          ? "Hide all point outcomes"
          : "Show all point outcomes"
      }
      className="group mx-auto flex w-full max-w-sm flex-col items-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-2.5 text-center transition-colors hover:border-amber-500/45 hover:bg-amber-500/10"
    >
      <span className="flex items-center justify-center gap-2">
        <span className="text-sm font-black uppercase tracking-[0.14em] text-amber-300 sm:text-base">
          How many points can I win?
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/40 bg-[#1a1a1a]">
          <PointsGuideChevron expanded={expanded} />
        </span>
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-400/80 group-hover:text-amber-300">
        {expanded ? "Hide all outcomes" : "Tap to see all outcomes"}
      </span>
    </button>
  );
}

function ScenarioRow({
  row,
  isActive,
}: {
  row: RatingScenario;
  isActive: boolean;
}) {
  const isLoss = row.kind === "loss";
  const isCeiling = row.kind === "ceiling";

  return (
    <li
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
          Matches your current pick
        </p>
      ) : null}
    </li>
  );
}

function CurrentPickPointsSummary({ row }: { row: RatingScenario }) {
  const isLoss = row.kind === "loss";

  return (
    <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-3 text-center">
      <p
        className={cn(
          "text-2xl font-black tabular-nums leading-none sm:text-3xl",
          isLoss ? "text-red-300" : "text-amber-200"
        )}
      >
        {formatRatingPoints(row.points)}
      </p>
      <p className="mt-2 text-xs font-semibold leading-snug text-white">
        {row.headline}
      </p>
      <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
        {row.detail}
      </p>
    </div>
  );
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
  const [expanded, setExpanded] = useState(false);

  if (!potential) {
    return (
      <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3">
        <p className="text-center text-sm font-black uppercase tracking-[0.14em] text-amber-300/80">
          How many points can I win?
        </p>
        <p className="mt-2 text-center text-xs leading-relaxed text-zinc-500">
          Select a fighter (or draw) above to see how many rating points you
          would gain or lose.
        </p>
      </div>
    );
  }

  const scenarios = getRatingScenarios(potential);
  const activeId = activeScenarioId(method, round);
  const activeScenario =
    scenarios.find((row) => row.id === activeId) ?? scenarios[1];
  const targetPoints = getPotentialWinCeiling(potential);

  return (
    <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] px-4 py-3">
      <PointsGuideHeading
        expanded={expanded}
        onToggle={() => setExpanded((open) => !open)}
      />

      {!expanded ? (
        <CurrentPickPointsSummary row={activeScenario} />
      ) : (
        <>
          <p className="mt-2 text-center text-[11px] leading-relaxed text-zinc-400">
            {potential.tierLabel} pick — each row is a separate outcome. Only
            one applies after the fight.
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
            {scenarios.map((row) => (
              <ScenarioRow
                key={row.id}
                row={row}
                isActive={row.id === activeId}
              />
            ))}
          </ul>

          <p className="mt-3 text-[10px] leading-relaxed text-zinc-600">
            Wrong fighter = always {formatRatingPoints(potential.wrongRisk)}.
            Method and round only count if your main pick (winner) is correct.
          </p>
        </>
      )}
    </div>
  );
}

function formatMethodRoundHint(
  method: PredictedMethod | null,
  round: number | null
): string {
  if (!method) {
    return "No method selected — choose below (optional)";
  }
  const parts = [`Method: ${methodLabel(method)}`];
  if (round != null) {
    parts.push(`Round ${round}`);
  }
  return parts.join(" · ");
}

function PickNameSwipe({ name }: { name: string }) {
  return (
    <p className="mt-2 overflow-hidden text-xl font-black leading-tight tracking-tight text-white sm:text-2xl">
      <span className="pick-name-swipe">{name}</span>
    </p>
  );
}

function PickSectionHeader({
  label,
  labelClassName,
  tierLabel,
}: {
  label: string;
  labelClassName: string;
  tierLabel?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <p
        className={cn(
          "text-[10px] font-bold uppercase tracking-wider",
          labelClassName
        )}
      >
        {label}
      </p>
      {tierLabel ? (
        <p className="text-[10px] font-semibold text-zinc-400">{tierLabel}</p>
      ) : null}
    </div>
  );
}

export type PickSaveStatus =
  | "idle"
  | "saving"
  | "saved"
  | "updated"
  | "error"
  | "guest";

function PickAutoSaveStatus({
  status,
  error,
  onRetry,
}: {
  status: PickSaveStatus;
  error: string | null;
  onRetry?: () => void;
}) {
  if (status === "idle" && !error) return null;

  if (status === "guest") {
    return (
      <div className="mt-4 text-center">
        <p className="text-xs font-semibold text-amber-400">
          Draft pick — sign in to save
        </p>
        <p className="mt-1 text-[11px] text-zinc-500">
          Your pick is stored on this device until you log in.
        </p>
      </div>
    );
  }

  if (status === "saving") {
    return (
      <p className="mt-4 text-center text-xs font-semibold text-zinc-400">
        Saving…
      </p>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-4 text-center">
        <p className="text-xs font-semibold text-red-400">Couldn&apos;t save</p>
        {error ? (
          <p className="mt-1 text-[11px] text-red-300/90">{error}</p>
        ) : null}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-[11px] font-semibold text-red-300 underline underline-offset-2 hover:text-red-200"
          >
            Tap to retry
          </button>
        ) : null}
      </div>
    );
  }

  const label = status === "updated" ? "Pick updated ✓" : "Saved ✓";

  return (
    <div className="mt-4 text-center">
      <p className="text-xs font-semibold text-green-400">{label}</p>
      <p className="mt-1 text-[11px] text-zinc-500">
        You can change this pick until lock time.
      </p>
    </div>
  );
}

export function PickLockSection({
  hasSaved,
  savedLine,
  pickName,
  method,
  round,
  potential,
  showDraft,
  saveStatus,
  saveError,
  onRetrySave,
}: {
  hasSaved: boolean;
  savedLine: string | null;
  pickName: string | null;
  method: PredictedMethod | null;
  round: number | null;
  potential: PickPotential | null;
  showDraft: boolean;
  saveStatus: PickSaveStatus;
  saveError: string | null;
  onRetrySave?: () => void;
}) {
  const methodHint = formatMethodRoundHint(method, round);
  const hasActivePick =
    hasSaved || (showDraft && pickName) || saveStatus === "saving";

  if (!hasActivePick) {
    return null;
  }

  return (
    <div className="px-4 py-4">
      {pickName ? (
        <>
          <PickSectionHeader
            label={hasSaved ? "Your current pick" : "Your pick"}
            labelClassName={hasSaved ? "text-green-500" : "text-zinc-500"}
            tierLabel={potential?.tierLabel}
          />
          <PickNameSwipe name={pickName} />
          <p className="mt-2 text-[11px] text-zinc-400">{methodHint}</p>
        </>
      ) : hasSaved && savedLine ? (
        <>
          <PickSectionHeader
            label="Your current pick"
            labelClassName="text-green-500"
            tierLabel={potential?.tierLabel}
          />
          <p className="mt-1 text-sm font-bold leading-snug text-white">
            {savedLine}
          </p>
          <p className="mt-2 text-[11px] text-zinc-400">{methodHint}</p>
        </>
      ) : null}

      <RatingSwingSummary
        potential={potential}
        method={method}
        round={round}
      />

      <PickAutoSaveStatus
        status={saveStatus}
        error={saveError}
        onRetry={onRetrySave}
      />
    </div>
  );
}
