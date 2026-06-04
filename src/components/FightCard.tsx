"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  CurrentPickSummary,
  PickFistLine,
  PickRatingSwingCard,
  RatingPointsGuide,
  RatingSwingButtonFooter,
  UpdatePickButton,
} from "@/components/picks/PickRatingSwing";
import {
  getMaxMethodRoundExtra,
  getPickFistLine,
  getPickPotential,
} from "@/lib/rating/getPickPotential";
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

type FighterSide = "fighterA" | "fighterB";

function getFighterPickColumnState(
  side: FighterSide,
  savedOutcome: PredictedOutcome | null | undefined,
  draftOutcome: PredictedOutcome | null
) {
  const isSavedPick = savedOutcome === side;
  const isDraftPick =
    draftOutcome === side && draftOutcome !== savedOutcome;
  const activeFighterPick =
    draftOutcome === "fighterA" ||
    draftOutcome === "fighterB" ||
    savedOutcome === "fighterA" ||
    savedOutcome === "fighterB";
  const isDimmed =
    activeFighterPick &&
    !isSavedPick &&
    !isDraftPick &&
    savedOutcome !== "draw" &&
    draftOutcome !== "draw";

  return { isSavedPick, isDraftPick, isDimmed };
}

function getPickButtonLabel(
  side: FighterSide,
  surname: string,
  savedOutcome: PredictedOutcome | null | undefined,
  draftOutcome: PredictedOutcome | null
): string {
  if (draftOutcome !== side) {
    return `Pick ${surname}`;
  }
  if (savedOutcome === side) {
    return "✓ Selected";
  }
  return "Selected";
}

function FighterPickColumn({
  side,
  name,
  accent,
  savedOutcome,
  draftOutcome,
  subtitle,
}: {
  side: FighterSide;
  name: string;
  accent: "red" | "blue";
  savedOutcome: PredictedOutcome | null | undefined;
  draftOutcome: PredictedOutcome | null;
  subtitle?: ReactNode;
}) {
  const { isSavedPick, isDraftPick, isDimmed } = getFighterPickColumnState(
    side,
    savedOutcome,
    draftOutcome
  );

  return (
    <div
      className={cn(
        "relative text-center transition-opacity",
        isSavedPick && `fighter-column-selected-saved fighter-column-selected-saved--${accent}`,
        isDraftPick && "fighter-column-selected-draft",
        isDimmed && "fighter-column-dimmed"
      )}
    >
      {isSavedPick ? (
        <span className="selected-pick-badge">✓ Your pick</span>
      ) : isDraftPick ? (
        <span className="selected-pick-badge">Unsaved</span>
      ) : null}
      <p className="fighter-pick-name text-sm font-black uppercase leading-tight tracking-tight text-white">
        {name}
      </p>
      {subtitle}
    </div>
  );
}

