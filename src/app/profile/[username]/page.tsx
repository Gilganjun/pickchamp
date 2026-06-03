import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProfileStatCard } from "@/components/ProfileStatCard";
import {
  getProfileByUsername,
  getProfileRanks,
} from "@/lib/data/profiles";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const ranks = await getProfileRanks(profile);
  const totalGraded = profile.boxing_picks + profile.mma_picks;
  const accuracy =
    totalGraded > 0
      ? Math.round((profile.total_correct / totalGraded) * 1000) / 10
      : 0;

  return (
    <AppShell showTagline={false}>
      <h1 className="text-xl font-black">@{profile.username}</h1>
      {profile.display_name && (
        <p className="text-sm text-zinc-500">{profile.display_name}</p>
      )}

      <div className="mt-4 text-sm text-zinc-400">
        <p>Global: {ranks.global.status === "official" ? `#${ranks.global.rank}` : ranks.global.status}</p>
        <p>Boxing: {ranks.boxing.status === "official" ? `#${ranks.boxing.rank}` : ranks.boxing.status}</p>
        <p>MMA: {ranks.mma.status === "official" ? `#${ranks.mma.rank}` : ranks.mma.status}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <ProfileStatCard label="Global Rating" value={profile.global_rating} />
        <ProfileStatCard label="Accuracy" value={`${accuracy}%`} />
        <ProfileStatCard label="Total Picks" value={profile.total_picks} />
        <ProfileStatCard label="Perfect Picks" value={profile.perfect_picks} />
      </div>
    </AppShell>
  );
}
