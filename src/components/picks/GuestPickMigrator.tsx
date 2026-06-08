"use client";

import { useEffect, useRef } from "react";
import { migrateGuestPicksAction } from "@/app/actions/picks";
import { usesLiveSupabase } from "@/lib/config";
import {
  clearGuestPicks,
  getGuestPicks,
  GUEST_PICKS_CHANGED_EVENT,
  GUEST_PICKS_MIGRATED_EVENT,
  removeGuestPick,
} from "@/lib/picks/guestPickStore";
import { createClient } from "@/lib/supabase/client";

const MIGRATION_RETRY_DELAYS_MS = [250, 500, 1000, 1500, 2000];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyMigrationResult(result: {
  ok: true;
  migrated: number;
  failed: number;
  handledFightIds: string[];
}): void {
  for (const fightId of result.handledFightIds) {
    removeGuestPick(fightId);
  }

  if (result.failed === 0) {
    clearGuestPicks();
  }

  window.dispatchEvent(new CustomEvent(GUEST_PICKS_CHANGED_EVENT));
  if (result.migrated > 0) {
    window.dispatchEvent(new CustomEvent(GUEST_PICKS_MIGRATED_EVENT));
  }
}

export function GuestPickMigrator() {
  const migratingRef = useRef(false);

  useEffect(() => {
    if (!usesLiveSupabase()) return;

    let cancelled = false;

    const attemptMigrate = async (retryIndex = 0): Promise<void> => {
      if (cancelled || migratingRef.current) return;

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
        if (cancelled) return;

        if (!result.ok) {
          if (
            result.error === "LOGIN_REQUIRED" &&
            retryIndex < MIGRATION_RETRY_DELAYS_MS.length
          ) {
            await sleep(MIGRATION_RETRY_DELAYS_MS[retryIndex]);
            migratingRef.current = false;
            return attemptMigrate(retryIndex + 1);
          }
          return;
        }

        applyMigrationResult(result);
      } finally {
        migratingRef.current = false;
      }
    };

    let supabase;
    try {
      supabase = createClient();
    } catch {
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session?.user &&
        (event === "INITIAL_SESSION" ||
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED")
      ) {
        void attemptMigrate();
      }
    });

    void attemptMigrate();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
