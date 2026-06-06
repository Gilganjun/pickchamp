import { SportBadge } from "@/components/profile/SportBadge";
import {
  getCurrentPickLockLabel,
  methodLabel,
  type CurrentPickItem,
} from "@/lib/profile/display";
import {
  formatRatingSwingShort,
  getPickPotential,
} from "@/lib/rating/getPickPotential";
import { cn } from "@/lib/utils";
import type { PredictedOutcome } from "@/types";

interface CurrentPickCardProps {
  item: CurrentPickItem;
}

function getPredictedWinnerName(
  fight: CurrentPickItem["fight"],
  outcome: PredictedOutcome
): string {
  if (outcome === "fighterA") return fight.fighter_a_name;
  if (outcome === "fighterB") return fight.fighter_b_name;
  return "Draw";
}

function getPredictedMethodSubtitle(
  method: CurrentPickItem["prediction"]["predicted_method"],
  round: number | null
): string | null {
  if (!method) return null;
  const base = `by ${methodLabel(method)}`;
  return round != null ? `${base} · R${round}` : base;
}

export function CurrentPickCard({ item }: CurrentPickCardProps) {
  const { prediction, fight } = item;
  const winnerName = getPredictedWinnerName(
    fight,
    prediction.predicted_outcome
  );
  const methodSubtitle = getPredictedMethodSubtitle(
    prediction.predicted_method,
    prediction.predicted_round
  );
  const potential = getPickPotential({
    predictedOutcome: prediction.predicted_outcome,
    favouriteSide: fight.favourite_side,
    favouriteLevel: fight.favourite_level,
    predictedMethod: prediction.predicted_method,
    predictedRound: prediction.predicted_round,
  });
  const lockLabel = getCurrentPickLockLabel(fight);
  const isLive = lockLabel === "Live card";
  const sportBorder =
    fight.sport === "boxing" ? "border-red-600/35" : "border-purple-600/35";
  const swing = formatRatingSwingShort(
    potential.correctBase,
    potential.wrongRisk
  );
  const [winSwing, loseSwing] = swing.split(" / ");

  return (
    <article
      data-carousel-card
      className={cn(
        "min-w-[17rem] shrink-0 snap-start rounded-xl border bg-[#111111] p-3",
        sportBorder
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <SportBadge sport={fight.sport} />
        <p
          className={cn(
            "flex items-center gap-1 text-[10px] font-semibold",
            isLive ? "text-red-400" : "text-[#d4a853]"
          )}
        >
          {!isLive && lockLabel.startsWith("Locks in") ? (
            <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
              <path
                fill="currentColor"
                d="M5 7V5a3 3 0 1 1 6 0v2h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1Zm2-2a1 1 0 1 1 2 0v2H7V5Z"
              />
            </svg>
          ) : null}
          {lockLabel}
        </p>
      </div>

      <p className="mt-2 text-sm font-bold leading-snug text-white">
        {fight.fighter_a_name} vs {fight.fighter_b_name}
      </p>
      <p className="mt-0.5 text-[10px] text-zinc-500">{fight.event.name}</p>

      <div className="mt-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-green-500">
          Your Pick
        </p>
        <p className="mt-0.5 text-sm font-bold text-white">{winnerName}</p>
        {methodSubtitle ? (
          <p className="text-[11px] text-zinc-400">{methodSubtitle}</p>
        ) : null}
      </div>

      <div className="mt-3 border-t border-[#2a2a2a] pt-2">
        <p className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">
          If Pick Wins / Loses
        </p>
        <p className="mt-1 text-sm font-black tabular-nums">
          <span className="text-green-500">{winSwing}</span>
          <span className="text-zinc-600"> / </span>
          <span className="text-red-500">{loseSwing}</span>
        </p>
      </div>
    </article>
  );
}
