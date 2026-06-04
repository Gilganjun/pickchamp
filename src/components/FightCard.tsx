"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { PickImpactOverlay } from "@/components/picks/PickImpactOverlay";
import {
  createPickImpactConfig,
  PICK_IMPACT_DURATION_MS,
  type PickImpactConfig,
  type PickImpactSide,
} from "@/components/picks/pickImpact";
import { playPickImpactSound } from "@/lib/audio/playPickImpactSound";
import { savePrediction } from "@/lib/data/fights";
import { MOCK_USER_ID } from "@/data/mock";
import { formatPickLine } from "@/lib/profile/display";
import {
  formatEventDateTime,
  formatPickLockDateTime,
} from "@/lib/datetime";
import {
  cn,
  getFighterSurname,
  getLockCountdown,
  isFightLocked,
} from "@/lib/utils";
import type {
  FightWithRelations,
  PredictedMethod,
  PredictedOutcome,
} from "@/types";
import { AdvancedPredictionPanel } from "./AdvancedPredictionPanel";

interface FightCardProps {
  fight: FightWithRelations;
  onSaved?: () => void;
  /** Picks page only — glove impact on fighter pick buttons */
  enablePickImpact?: boolean;
}

function pickIsDirty(
  existing: FightWithRelations["userPrediction"],
  outcome: PredictedOutcome | null,
  method: PredictedMethod | null,
  round: number | null
): boolean {
  if (!existing || !outcome) return false;
  return (
    existing.predicted_outcome !== outcome ||
    existing.predicted_method !== method ||
    existing.predicted_round !== round
  );
}

function PickChoiceButton({
  selected,
  variant,
  className,
  impactClass,
  children,
  onClick,
}: {
  selected: boolean;
  variant: "red" | "blue" | "neutral";
  className: string;
  impactClass?: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        className,
        selected && `pick-choice-selected pick-choice-selected--${variant}`,
        impactClass
      )}
    >
      {children}
    </button>
  );
}

function PickSubmitPanel({
  fight,
  existing,
  outcome,
  method,
  round,
  pending,
  onSubmit,
}: {
  fight: FightWithRelations;
  existing: FightWithRelations["userPrediction"];
  outcome: PredictedOutcome | null;
  method: PredictedMethod | null;
  round: number | null;
  pending: boolean;
  onSubmit: () => void;
}) {
  const savedLine = existing
    ? formatPickLine(
        fight,
        existing.predicted_outcome,
        existing.predicted_method,
        existing.predicted_round
      )
    : null;
  const draftLine = outcome
    ? formatPickLine(fight, outcome, method, round)
    : null;
  const dirty = pickIsDirty(existing, outcome, method, round);
  const hasSaved = Boolean(existing);
  const showDraft = draftLine && (!hasSaved || dirty);

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#181818]">
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

      <button
        type="button"
        onClick={onSubmit}
        disabled={pending || !outcome}
        className="flex w-full flex-col items-center gap-0.5 bg-white px-4 py-3 text-black transition-opacity hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
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
    </div>
  );
}

