import {
  formatPickLine,
  formatResultLine,
} from "@/lib/profile/display";
import type { FightWithRelations, Prediction } from "@/types";

interface RecentPredictionCardProps {
  prediction: Prediction;
  fight?: FightWithRelations;
}

export function RecentPredictionCard({
  prediction,
  fight,
}: RecentPredictionCardProps) {
  const fightTitle = fight
    ? `${fight.fighter_a_name} vs ${fight.fighter_b_name}`
    : prediction.fight_id;

  const pickLine =
    fight != null
      ? formatPickLine(
          fight,
          prediction.predicted_outcome,
          prediction.predicted_method,
          prediction.predicted_round
        )
      : prediction.predicted_outcome;

  const resultLine =
    fight?.result != null ? formatResultLine(fight, fight.result) : null;

  const ratingChange = prediction.rating_change;
  const isPending = prediction.graded_at == null;
  const isCorrect = prediction.main_correct === true;
  const isIncorrect = prediction.main_correct === false;

  return (
    <article className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4">
      <h3 className="text-sm font-semibold text-white leading-snug">
        {fightTitle}
      </h3>

      <div className="mt-3 space-y-2 text-xs">
        <div>
          <p className="text-zinc-500">Pick</p>
          <p className="mt-0.5 font-medium text-zinc-200">{pickLine}</p>
        </div>

        {resultLine && (
          <div>
            <p className="text-zinc-500">Result</p>
            <p className="mt-0.5 font-medium text-zinc-200">{resultLine}</p>
          </div>
        )}

        {ratingChange != null && (
          <div>
            <p className="text-zinc-500">Rating</p>
            <p
              className={`mt-0.5 font-bold tabular-nums ${
                ratingChange > 0
                  ? "text-green-500"
                  : ratingChange < 0
                    ? "text-red-500"
                    : "text-zinc-400"
              }`}
            >
              {ratingChange >= 0 ? "+" : ""}
              {ratingChange}
            </p>
          </div>
        )}

        <div>
          <p className="text-zinc-500">Status</p>
          <p
            className={`mt-0.5 font-semibold ${
              isPending
                ? "text-zinc-500"
                : isCorrect
                  ? "text-green-500"
                  : isIncorrect
                    ? "text-red-500"
                    : "text-zinc-500"
            }`}
          >
            {isPending
              ? "Pending"
              : isCorrect
                ? "Correct"
                : isIncorrect
                  ? "Incorrect"
                  : "—"}
          </p>
        </div>
      </div>
    </article>
  );
}
