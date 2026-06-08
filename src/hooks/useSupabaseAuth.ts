"use client";

import { usesLiveSupabase } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!usesLiveSupabase());

  useEffect(() => {
    if (!usesLiveSupabase()) return;

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setReady(true);
      return;
    }

    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    isLoggedIn: Boolean(user),
    ready,
  };
}