export function FightCard({
  fight,
  onSaved,
  enablePickImpact = false,
}: FightCardProps) {
  const locked = isFightLocked(fight);
  const settled = fight.status === "settled";
  const existing = fight.userPrediction;

  const [outcome, setOutcome] = useState<PredictedOutcome | null>(
    existing?.predicted_outcome ?? null
  );
  const [method, setMethod] = useState<PredictedMethod | null>(
    existing?.predicted_method ?? null
  );
  const [round, setRound] = useState<number | null>(
    existing?.predicted_round ?? null
  );
  const [advancedOpen, setAdvancedOpen] = useState(
    Boolean(existing?.predicted_method || existing?.predicted_round)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [impact, setImpact] = useState<PickImpactConfig | null>(null);
  const impactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (impactTimeoutRef.current) {
        clearTimeout(impactTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setOutcome(existing?.predicted_outcome ?? null);
    setMethod(existing?.predicted_method ?? null);
    setRound(existing?.predicted_round ?? null);
  }, [
    existing?.predicted_outcome,
    existing?.predicted_method,
    existing?.predicted_round,
    fight.id,
  ]);

  const firePickImpact = (side: PickImpactSide) => {
    if (!enablePickImpact) return;
    if (impactTimeoutRef.current) {
      clearTimeout(impactTimeoutRef.current);
    }
    const next = createPickImpactConfig(side);
    setImpact(next);
    playPickImpactSound();
    impactTimeoutRef.current = setTimeout(() => {
      setImpact(null);
      impactTimeoutRef.current = null;
    }, PICK_IMPACT_DURATION_MS);
  };

  const selectOutcome = (next: PredictedOutcome, side?: PickImpactSide) => {
    if (side) firePickImpact(side);
    setOutcome(next);
  };

  const sportColor = fight.sport === "boxing" ? "bg-red-600" : "bg-purple-600";
  const sportBorder =
    fight.sport === "boxing" ? "border-red-600/40" : "border-purple-600/40";

  const handleSubmit = () => {
    if (!outcome) {
      setError("Select a fighter (or draw) first.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await savePrediction({
        userId: MOCK_USER_ID,
        fightId: fight.id,
        predictedOutcome: outcome,
        predictedMethod: method,
        predictedRound: round,
        scheduledRounds: fight.scheduled_rounds,
        sport: fight.sport,
        isLocked: locked,
      });
      if (!res.ok) {
        setError(res.error ?? "Failed to save pick");
        return;
      }
      onSaved?.();
    });
  };

  return (
    <article
      className={cn(
        "overflow-visible rounded-2xl border bg-[#111111] p-4 shadow-sm",
        sportBorder
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white",
            sportColor
          )}
        >
          {fight.sport}
        </span>
        <div className="text-right">
          <p className="text-[10px] font-medium text-zinc-400">
            {formatEventDateTime(fight.event)}
          </p>
          <p className="text-[10px] text-zinc-500 truncate max-w-[140px]">
            {fight.event.name}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="text-center">
          <p className="text-sm font-black uppercase leading-tight tracking-tight">
            {fight.fighter_a_name}
          </p>
          <p className="mt-0.5 text-[10px] text-zinc-500">
            {fight.scheduled_rounds} rds
            {fight.weight_class ? ` · ${fight.weight_class}` : ""}
          </p>
        </div>
        <span className="rounded-full border border-[#2a2a2a] bg-[#181818] px-2 py-1 text-[10px] font-bold text-zinc-400">
          VS
        </span>
        <div className="text-center">
          <p className="text-sm font-black uppercase leading-tight tracking-tight">
            {fight.fighter_b_name}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-400">
        🕐 {getLockCountdown(fight.lock_time)}
        <span className="block text-[10px] text-zinc-500">
          {formatPickLockDateTime(fight.lock_time, fight.event)}
        </span>
      </p>

      {settled && existing ? (
        <div className="mt-4 rounded-xl bg-[#181818] p-3 text-center">
          <p
            className={cn(
              "text-sm font-bold",
              existing.main_correct ? "text-green-500" : "text-red-500"
            )}
          >
            {existing.main_correct ? "Correct" : "Incorrect"}
          </p>
          {existing.rating_change != null && (
            <p className="mt-1 text-xs text-zinc-400">
              Rating change:{" "}
              <span
                className={
                  existing.rating_change >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {existing.rating_change >= 0 ? "+" : ""}
                {existing.rating_change}
              </span>
            </p>
          )}
        </div>
      ) : locked ? (
        <div className="mt-4 rounded-xl border border-[#2a2a2a] bg-[#181818] p-3 text-center">
          <p className="text-sm font-semibold text-zinc-300">Pick Locked</p>
          {existing && (
            <p className="mt-1 text-xs font-semibold text-zinc-300">
              Your pick:{" "}
              {formatPickLine(
                fight,
                existing.predicted_outcome,
                existing.predicted_method,
                existing.predicted_round
              )}
            </p>
          )}
        </div>
      ) : (
        <>
          <div
            className={cn(
              "mt-4 grid gap-2 overflow-visible",
              fight.sport === "boxing" ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            <div className="relative overflow-visible">
              <PickChoiceButton
                selected={outcome === "fighterA"}
                variant="red"
                onClick={() => selectOutcome("fighterA", "left")}
                impactClass={
                  impact?.side === "left" ? "pick-button-compress" : undefined
                }
                className={cn(
                  "relative z-10 w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wide transition-colors",
                  outcome === "fighterA"
                    ? "bg-red-600 text-white"
                    : "bg-red-600/90 text-white hover:bg-red-500"
                )}
              >
                Pick {getFighterSurname(fight.fighter_a_name)}
              </PickChoiceButton>
              {impact?.side === "left" && (
                <PickImpactOverlay config={impact} />
              )}
            </div>
            {fight.sport === "boxing" && (
              <PickChoiceButton
                selected={outcome === "draw"}
                variant="neutral"
                onClick={() => setOutcome("draw")}
                className={cn(
                  "w-full rounded-xl border-2 py-3 text-xs font-bold uppercase tracking-wide transition-colors",
                  outcome === "draw"
                    ? "border-zinc-300 bg-zinc-600 text-white"
                    : "border-[#2a2a2a] bg-[#181818] text-zinc-400 hover:border-zinc-500"
                )}
              >
                Draw
              </PickChoiceButton>
            )}
            <div className="relative overflow-visible">
              <PickChoiceButton
                selected={outcome === "fighterB"}
                variant="blue"
                onClick={() => selectOutcome("fighterB", "right")}
                impactClass={
                  impact?.side === "right" ? "pick-button-compress" : undefined
                }
                className={cn(
                  "relative z-10 w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wide transition-colors",
                  outcome === "fighterB"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600/90 text-white hover:bg-blue-500"
                )}
              >
                Pick {getFighterSurname(fight.fighter_b_name)}
              </PickChoiceButton>
              {impact?.side === "right" && (
                <PickImpactOverlay config={impact} />
              )}
            </div>
          </div>

          <AdvancedPredictionPanel
            sport={fight.sport}
            scheduledRounds={fight.scheduled_rounds}
            method={method}
            round={round}
            onMethodChange={setMethod}
            onRoundChange={setRound}
            expanded={advancedOpen}
            onToggle={() => setAdvancedOpen(!advancedOpen)}
          />

          {error && (
            <p className="mt-2 text-xs text-red-400" role="alert">
              {error}
            </p>
          )}

          <PickSubmitPanel
            fight={fight}
            existing={existing}
            outcome={outcome}
            method={method}
            round={round}
            pending={pending}
            onSubmit={handleSubmit}
          />

          <p className="mt-2 text-center text-[10px] text-zinc-500">
            You can change your pick until lock.
          </p>
        </>
      )}
    </article>
  );
}
