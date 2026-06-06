"use server";

import { usesLiveSupabase } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type AuthActionResult =
  | { ok: true; needsEmailConfirmation?: boolean }
  | { ok: false; error: string };

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);
  if (!normalized) return "Username is required.";
  if (!/^[a-z0-9_]{3,24}$/.test(normalized)) {
    return "Username must be 3–24 characters (letters, numbers, underscore).";
  }
  return null;
}

async function ensureProfileExists(userId: string, username: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) return;

  const initials = username.slice(0, 2).toUpperCase();
  await supabase.from("profiles").upsert(
    {
      id: userId,
      username,
      avatar_initials: initials,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );
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

  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalizedUsername)
    .maybeSingle();

  if (taken) {
    return { ok: false, error: "Username is already taken." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username: normalizedUsername },
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

export async function signOutAction(): Promise<void> {
  if (!usesLiveSupabase()) {
    redirect("/");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/picks");
}
