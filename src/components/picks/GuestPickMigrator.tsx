"use client";

import { useEffect, useRef } from "react";
import { migrateGuestPicksAction } from "@/app/actions/picks";
import { usesLiveSupabase } from "@/lib/config";
import {
  clearGuestPicks,
  getGuestPicks,
  GUEST_PICKS_CHANGED_EVENT,
  GUEST_PICKS_MIGRATED_EVENT,
} from "@/lib/picks/guestPickStore";
import { createClient } from "@/lib/supabase/client";

export function GuestPickMigrator() {
  const migratingRef = useRef(false);

  useEffect(() => {
    if (!usesLiveSupabase()) return;

    const migrate = async () => {
      if (migratingRef.current) return;

      const drafts = Object.values(getGuestPicks());
      if (drafts.length === 0) return;

      let supabase;
      try {
        supabase = createClient();
      } catch {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      migratingRef.current = true;
      try {
        const result = await migrateGuestPicksAction(drafts);
        if (result.ok && result.failed === 0) {
          clearGuestPicks();
          window.dispatchEvent(new CustomEvent(GUEST_PICKS_CHANGED_EVENT));
          if (result.migrated > 0) {
            window.dispatchEvent(new CustomEvent(GUEST_PICKS_MIGRATED_EVENT));
          }
        }
      } finally {
        migratingRef.current = false;
      }
    };

    void migrate();

    let supabase;
    try {
      supabase = createClient();
    } catch {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        void migrate();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
}
