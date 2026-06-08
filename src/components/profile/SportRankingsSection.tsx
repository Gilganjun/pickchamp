"use client";

import { useCallback, useRef } from "react";
import { SportBreakdownCard } from "@/components/profile/SportBreakdownCard";
import type { FightWithRelations, Prediction, Profile } from "@/types";
import type { getProfileRanks } from "@/lib/data/profiles";

interface SportRankingsSectionProps {
  profile: Profile;
  ranks: Awaited<ReturnType<typeof getProfileRanks>>;
  predictions: Prediction[];
  fights: FightWithRelations[];
}

export function SportRankingsSection({
  profile,
  ranks,
  predictions,
  fights,
}: SportRankingsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollSectionIntoView = useCallback(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      id="profile-sport-rankings"
      ref={sectionRef}
      className="scroll-mt-3"
    >
      <h2 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        Sport Rankings
      </h2>
      <div className="grid grid-cols-2 gap-2">
        <div
          role="button"
          tabIndex={0}
          onClick={scrollSectionIntoView}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              scrollSectionIntoView();
            }
          }}
          className="cursor-pointer rounded-lg text-left transition-opacity hover:opacity-95 active:opacity-90"
          aria-label="Scroll to Boxing ranking"
        >
          <SportBreakdownCard
            sport="boxing"
            profile={profile}
            rank={ranks.boxing}
            rating={profile.boxing_rating}
            predictions={predictions}
            fights={fights}
            compact
          />
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={scrollSectionIntoView}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              scrollSectionIntoView();
            }
          }}
          className="cursor-pointer rounded-lg text-left transition-opacity hover:opacity-95 active:opacity-90"
          aria-label="Scroll to MMA ranking"
        >
          <SportBreakdownCard
            sport="mma"
            profile={profile}
            rank={ranks.mma}
            rating={profile.mma_rating}
            predictions={predictions}
            fights={fights}
            compact
          />
        </div>
      </div>
    </section>
  );
}
