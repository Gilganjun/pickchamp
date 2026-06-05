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

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}
