import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProfileStatCard } from "@/components/ProfileStatCard";
import { getMockFightWithRelations } from "@/data/mock";
import { getUserPredictions } from "@/lib/data/fights";
import {
  getCurrentUserProfile,
  getProfileRanks,
} from "@/lib/data/profiles";
import { MOCK_USER_ID } from "@/data/mock";

function formatRankDisplay(
  r: Awaited<ReturnType<typeof getProfileRanks>>["global"]
): string {
  if (r.status === "inactive") return "Inactive";
  if (r.status === "provisional") return `Provisional — ${r.progress}`;
  return `#${r.rank?.toLocaleString()}`;
}

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile(MOCK_USER_ID);
  if (!profile) {
    return (
      <AppShell>
        <p className="py-12 text-center text-zinc-500">
          Profile not found.{" "}
          <Link href="/" className="text-red-500">
            Go home
          </Link>
        </p>
      </AppShell>
    );
  }

  const ranks = await getProfileRanks(profile);
  const predictions = await getUserPredictions(MOCK_USER_ID);
  const fights = getMockFightWithRelations(MOCK_USER_ID);
  const totalGraded = profile.boxing_picks + profile.mma_picks;
  const accuracy =
    totalGraded > 0
      ? Math.round((profile.total_correct / totalGraded) * 1000) / 10
      : 0;

  return (
    <AppShell showTagline={false}>
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#181818] text-lg font-bold text-red-500 ring-2 ring-[#2a2a2a]">
          {profile.avatar_initials ?? profile.username.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-black">@{profile.username}</h1>
          <p className="text-xs text-zinc-500">Demo user (mock mode)</p>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm">
        <p>
          <span className="text-zinc-500">Global Rank: </span>
          <span className="font-semibold text-[#d4a853]">
            {formatRankDisplay(ranks.global)}
          </span>
        </p>
        <p>
          <span className="text-zinc-500">Boxing Rank: </span>
          <span className="font-semibold">{formatRankDisplay(ranks.boxing)}</span>
        </p>
        <p>
          <span className="text-zinc-500">MMA Rank: </span>
          <span className="font-semibold">{formatRankDisplay(ranks.mma)}</span>
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <ProfileStatCard label="Global Rating" value={profile.global_rating} />
        <ProfileStatCard label="Boxing Rating" value={profile.boxing_rating} />
        <ProfileStatCard label="MMA Rating" value={profile.mma_rating} />
        <ProfileStatCard label="Accuracy" value={`${accuracy}%`} />
        <ProfileStatCard label="Total Picks" value={profile.total_picks} />
        <ProfileStatCard label="Perfect Picks" value={profile.perfect_picks} />
        <ProfileStatCard
          label="Current Streak"
          value={profile.current_streak}
        />
        <ProfileStatCard label="Best Streak" value={profile.best_streak} />
      </div>

      <section className="mt-8">
        <h2 className="text-xs font-bold uppercase text-zinc-500">
          Recent Predictions
        </h2>
        <div className="mt-3 space-y-2">
          {predictions
            .filter((p) => p.graded_at)
            .slice(0, 5)
            .map((pred) => {
              const fight = fights.find((f) => f.id === pred.fight_id);
              return (
                <div
                  key={pred.id}
                  className="rounded-lg border border-[#2a2a2a] bg-[#111111] p-3 text-sm"
                >
                  <p className="font-medium">
                    {fight
                      ? `${fight.fighter_a_name} vs ${fight.fighter_b_name}`
                      : pred.fight_id}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Pick: {pred.predicted_outcome} ·{" "}
                    {pred.main_correct ? (
                      <span className="text-green-500">Correct</span>
                    ) : (
                      <span className="text-red-500">Incorrect</span>
                    )}
                    {pred.rating_change != null &&
                      ` · ${pred.rating_change >= 0 ? "+" : ""}${pred.rating_change}`}
                  </p>
                </div>
              );
            })}
        </div>
      </section>
    </AppShell>
  );
}
