import { PerformanceSummary } from "@/components/profile/PerformanceSummary";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { QualificationCard } from "@/components/profile/QualificationCard";
import { RecentForm } from "@/components/profile/RecentForm";
import { RecentPredictionCard } from "@/components/profile/RecentPredictionCard";
import { SportBreakdownCard } from "@/components/profile/SportBreakdownCard";
import {
  getGlobalAccuracy,
  getRecentFormOutcomes,
} from "@/lib/profile/display";
import type { FightWithRelations, Prediction, Profile } from "@/types";
import type { getProfileRanks } from "@/lib/data/profiles";

interface ProfilePageContentProps {
  profile: Profile;
  ranks: Awaited<ReturnType<typeof getProfileRanks>>;
  predictions: Prediction[];
  fights: FightWithRelations[];
  subtitle?: string;
  showRecentPredictions?: boolean;
}

export function ProfilePageContent({
  profile,
  ranks,
  predictions,
  fights,
  subtitle,
  showRecentPredictions = true,
}: ProfilePageContentProps) {
  const accuracy = getGlobalAccuracy(profile);
  const formOutcomes = getRecentFormOutcomes(predictions, 10);

  const gradedRecent = [...predictions]
    .filter((p) => p.graded_at)
    .sort(
      (a, b) =>
        new Date(b.graded_at!).getTime() - new Date(a.graded_at!).getTime()
    )
    .slice(0, 8);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5 pb-4">
      <ProfileHero profile={profile} subtitle={subtitle} />

      <QualificationCard profile={profile} rank={ranks.global} />

      <div className="grid gap-3 sm:grid-cols-2">
        <SportBreakdownCard
          sport="boxing"
          profile={profile}
          rank={ranks.boxing}
          rating={profile.boxing_rating}
        />
        <SportBreakdownCard
          sport="mma"
          profile={profile}
          rank={ranks.mma}
          rating={profile.mma_rating}
        />
      </div>

      <PerformanceSummary
        accuracy={accuracy}
        totalPicks={profile.total_picks}
        perfectPicks={profile.perfect_picks}
        bestStreak={profile.best_streak}
      />

      <RecentForm
        outcomes={formOutcomes}
        currentStreak={profile.current_streak}
      />

      {showRecentPredictions && (
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Recent Predictions
          </h2>
          <div className="mt-3 space-y-3">
            {gradedRecent.length === 0 ? (
              <p className="rounded-xl border border-[#2a2a2a] bg-[#111111] p-4 text-sm text-zinc-400">
                No graded predictions yet. Lock in a pick and check back after
                the fight settles.
              </p>
            ) : (
              gradedRecent.map((pred) => (
                <RecentPredictionCard
                  key={pred.id}
                  prediction={pred}
                  fight={fights.find((f) => f.id === pred.fight_id)}
                />
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
