import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PickRecordPageClient } from "@/components/pickRecord/PickRecordPageClient";
import { MOCK_USER_ID } from "@/data/mock";
import { getAuthUser } from "@/lib/auth/session";
import { usesLiveSupabase } from "@/lib/config";
import { getFightsForProfile, getUserPredictions } from "@/lib/data/fights";
import { getCurrentUserProfile } from "@/lib/data/profiles";

export const dynamic = "force-dynamic";

export default async function PickRecordPage() {
  if (usesLiveSupabase()) {
    const user = await getAuthUser();
    if (!user) {
      return (
        <AppShell showBrand={false} showTagline={false}>
          <div className="pickfist-content mx-auto max-w-lg py-16 text-center">
            <p className="text-zinc-400">Log in to view your Pick Record.</p>
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
        <AppShell showBrand={false} showTagline={false}>
          <p className="pickfist-content py-12 text-center text-zinc-500">
            Profile not found. Try logging out and back in.
          </p>
        </AppShell>
      );
    }

    const [predictions, fights] = await Promise.all([
      getUserPredictions(user.id),
      getFightsForProfile(user.id),
    ]);

    return (
      <AppShell showBrand={false} showTagline={false}>
        <PickRecordPageClient
          profile={profile}
          predictions={predictions}
          fights={fights}
        />
      </AppShell>
    );
  }

  const profile = await getCurrentUserProfile(MOCK_USER_ID);
  if (!profile) {
    return (
      <AppShell showBrand={false} showTagline={false}>
        <p className="pickfist-content py-12 text-center text-zinc-500">
          Profile not found.
        </p>
      </AppShell>
    );
  }

  const [predictions, fights] = await Promise.all([
    getUserPredictions(MOCK_USER_ID),
    getFightsForProfile(MOCK_USER_ID),
  ]);

  return (
    <AppShell showBrand={false} showTagline={false}>
      <PickRecordPageClient
        profile={profile}
        predictions={predictions}
        fights={fights}
      />
    </AppShell>
  );
}
