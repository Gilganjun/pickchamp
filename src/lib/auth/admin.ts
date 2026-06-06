import { getAdminEmails, usesLiveSupabase } from "@/lib/config";
import { getAuthUser } from "@/lib/auth/session";

export async function requireAdminUser() {
  if (!usesLiveSupabase()) {
    return { ok: true as const, email: null, mockMode: true };
  }

  const user = await getAuthUser();
  if (!user) {
    return { ok: false as const, reason: "unauthenticated" as const };
  }

  const email = user.email?.toLowerCase() ?? "";
  const allowed = getAdminEmails();

  if (!email || !allowed.includes(email)) {
    return { ok: false as const, reason: "unauthorized" as const, email };
  }

  return { ok: true as const, email, mockMode: false };
}
