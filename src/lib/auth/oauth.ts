import type { SupabaseClient } from "@supabase/supabase-js";
import {
  normalizeUsername,
  profileNeedsUsernameOnboarding,
  validateUsername,
} from "@/lib/auth/username";

export type OAuthFlow = "signup" | "login";

export function buildOAuthCallbackUrl(
  origin: string,
  flow: OAuthFlow,
  next = "/picks",
  pendingUsername?: string,
  rememberMe = true
): string {
  const params = new URLSearchParams({ flow, next });
  if (pendingUsername) {
    params.set("pending_username", pendingUsername);
  }
  if (!rememberMe) {
    params.set("remember", "0");
  }
  return `${origin}/auth/callback?${params.toString()}`;
}

export async function isUsernameAvailable(
  supabase: SupabaseClient,
  username: string
): Promise<boolean> {
  const normalized = normalizeUsername(username);
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalized)
    .maybeSingle();
  return !data;
}

async function ensureProfileFallback(
  supabase: SupabaseClient,
  userId: string,
  username: string
): Promise<void> {
  const normalized = normalizeUsername(username);
  const initials = normalized.slice(0, 2).toUpperCase();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("profiles")
      .update({ username: normalized, avatar_initials: initials })
      .eq("id", userId);
    return;
  }

  await supabase.from("profiles").upsert(
    {
      id: userId,
      username: normalized,
      avatar_initials: initials,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );
}

export async function resolveOAuthCallbackPath(
  supabase: SupabaseClient,
  user: {
    id: string;
    email?: string | null;
    user_metadata?: Record<string, unknown>;
  },
  flow: OAuthFlow,
  next: string,
  pendingUsername?: string | null
): Promise<string> {
  const metaUsername = user.user_metadata?.username;
  const normalizedMetaUsername =
    typeof metaUsername === "string" ? normalizeUsername(metaUsername) : null;

  if (flow === "signup") {
    const signupUsername = pendingUsername
      ? normalizeUsername(pendingUsername)
      : normalizedMetaUsername;

    if (!signupUsername || validateUsername(signupUsername)) {
      return "/signup?error=oauth_missing_username";
    }

    await supabase.auth.updateUser({
      data: {
        username: signupUsername,
        oauth_flow: "signup",
        profile_complete: true,
      },
    });

    // Trigger may have created an email-prefix profile; enforce chosen username.
    await ensureProfileFallback(supabase, user.id, signupUsername);
    return next;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return "/onboarding/username";
  }

  if (profileNeedsUsernameOnboarding(user, profile)) {
    return "/onboarding/username";
  }

  if (
    normalizedMetaUsername &&
    validateUsername(normalizedMetaUsername) === null
  ) {
    await ensureProfileFallback(supabase, user.id, normalizedMetaUsername);
  }

  return next;
}
