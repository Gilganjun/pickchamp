import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getAuthCookieOptions } from "@/lib/auth/rememberMe";
import { hasSupabaseConfig } from "@/lib/config";

type CreateClientOptions = {
  /** When true (default), auth cookies persist across browser restarts. */
  rememberMe?: boolean;
};

export async function createClient(options: CreateClientOptions = {}) {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase is not configured");
  }

  const rememberMe = options.rememberMe ?? true;
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: getAuthCookieOptions(rememberMe),
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — safe to ignore when middleware refreshes sessions.
          }
        },
      },
    }
  );
}
