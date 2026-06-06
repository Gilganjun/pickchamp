const AUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_callback_failed:
    "Google sign-in could not be completed. Please try again.",
  oauth_start_failed: "Could not start Google sign-in. Please try again.",
  oauth_missing_username:
    "Choose a username before continuing with Google sign-up.",
  oauth_cancelled: "Google sign-in was cancelled.",
};

export function getAuthErrorMessage(code: string | null): string | null {
  if (!code) return null;
  if (AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }
  try {
    return decodeURIComponent(code);
  } catch {
    return code;
  }
}
