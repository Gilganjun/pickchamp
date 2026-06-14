function isValidEnvValue(value: string | undefined): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.includes("your-") || trimmed.includes("example.com")) return false;
  return true;
}

export function hasSupabaseConfig(): boolean {
  return (
    isValidEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    isValidEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

/**
 * Whether the app should use Supabase for auth + data.
 * Production: when env vars are set.
 * Local dev: mock data by default — set PICKFIST_USE_SUPABASE=true to test live Supabase.
 */
export function usesLiveSupabase(): boolean {
  if (!hasSupabaseConfig()) return false;
  if (process.env.NODE_ENV === "production") return true;
  return process.env.PICKFIST_USE_SUPABASE === "true";
}

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Bootstrap leaderboard seeds — opt-in only (PICKFIST_SEED_RANKINGS=true).
 * Set explicitly on Vercel Production. Changing on Vercel requires a redeploy.
 */
export function seedRankingsEnabled(): boolean {
  return process.env.PICKFIST_SEED_RANKINGS === "true";
}

const DEFAULT_SEED_RANKINGS_TARGET = 10;

export function getSeedRankingsTarget(): number {
  const raw = process.env.PICKFIST_SEED_RANKINGS_TARGET?.trim();
  if (!raw) return DEFAULT_SEED_RANKINGS_TARGET;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_SEED_RANKINGS_TARGET;
  return parsed;
}
