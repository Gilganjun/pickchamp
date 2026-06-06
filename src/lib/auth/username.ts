const USERNAME_PATTERN = /^[a-z0-9_]{3,24}$/;

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);
  if (!normalized) return "Username is required.";
  if (!USERNAME_PATTERN.test(normalized)) {
    return "Username must be 3–24 characters (letters, numbers, underscore).";
  }
  return null;
}

/** Email local-part normalized to valid username candidate (trigger fallback). */
export function sanitizeEmailUsernameCandidate(email: string | undefined): string {
  const local = (email?.split("@")[0] ?? "").toLowerCase();
  const sanitized = local.replace(/[^a-z0-9_]/g, "").slice(0, 24);
  if (sanitized.length >= 3) return sanitized;
  return `user${sanitized}`.slice(0, 24) || "user";
}

export function profileNeedsUsernameOnboarding(
  user: {
    email?: string | null;
    user_metadata?: Record<string, unknown>;
  },
  profile: { username: string }
): boolean {
  const metaUsername = user.user_metadata?.username;
  if (
    typeof metaUsername === "string" &&
    validateUsername(metaUsername) === null
  ) {
    return false;
  }

  if (user.user_metadata?.profile_complete === true) {
    return false;
  }

  const autoCandidate = sanitizeEmailUsernameCandidate(
    user.email ?? undefined
  );
  return profile.username.toLowerCase() === autoCandidate;
}
