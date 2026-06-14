import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProfilePageContent } from "@/components/profile/ProfilePageContent";
import { getFightsForProfile, getUserPredictions } from "@/lib/data/fights";
import {
  getProfileByUsername,
  getProfileRanks,
} from "@/lib/data/profiles";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const ranks = await getProfileRanks(profile);
  const predictions = await getUserPredictions(profile.id);
  const fights = await getFightsForProfile(profile.id);

  return (
    <AppShell showTagline={false} centeredBrand>
      <ProfilePageContent
        profile={profile}
        ranks={ranks}
        predictions={predictions}
        fights={fights}
        subtitle={profile.display_name ?? undefined}
        isOwnProfile={false}
      />
    </AppShell>
  );
}
