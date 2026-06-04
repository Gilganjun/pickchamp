"use client";

import {
  formatRatingPoints,
  formatRatingSwingCompact,
  formatRatingSwingShort,
  type PickPotential,
} from "@/lib/rating/getPickPotential";
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

/** Compact swing for pick buttons — responsive short form on narrow screens */
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

export function RatingSwingPanel({
  potential,
  emptyMessage,
}: {
  potential: PickPotential | null;
  emptyMessage?: string;
}) {
  if (!potential) {
    return (
      <p className="mt-2 text-[10px] text-zinc-500">
        {emptyMessage ?? "Select a fighter to see your rating swing."}
      </p>
    );
  }

  const showDetailed = potential.breakdown.length > 1;
  const showPerfect =
    potential.perfectBonus > 0 &&
    potential.perfectCeiling > potential.maxWithCurrentDetails;

  return (
    <div className="mt-3 rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        Rating swing
      </p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
        {potential.tierLabel} pick
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        <RatingChip label="Correct" value={potential.correctBase} positive />
        <RatingChip label="Wrong" value={potential.wrongRisk} positive={false} />
      </div>

      {showDetailed ? (
        <ul className="mt-2 space-y-1 border-t border-[#2a2a2a] pt-2">
          {potential.breakdown.map((row) => (
            <li
              key={row.label}
              className="flex justify-between text-[10px] text-zinc-400"
            >
              <span>{row.label}</span>
              <span className="font-semibold text-amber-200/90">
                {formatRatingPoints(row.value)}
              </span>
            </li>
          ))}
          {showPerfect ? (
            <li className="flex justify-between text-[10px] font-semibold text-zinc-300">
              <span>Perfect ceiling</span>
              <span className="text-amber-200">
                {formatRatingPoints(potential.perfectCeiling)}
              </span>
            </li>
          ) : (
            <li className="flex justify-between text-[10px] font-semibold text-zinc-300">
              <span>Potential</span>
              <span className="text-amber-200">
                {formatRatingPoints(potential.maxWithCurrentDetails)}
              </span>
            </li>
          )}
          <li className="flex justify-between text-[10px] text-zinc-500">
            <span>Wrong fighter</span>
            <span className="font-semibold text-red-300/90">
              {formatRatingPoints(potential.wrongRisk)}
            </span>
          </li>
        </ul>
      ) : (
        <p className="mt-2 text-[10px] text-zinc-500">
          {formatRatingSwingCompact(
            potential.correctBase,
            potential.wrongRisk
          )}
        </p>
      )}
    </div>
  );
}

function RatingChip({
  label,
  value,
  positive,
}: {
  label: string;
  value: number;
  positive: boolean;
}) {
  return (
    <div className="rounded-md border border-[#2a2a2a] bg-[#1a1a1a] px-2 py-1">
      <p className="text-[9px] uppercase tracking-wide text-zinc-500">{label}</p>
      <p
        className={cn(
          "text-xs font-bold tabular-nums",
          positive ? "text-amber-200" : "text-red-300"
        )}
      >
        {formatRatingPoints(value)}
      </p>
    </div>
  );
}

export function AdvancedRatingNote({ potential }: { potential: PickPotential }) {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-3 py-2">
      <p className="text-[10px] leading-relaxed text-zinc-500">
        Method correct {formatRatingPoints(4)} · Exact round{" "}
        {formatRatingPoints(8)} · Perfect {formatRatingPoints(5)}
      </p>
      {potential.perfectBonus > 0 ? (
        <p className="mt-1 text-[10px] font-semibold text-amber-200/90">
          Perfect ceiling: {formatRatingPoints(potential.perfectCeiling)}
        </p>
      ) : potential.methodBonus > 0 || potential.roundExactBonus > 0 ? (
        <p className="mt-1 text-[10px] font-semibold text-zinc-400">
          Potential: {formatRatingPoints(potential.maxWithCurrentDetails)}
        </p>
      ) : null}
    </div>
  );
}
