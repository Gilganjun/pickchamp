"use client";

import { useEffect, useRef, useState, useTransition } from "react";
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
import {
  cn,
  formatFightDate,
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
            {formatFightDate(fight.lock_time)}
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
            <p className="mt-1 text-xs text-zinc-500">
              Your pick: {existing.predicted_outcome === "fighterA"
                ? fight.fighter_a_name
                : existing.predicted_outcome === "fighterB"
                  ? fight.fighter_b_name
                  : "Draw"}
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
              <button
                type="button"
                onClick={() => selectOutcome("fighterA", "left")}
                className={cn(
                  "relative z-10 w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wide transition-colors",
                  outcome === "fighterA"
                    ? "bg-red-600 text-white ring-2 ring-red-400"
                    : "bg-red-600/90 text-white hover:bg-red-500",
                  impact?.side === "left" && "pick-button-compress"
                )}
              >
                Pick {getFighterSurname(fight.fighter_a_name)}
              </button>
              {impact?.side === "left" && (
                <PickImpactOverlay config={impact} />
              )}
            </div>
            {fight.sport === "boxing" && (
              <button
                type="button"
                onClick={() => setOutcome("draw")}
                className={cn(
                  "rounded-xl border py-3 text-xs font-bold uppercase tracking-wide",
                  outcome === "draw"
                    ? "border-zinc-400 bg-zinc-700 text-white"
                    : "border-[#2a2a2a] bg-[#181818] text-zinc-400 hover:border-zinc-500"
                )}
              >
                Draw
              </button>
            )}
            <div className="relative overflow-visible">
              <button
                type="button"
                onClick={() => selectOutcome("fighterB", "right")}
                className={cn(
                  "relative z-10 w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wide transition-colors",
                  outcome === "fighterB"
                    ? "bg-blue-600 text-white ring-2 ring-blue-400"
                    : "bg-blue-600/90 text-white hover:bg-blue-500",
                  impact?.side === "right" && "pick-button-compress"
                )}
              >
                Pick {getFighterSurname(fight.fighter_b_name)}
              </button>
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

          <button
            type="button"
            onClick={handleSubmit}
            disabled={pending || !outcome}
            className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-bold uppercase tracking-wide text-black transition-opacity hover:bg-zinc-200 disabled:opacity-40"
          >
            {pending ? "Saving…" : existing ? "Update My Pick" : "Lock My Pick"}
          </button>

          <p className="mt-2 text-center text-[10px] text-zinc-500">
            You can change your pick until locks.
          </p>
        </>
      )}

      {existing && !locked && !settled && (
        <p className="mt-2 text-center text-[10px] text-green-500/80">
          Pick saved — edit anytime before lock
        </p>
      )}
    </article>
  );
}
