import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ProfilePageContent } from "@/components/profile/ProfilePageContent";
import { getMockFightWithRelations } from "@/data/mock";
import { getUserPredictions } from "@/lib/data/fights";
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
  const predictions = await getUserPredictions(profile.id);
  const fights = getMockFightWithRelations(profile.id);

  return (
    <AppShell showBrand={false} showTagline={false}>
      <ProfilePageContent
        profile={profile}
        ranks={ranks}
        predictions={predictions}
        fights={fights}
        subtitle={profile.display_name ?? undefined}
      />
    </AppShell>
  );
}
