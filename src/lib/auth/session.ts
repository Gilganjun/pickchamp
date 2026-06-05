import { hasSupabaseConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function getAuthUser() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
