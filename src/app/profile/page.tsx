import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ProfilePageContent } from "@/components/profile/ProfilePageContent";
import { getMockFightWithRelations, MOCK_USER_ID } from "@/data/mock";
import { getUserPredictions } from "@/lib/data/fights";
import {
  getCurrentUserProfile,
  getProfileRanks,
} from "@/lib/data/profiles";

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

  return (
    <AppShell showBrand={false} showTagline={false}>
      <ProfilePageContent
        profile={profile}
        ranks={ranks}
        predictions={predictions}
        fights={fights}
        subtitle="Demo user (mock mode)"
      />
    </AppShell>
  );
}
