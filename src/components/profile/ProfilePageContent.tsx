import { ProfileSectionHeading } from "@/components/profile/ProfileSectionHeading";
import { SubscriptionTrialNotice } from "@/components/profile/SubscriptionTrialNotice";
import { CurrentPicksSection } from "@/components/profile/CurrentPicksSection";
import { DetailedStatsSection } from "@/components/profile/DetailedStatsSection";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { RecentPredictionCard } from "@/components/profile/RecentPredictionCard";
import { SportRankingsSection } from "@/components/profile/SportRankingsSection";
import {
  buildPickRecordItems,
  getPickRecordCounts,
} from "@/lib/pickRecord/pickRecord";
import {
  getCurrentPickItems,
  getGlobalAccuracy,
  hasHiddenOpenPicksOnPublicProfile,
} from "@/lib/profile/display";
import type { FightWithRelations, Prediction, Profile } from "@/types";
import type { getProfileRanks } from "@/lib/data/profiles";

interface ProfilePageContentProps {
  profile: Profile;
  ranks: Awaited<ReturnType<typeof getProfileRanks>>;
  predictions: Prediction[];
  fights: FightWithRelations[];
  subtitle?: string;
  isOwnProfile?: boolean;
  showRecentPredictions?: boolean;
}

export function ProfilePageContent({
  profile,
  ranks,
  predictions,
  fights,
  isOwnProfile = false,
  showRecentPredictions = true,
}: ProfilePageContentProps) {
  const accuracy = getGlobalAccuracy(profile);
  const currentPicks = getCurrentPickItems(predictions, fights, {
    isOwnProfile,
  });
  const showHiddenMessage =
    !isOwnProfile &&
    currentPicks.length === 0 &&
    hasHiddenOpenPicksOnPublicProfile(predictions, fights);

  const pickRecordCounts = isOwnProfile
    ? getPickRecordCounts(buildPickRecordItems(predictions, fights))
    : null;

  const gradedRecent = [...predictions]
    .filter((p) => p.graded_at)
    .sort(
      (a, b) =>
        new Date(b.graded_at!).getTime() - new Date(a.graded_at!).getTime()
    )
    .slice(0, 8);

  return (
    <div className="pickfist-content mx-auto w-full max-w-lg space-y-4 pb-4">
      {isOwnProfile ? <SubscriptionTrialNotice profile={profile} /> : null}

      <ProfileHero
        profile={profile}
        rank={ranks.global}
        predictions={predictions}
        fights={fights}
        accuracy={accuracy}
        pickRecordCounts={isOwnProfile ? pickRecordCounts : null}
      />

      <CurrentPicksSection
        items={currentPicks}
        isOwnProfile={isOwnProfile}
        showHiddenMessage={showHiddenMessage}
      />

      <SportRankingsSection
        profile={profile}
        ranks={ranks}
        predictions={predictions}
        fights={fights}
      />

      {showRecentPredictions && (
        <section>
          <ProfileSectionHeading>Recent Results</ProfileSectionHeading>
          <div className="space-y-2">
            {gradedRecent.length === 0 ? (
              <p className="rounded-lg border border-[#2a2a2a] bg-[#111111] px-3 py-2.5 text-xs text-zinc-500">
                No graded predictions yet.
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

      <DetailedStatsSection profile={profile} ranks={ranks} />
    </div>
  );
}
