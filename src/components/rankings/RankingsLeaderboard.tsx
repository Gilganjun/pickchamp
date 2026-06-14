import { RankingPodiumCard } from "@/components/rankings/RankingPodiumCard";
import { RankingStandardCard } from "@/components/rankings/RankingStandardCard";
import { RankingsTop10Header } from "@/components/rankings/RankingsTop10Header";
import { getPodiumVariant } from "@/lib/rankings/rankingsDisplay";
import type { Profile, RankingTab } from "@/types";

export interface LeaderboardRow {
  profile: Profile;
  rank: number;
  rating: number;
  accuracy: number;
  picks: number;
}

interface RankingsLeaderboardProps {
  rows: LeaderboardRow[];
  tab: RankingTab;
  currentUserId?: string | null;
}

function getTop10TabLabel(tab: RankingTab): string {
  if (tab === "boxing") return "Boxing";
  if (tab === "mma") return "MMA";
  return "Global";
}

export function RankingsLeaderboard({
  rows,
  tab,
  currentUserId,
}: RankingsLeaderboardProps) {
  return (
    <section className="rankings-top10-section rounded-xl border border-[#d4a853]/20 bg-[#0d0d0d] px-2 pb-3 pt-2">
      <RankingsTop10Header tabLabel={getTop10TabLabel(tab)} />

      <div className="mt-2 space-y-2">
        {rows.map((row) => {
          const podium = getPodiumVariant(row.rank);
          const isCurrentUser =
            currentUserId != null && row.profile.id === currentUserId;

          if (podium) {
            return (
              <RankingPodiumCard
                key={row.profile.id}
                rank={row.rank}
                profile={row.profile}
                rating={row.rating}
                accuracy={row.accuracy}
                picks={row.picks}
                tab={tab}
                variant={podium}
                isCurrentUser={isCurrentUser}
              />
            );
          }

          return (
            <RankingStandardCard
              key={row.profile.id}
              rank={row.rank}
              profile={row.profile}
              rating={row.rating}
              accuracy={row.accuracy}
              picks={row.picks}
              tab={tab}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </div>
    </section>
  );
}
