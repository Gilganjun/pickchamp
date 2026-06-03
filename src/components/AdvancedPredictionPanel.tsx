"use client";

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
  onMethodChange,
  onRoundChange,
  expanded,
  onToggle,
  disabled,
}: AdvancedPredictionPanelProps) {
  const methods =
    sport === "mma"
      ? [...BASE_METHODS.slice(0, 2), { id: "submission" as PredictedMethod, label: "Submission" }, ...BASE_METHODS.slice(2)]
      : BASE_METHODS;

  const rounds = Array.from({ length: scheduledRounds }, (_, i) => i + 1);
  const showRound = method === "ko_tko" || method === "submission" || method === "dq" || method === "technical_decision";

  return (
    <div className="mt-3 border-t border-[#2a2a2a] pt-3">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-50"
      >
        {expanded ? "− Hide method / round" : "+ Add method / round"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-4">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Method (optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    onMethodChange(method === m.id ? null : m.id)
                  }
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                    method === m.id
                      ? "border-red-500 bg-red-500/15 text-white"
                      : "border-[#2a2a2a] bg-[#181818] text-zinc-400"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {showRound && (
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Round (optional) — 1 to {scheduledRounds}
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {rounds.map((r) => (
                  <button
                    key={r}
                    type="button"
                    disabled={disabled}
                    onClick={() => onRoundChange(round === r ? null : r)}
                    className={`min-w-[40px] rounded-lg border px-2 py-1.5 text-xs font-medium disabled:opacity-50 ${
                      round === r
                        ? "border-red-500 bg-red-500/15 text-white"
                        : "border-[#2a2a2a] bg-[#181818] text-zinc-400"
                    }`}
                  >
                    R{r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