function PickChoiceButton({
  selected,
  variant,
  savedMatch,
  className,
  impactClass,
  children,
  onClick,
}: {
  selected: boolean;
  variant: "red" | "blue" | "neutral";
  savedMatch?: boolean;
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
        selected &&
          cn(
            `pick-choice-selected pick-choice-selected--${variant}`,
            savedMatch && "pick-choice-selected--saved-static"
          ),
        impactClass
      )}
    >
      {children}
    </button>
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

  const savedOutcome = existing?.predicted_outcome;
  const draftOutcome = locked || settled ? null : outcome;

  const favouriteContext = useMemo(
    () => ({
      favouriteSide: fight.favourite_side,
      favouriteLevel: fight.favourite_level,
    }),
    [fight.favourite_side, fight.favourite_level]
  );

  const potentialFighterA = useMemo(
    () =>
      getPickPotential({
        predictedOutcome: "fighterA",
        ...favouriteContext,
      }),
    [favouriteContext]
  );

  const potentialFighterB = useMemo(
    () =>
      getPickPotential({
        predictedOutcome: "fighterB",
        ...favouriteContext,
      }),
    [favouriteContext]
  );

  const potentialDraw = useMemo(
    () =>
      getPickPotential({
        predictedOutcome: "draw",
        ...favouriteContext,
      }),
    [favouriteContext]
  );

  const pickFistLine = useMemo(() => getPickFistLine(fight), [fight]);

  const activePotential = useMemo(() => {
    if (!outcome || locked || settled) return null;
    return getPickPotential({
      predictedOutcome: outcome,
      ...favouriteContext,
      predictedMethod: method,
      predictedRound: round,
    });
  }, [outcome, method, round, favouriteContext, locked, settled]);

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
        <FighterPickColumn
          side="fighterA"
          name={fight.fighter_a_name}
          accent="red"
          savedOutcome={savedOutcome}
          draftOutcome={draftOutcome}
          subtitle={
            <p className="mt-0.5 text-[10px] text-zinc-500">
              {fight.scheduled_rounds} rds
              {fight.weight_class ? ` · ${fight.weight_class}` : ""}
            </p>
          }
        />
        <span className="rounded-full border border-[#2a2a2a] bg-[#181818] px-2 py-1 text-[10px] font-bold text-zinc-400">
          VS
        </span>
        <FighterPickColumn
          side="fighterB"
          name={fight.fighter_b_name}
          accent="blue"
          savedOutcome={savedOutcome}
          draftOutcome={draftOutcome}
        />
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
          <PickFistLine label={pickFistLine} />
          <div
            className={cn(
              "mt-3 grid gap-2 overflow-visible",
              fight.sport === "boxing" ? "grid-cols-3" : "grid-cols-2"
            )}
          >
            <div className="relative overflow-visible">
              <PickChoiceButton
                selected={outcome === "fighterA"}
                savedMatch={savedOutcome === "fighterA" && outcome === "fighterA"}
                variant="red"
                onClick={() => selectOutcome("fighterA", "left")}
                impactClass={
                  impact?.side === "left" ? "pick-button-compress" : undefined
                }
                className={cn(
                  "relative z-10 flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors",
                  outcome === "fighterA"
                    ? "bg-red-600 text-white"
                    : "bg-red-600/90 text-white hover:bg-red-500"
                )}
              >
                <span>
                  {getPickButtonLabel(
                    "fighterA",
                    getFighterSurname(fight.fighter_a_name),
                    savedOutcome,
                    outcome
                  )}
                </span>
                <RatingSwingButtonFooter potential={potentialFighterA} />
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
                  "flex w-full flex-col items-center gap-0.5 rounded-xl border-2 px-1 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors",
                  outcome === "draw"
                    ? "border-zinc-300 bg-zinc-600 text-white"
                    : "border-[#2a2a2a] bg-[#181818] text-zinc-400 hover:border-zinc-500"
                )}
              >
                <span>Draw</span>
                <RatingSwingButtonFooter potential={potentialDraw} />
              </PickChoiceButton>
            )}
            <div className="relative overflow-visible">
              <PickChoiceButton
                selected={outcome === "fighterB"}
                savedMatch={savedOutcome === "fighterB" && outcome === "fighterB"}
                variant="blue"
                onClick={() => selectOutcome("fighterB", "right")}
                impactClass={
                  impact?.side === "right" ? "pick-button-compress" : undefined
                }
                className={cn(
                  "relative z-10 flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-xs font-bold uppercase tracking-wide transition-colors",
                  outcome === "fighterB"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-600/90 text-white hover:bg-blue-500"
                )}
              >
                <span>
                  {getPickButtonLabel(
                    "fighterB",
                    getFighterSurname(fight.fighter_b_name),
                    savedOutcome,
                    outcome
                  )}
                </span>
                <RatingSwingButtonFooter potential={potentialFighterB} />
              </PickChoiceButton>
              {impact?.side === "right" && (
                <PickImpactOverlay config={impact} />
              )}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#181818]">
            <CurrentPickSummary
              hasSaved={Boolean(existing)}
              dirty={pickIsDirty(existing, outcome, method, round)}
              savedLine={
                existing
                  ? formatPickLine(
                      fight,
                      existing.predicted_outcome,
                      existing.predicted_method,
                      existing.predicted_round
                    )
                  : null
              }
              draftLine={
                outcome
                  ? formatPickLine(fight, outcome, method, round)
                  : null
              }
              showDraft={
                Boolean(
                  outcome &&
                    (!existing ||
                      pickIsDirty(existing, outcome, method, round))
                )
              }
            />
          </div>

          <PickRatingSwingCard
            potential={activePotential}
            method={method}
            round={round}
          />

          <div className="mt-3">
            <AdvancedPredictionPanel
              sport={fight.sport}
              scheduledRounds={fight.scheduled_rounds}
              method={method}
              round={round}
              maxBonusExtra={
                activePotential
                  ? getMaxMethodRoundExtra(activePotential)
                  : null
              }
              onMethodChange={setMethod}
              onRoundChange={setRound}
              expanded={advancedOpen}
              onToggle={() => setAdvancedOpen(!advancedOpen)}
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#181818]">
            <UpdatePickButton
              pending={pending}
              disabled={pending || !outcome}
              hasSaved={Boolean(existing)}
              dirty={pickIsDirty(existing, outcome, method, round)}
              showDraft={
                Boolean(
                  outcome &&
                    (!existing ||
                      pickIsDirty(existing, outcome, method, round))
                )
              }
              draftLine={
                outcome
                  ? formatPickLine(fight, outcome, method, round)
                  : null
              }
              onSubmit={handleSubmit}
            />
            <div className="p-4 pt-3">
              <RatingPointsGuide
                potential={activePotential}
                method={method}
                round={round}
              />
            </div>
          </div>

          {error && (
            <p className="mt-2 text-xs text-red-400" role="alert">
              {error}
            </p>
          )}

          <p className="mt-2 text-center text-[10px] text-zinc-500">
            You can change your pick until lock.
          </p>
        </>
      )}
    </article>
  );
}
