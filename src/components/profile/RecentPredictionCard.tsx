import { SportBadge } from "@/components/profile/SportBadge";
import { formatPickLine, formatResultLine } from "@/lib/profile/display";
import { cn } from "@/lib/utils";
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
  const isCorrect = prediction.main_correct === true;
  const isIncorrect = prediction.main_correct === false;
  const isPerfect = prediction.perfect_pick === true;
  const sportBorder =
    fight?.sport === "boxing"
      ? "border-red-600/25"
      : fight?.sport === "mma"
        ? "border-purple-600/25"
        : "border-[#2a2a2a]";

  return (
    <article
      className={cn(
        "rounded-lg border bg-[#111111] px-3 py-2.5",
        sportBorder,
        isPerfect && "ring-1 ring-[#d4a853]/30"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {fight ? <SportBadge sport={fight.sport} /> : null}
            {fight?.event.name ? (
              <span className="truncate text-[10px] text-zinc-500">
                {fight.event.name}
              </span>
            ) : null}
            {isPerfect ? (
              <span className="rounded bg-[#d4a853]/15 px-1.5 py-0.5 text-[8px] font-bold uppercase text-[#d4a853]">
                Perfect
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-xs font-semibold leading-snug text-white">
            {fightTitle}
          </p>

          <p className="mt-0.5 text-[10px] text-zinc-400">
            Pick: <span className="text-zinc-200">{pickLine}</span>
          </p>

          {resultLine ? (
            <p className="text-[10px] text-zinc-500">
              Result: <span className="text-zinc-300">{resultLine}</span>
            </p>
          ) : null}
        </div>

        {ratingChange != null ? (
          <div className="shrink-0 text-right">
            <p
              className={cn(
                "text-base font-black tabular-nums leading-none",
                ratingChange > 0
                  ? "text-green-500"
                  : ratingChange < 0
                    ? "text-red-500"
                    : "text-zinc-400"
              )}
            >
              {ratingChange >= 0 ? "+" : ""}
              {ratingChange}
            </p>
            <p
              className={cn(
                "mt-0.5 text-[8px] font-bold uppercase tracking-wide",
                isCorrect
                  ? "text-green-500"
                  : isIncorrect
                    ? "text-red-500"
                    : "text-zinc-500"
              )}
            >
              {isCorrect ? "Correct" : isIncorrect ? "Incorrect" : "Pending"}
            </p>
          </div>
        ) : (
          <p
            className={cn(
              "shrink-0 text-[8px] font-bold uppercase tracking-wide",
              isCorrect
                ? "text-green-500"
                : isIncorrect
                  ? "text-red-500"
                  : "text-zinc-500"
            )}
          >
            {isCorrect ? "Correct" : isIncorrect ? "Incorrect" : "Pending"}
          </p>
        )}
      </div>
    </article>
  );
}
