import { PicksClient } from "./PicksClient";
import { getAuthUser } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/config";
import { getEventsForPicks, getFightsForPicks } from "@/lib/data/fights";

export const dynamic = "force-dynamic";

export default async function PicksPage() {
  const useSupabase = hasSupabaseConfig();
  const user = useSupabase ? await getAuthUser() : null;
  const userId = user?.id;
  const isLoggedIn = useSupabase ? Boolean(user) : true;

  try {
    const [events, fights] = await Promise.all([
      getEventsForPicks("all", userId),
      getFightsForPicks("all", userId, "all"),
    ]);

    return (
      <PicksClient
        initialIsLoggedIn={isLoggedIn}
        initialEvents={events}
        initialFights={fights}
      />
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to load fights.";
    return (
      <PicksClient
        initialIsLoggedIn={isLoggedIn}
        initialEvents={[]}
        initialFights={[]}
        initialError={message}
      />
    );
  }
}
