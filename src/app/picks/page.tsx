import { Suspense } from "react";
import { PicksClient } from "./PicksClient";
import { MOCK_USER_ID } from "@/data/mock";
import { getAuthUser } from "@/lib/auth/session";
import { usesLiveSupabase } from "@/lib/config";
import { getEventsForPicks, getFightsForPicks } from "@/lib/data/fights";

export const dynamic = "force-dynamic";

export default async function PicksPage() {
  const useSupabase = usesLiveSupabase();
  const user = useSupabase ? await getAuthUser() : null;
  const userId = useSupabase ? user?.id : MOCK_USER_ID;
  const isLoggedIn = useSupabase ? Boolean(user) : true;

  try {
    const [events, fights] = await Promise.all([
      getEventsForPicks("all", userId),
      getFightsForPicks("all", userId, "all"),
    ]);

    return (
      <Suspense
        fallback={
          <PicksClient
            initialIsLoggedIn={isLoggedIn}
            initialEvents={events}
            initialFights={fights}
          />
        }
      >
        <PicksClient
          initialIsLoggedIn={isLoggedIn}
          initialEvents={events}
          initialFights={fights}
        />
      </Suspense>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to load fights.";
    return (
      <Suspense
        fallback={
          <PicksClient
            initialIsLoggedIn={isLoggedIn}
            initialEvents={[]}
            initialFights={[]}
            initialError={message}
          />
        }
      >
        <PicksClient
          initialIsLoggedIn={isLoggedIn}
          initialEvents={[]}
          initialFights={[]}
          initialError={message}
        />
      </Suspense>
    );
  }
}
