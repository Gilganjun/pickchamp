"use server";

import {
  buildOAuthCallbackUrl,
  isUsernameAvailable,
} from "@/lib/auth/oauth";
import { getSiteOrigin } from "@/lib/auth/site";
import {
  normalizeUsername,
  validateUsername,
} from "@/lib/auth/username";
import { usesLiveSupabase } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthActionResult =
  | { ok: true; needsEmailConfirmation?: boolean }
  | { ok: false; error: string };

async function ensureProfileExists(userId: string, username: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return;

  const normalized = normalizeUsername(username);
  const initials = normalized.slice(0, 2).toUpperCase();
  await supabase.from("profiles").upsert(
    {
      id: userId,
      username: normalized,
      avatar_initials: initials,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );
}

function demoModeRedirect(path: string): never {
  redirect(`${path}?error=${encodeURIComponent("Local demo mode — use /profile and /picks without logging in.")}`);
}

export async function signUpAction(formData: FormData): Promise<AuthActionResult> {
  if (!usesLiveSupabase()) {
    return {
      ok: false,
      error: "Local demo mode — use /profile and /picks without logging in.",
    };
  }

  const username = String(formData.get("username") ?? "");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const usernameError = validateUsername(username);
  if (usernameError) return { ok: false, error: usernameError };
  if (!email) return { ok: false, error: "Email is required." };
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const normalizedUsername = normalizeUsername(username);
  const supabase = await createClient();

  const available = await isUsernameAvailable(supabase, normalizedUsername);
  if (!available) {
    return { ok: false, error: "Username is already taken." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: normalizedUsername, profile_complete: true },
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (data.user) {
    await ensureProfileExists(data.user.id, normalizedUsername);
  }

  if (data.session) {
    redirect("/picks");
  }

  return {
    ok: true,
    needsEmailConfirmation: true,
  };
}

export async function signInAction(formData: FormData): Promise<AuthActionResult> {
  if (!usesLiveSupabase()) {
    return {
      ok: false,
      error: "Local demo mode — use /profile and /picks without logging in.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email) return { ok: false, error: "Email is required." };
  if (!password) return { ok: false, error: "Password is required." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (data.user) {
    const username =
      (data.user.user_metadata?.username as string | undefined) ??
      email.split("@")[0];
    await ensureProfileExists(data.user.id, username);
  }

  redirect("/picks");
}

export async function signInWithGoogleSignupAction(
  formData: FormData
): Promise<void> {
  if (!usesLiveSupabase()) {
    demoModeRedirect("/signup");
  }

  const username = String(formData.get("username") ?? "");
  const usernameError = validateUsername(username);
  if (usernameError) {
    redirect(`/signup?error=${encodeURIComponent(usernameError)}`);
  }

  const normalizedUsername = normalizeUsername(username);
  const supabase = await createClient();
  const available = await isUsernameAvailable(supabase, normalizedUsername);
  if (!available) {
    redirect(
      `/signup?error=${encodeURIComponent("Username is already taken.")}`
    );
  }

  const origin = await getSiteOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: buildOAuthCallbackUrl(
        origin,
        "signup",
        "/picks",
        normalizedUsername
      ),
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    redirect("/signup?error=oauth_start_failed");
  }

  redirect(data.url);
}

export async function signInWithGoogleLoginAction(): Promise<void> {
  if (!usesLiveSupabase()) {
    demoModeRedirect("/login");
  }

  const supabase = await createClient();
  const origin = await getSiteOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: buildOAuthCallbackUrl(origin, "login"),
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth_start_failed");
  }

  redirect(data.url);
}

export async function completeUsernameOnboardingAction(
  formData: FormData
): Promise<AuthActionResult> {
  if (!usesLiveSupabase()) {
    return {
      ok: false,
      error: "Local demo mode — use /profile and /picks without logging in.",
    };
  }

  const username = String(formData.get("username") ?? "");
  const usernameError = validateUsername(username);
  if (usernameError) return { ok: false, error: usernameError };

  const normalizedUsername = normalizeUsername(username);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be signed in to choose a username." };
  }

  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalizedUsername)
    .neq("id", user.id)
    .maybeSingle();

  if (taken) {
    return { ok: false, error: "Username is already taken." };
  }

  const initials = normalizedUsername.slice(0, 2).toUpperCase();
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: normalizedUsername,
        avatar_initials: initials,
      })
      .eq("id", user.id);

    if (updateError) {
      return { ok: false, error: updateError.message };
    }
  } else {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      username: normalizedUsername,
      avatar_initials: initials,
    });

    if (insertError) {
      return { ok: false, error: insertError.message };
    }
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      username: normalizedUsername,
      profile_complete: true,
      oauth_flow: "signup",
    },
  });

  if (metadataError) {
    return { ok: false, error: metadataError.message };
  }

  redirect("/picks");
}

export async function signOutAction(): Promise<void> {
  if (!usesLiveSupabase()) {
    redirect("/picks");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/picks");
}
