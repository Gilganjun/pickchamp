"use client";

import { methodLabel } from "@/lib/profile/display";
import { formatRatingPoints } from "@/lib/rating/getPickPotential";
import { cn } from "@/lib/utils";
import type { PredictedMethod, Sport } from "@/types";

const BASE_METHODS: { id: PredictedMethod; label: string }[] = [
  { id: "decision", label: "Decision" },
  { id: "ko_tko", label: "KO/TKO" },
  { id: "dq", label: "DQ" },
  { id: "technical_decision", label: "Technical Decision" },
];

interface AdvancedPredictionPanelProps {
  sport: Sport;
  scheduledRounds: number;
  method: PredictedMethod | null;
  round: number | null;
  maxBonusExtra: number | null;
  onMethodChange: (m: PredictedMethod | null) => void;
  onRoundChange: (r: number | null) => void;
  expanded: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function AdvancedPredictionPanel({
  sport,
  scheduledRounds,
  method,
  round,
  maxBonusExtra,
  onMethodChange,
  onRoundChange,
  expanded,
  onToggle,
  disabled,
}: AdvancedPredictionPanelProps) {
  const methods =
    sport === "mma"
      ? [
          ...BASE_METHODS.slice(0, 2),
          { id: "submission" as PredictedMethod, label: "Submission" },
          ...BASE_METHODS.slice(2),
        ]
      : BASE_METHODS;

  const rounds = Array.from({ length: scheduledRounds }, (_, i) => i + 1);
  const showRound =
    method === "ko_tko" ||
    method === "submission" ||
    method === "dq" ||
    method === "technical_decision";

  const extrasSummary =
    method || round
      ? [method ? methodLabel(method) : null, round ? `R${round}` : null]
          .filter(Boolean)
          .join(" · ")
      : null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 transition-shadow",
        expanded
          ? "border-amber-500/50 bg-gradient-to-b from-[#221a0d] via-[#181818] to-[#141414] shadow-[0_0_28px_rgba(245,158,11,0.14)]"
          : "border-amber-500/35 bg-gradient-to-b from-[#1c160a] to-[#141414] shadow-[0_0_18px_rgba(245,158,11,0.08)]"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.03] disabled:opacity-50"
        aria-expanded={expanded}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-400">
            Bonus rating points
          </p>
          <p className="mt-1 text-base font-black uppercase tracking-tight text-white">
            Add method &amp; round
          </p>
          <p className="mt-1 text-[11px] leading-snug text-zinc-400">
            Optional — predict how they win and when (stoppage) for up to{" "}
            <span className="font-bold text-amber-200">
              {maxBonusExtra != null
                ? formatRatingPoints(maxBonusExtra)
                : "+17"}{" "}
              extra
            </span>{" "}
            on top of a correct winner.
          </p>
          {extrasSummary && !expanded ? (
            <p className="mt-2 text-xs font-semibold text-amber-200/90">
              Selected: {extrasSummary}
            </p>
          ) : null}
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide",
            expanded
              ? "bg-amber-500 text-black"
              : "bg-amber-500/20 text-amber-200 ring-1 ring-amber-500/40"
          )}
        >
          {expanded ? "Close" : "Open"}
        </span>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-amber-500/20 px-4 pb-4 pt-3">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-amber-200/80">
              How will they win? (optional)
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onMethodChange(method === m.id ? null : m.id)
                  }
                  className={cn(
                    "rounded-xl border-2 px-3 py-2.5 text-xs font-bold transition-colors disabled:opacity-50",
                    method === m.id
                      ? "border-amber-400 bg-amber-500/25 text-white"
                      : "border-[#2a2a2a] bg-[#111111] text-zinc-400 hover:border-zinc-500"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {showRound ? (
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-amber-200/80">
                Exact round (optional) — 1 to {scheduledRounds}
              </label>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {rounds.map((r) => (
                  <button
                    key={r}
                    type="button"
                    disabled={disabled}
                    onClick={() => onRoundChange(round === r ? null : r)}
                    className={cn(
                      "rounded-xl border-2 py-2 text-xs font-bold disabled:opacity-50",
                      round === r
                        ? "border-amber-400 bg-amber-500/25 text-white"
                        : "border-[#2a2a2a] bg-[#111111] text-zinc-400 hover:border-zinc-500"
                    )}
                  >
                    R{r}
                  </button>
                ))}
              </div>
            </div>
          ) : method ? (
            <p className="text-[11px] text-zinc-500">
              Pick KO, TKO, submission, or DQ to unlock round prediction.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
