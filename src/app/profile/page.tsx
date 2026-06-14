import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ProfilePageContent } from "@/components/profile/ProfilePageContent";
import { getAuthUser } from "@/lib/auth/session";
import { usesLiveSupabase } from "@/lib/config";
import { MOCK_USER_ID } from "@/data/mock";
import { getFightsForProfile, getUserPredictions } from "@/lib/data/fights";
import {
  getCurrentUserProfile,
  getProfileRanks,
} from "@/lib/data/profiles";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  if (usesLiveSupabase()) {
    const user = await getAuthUser();
    if (!user) {
      return (
        <AppShell showBrand={false} showTagline={false}>
          <div className="py-16 text-center">
            <p className="text-zinc-400">Log in to view your profile.</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold uppercase text-white hover:bg-red-500"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-[#2a2a2a] px-6 py-3 text-sm font-bold uppercase text-white hover:border-zinc-600"
              >
                Sign up
              </Link>
            </div>
          </div>
        </AppShell>
      );
    }

    const profile = await getCurrentUserProfile(user.id);
    if (!profile) {
      return (
        <AppShell>
          <p className="py-12 text-center text-zinc-500">
            Profile not found. Try logging out and back in.
          </p>
        </AppShell>
      );
    }

    const ranks = await getProfileRanks(profile);
    const predictions = await getUserPredictions(user.id);
    const fights = await getFightsForProfile(user.id);

    return (
      <AppShell
        showTagline={false}
        centeredBrand
        headerTrailing={<LogoutButton />}
      >
        <ProfilePageContent
          profile={profile}
          ranks={ranks}
          predictions={predictions}
          fights={fights}
          isOwnProfile
        />
      </AppShell>
    );
  }

  const profile = await getCurrentUserProfile(MOCK_USER_ID);
  if (!profile) {
    return (
      <AppShell>
        <p className="py-12 text-center text-zinc-500">
          Profile not found.{" "}
          <Link href="/picks" className="text-red-500">
            Go to picks
          </Link>
        </p>
      </AppShell>
    );
  }

  const ranks = await getProfileRanks(profile);
  const predictions = await getUserPredictions(MOCK_USER_ID);
  const fights = await getFightsForProfile(MOCK_USER_ID);

  return (
    <AppShell showTagline={false} centeredBrand>
      <ProfilePageContent
        profile={profile}
        ranks={ranks}
        predictions={predictions}
        fights={fights}
        subtitle="Local demo profile — picks persist across page refreshes (dev only)"
        isOwnProfile
      />
    </AppShell>
  );
}
