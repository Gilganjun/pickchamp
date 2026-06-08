import { resolveOAuthCallbackPath, type OAuthFlow } from "@/lib/auth/oauth";
import { parseRememberMeParam } from "@/lib/auth/rememberMe";
import { hasSupabaseConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/picks";
  const flow = (searchParams.get("flow") ?? "login") as OAuthFlow;
  const pendingUsername = searchParams.get("pending_username");
  const rememberMe = parseRememberMeParam(searchParams.get("remember"));
  const oauthError = searchParams.get("error");

  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(`${origin}/login`);
  }

  if (oauthError) {
    const returnPath = flow === "signup" ? "/signup" : "/login";
    return NextResponse.redirect(
      `${origin}${returnPath}?error=${encodeURIComponent("Google sign-in was cancelled.")}`
    );
  }

  if (code) {
    const supabase = await createClient({ rememberMe });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const destination = await resolveOAuthCallbackPath(
          supabase,
          user,
          flow,
          next,
          pendingUsername
        );
        return NextResponse.redirect(`${origin}${destination}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
