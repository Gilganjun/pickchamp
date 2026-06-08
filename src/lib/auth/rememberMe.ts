import type { CookieOptions } from "@supabase/ssr";

/** Matches @supabase/ssr default persistent auth cookie lifetime (~400 days). */
export const STAY_SIGNED_IN_MAX_AGE_SECONDS = 400 * 24 * 60 * 60;

export function parseRememberMe(formData: FormData): boolean {
  return formData.get("rememberMe") === "on";
}

export function parseRememberMeParam(value: string | null): boolean {
  return value !== "0";
}

export function getAuthCookieOptions(rememberMe: boolean): CookieOptions {
  if (rememberMe) {
    return {
      path: "/",
      sameSite: "lax",
      maxAge: STAY_SIGNED_IN_MAX_AGE_SECONDS,
    };
  }

  // Session cookie — cleared when the browser closes.
  return {
    path: "/",
    sameSite: "lax",
  };
}
