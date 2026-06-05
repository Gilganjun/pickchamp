import { PicksClient } from "./PicksClient";
import { getAuthUser } from "@/lib/auth/session";
import { hasSupabaseConfig } from "@/lib/config";

export default async function PicksPage() {
  if (!hasSupabaseConfig()) {
    return <PicksClient initialIsLoggedIn />;
  }

  const user = await getAuthUser();
  return <PicksClient initialIsLoggedIn={Boolean(user)} />;
}
