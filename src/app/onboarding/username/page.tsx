import { redirect } from "next/navigation";
import { UsernameOnboardingForm } from "@/components/auth/UsernameOnboardingForm";
import { profileNeedsUsernameOnboarding } from "@/lib/auth/username";
import { usesLiveSupabase } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export default async function UsernameOnboardingPage() {
  if (!usesLiveSupabase()) {
    redirect("/picks");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (profile && !profileNeedsUsernameOnboarding(user, profile)) {
    redirect("/picks");
  }

  return <UsernameOnboardingForm />;
}
