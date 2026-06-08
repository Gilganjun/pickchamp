"use server";

import { revalidatePath } from "next/cache";
import { MOCK_USER_ID } from "@/data/mock";
import { getAuthUser } from "@/lib/auth/session";
import { usesLiveSupabase } from "@/lib/config";
import { fetchFightsByIds } from "@/lib/data/supabase-fetch";
import {
  getEventsForPicks,
  getFightsForPicks,
  savePrediction,
  type EventCardFilter,
} from "@/lib/data/fights";
import type { GuestPickDraft } from "@/lib/picks/guestPickStore";
import { isFightLocked } from "@/lib/utils";
import type { SportFilter } from "@/types";

export async function loadPicksPageDataAction(
  sport: SportFilter,
  eventCard: EventCardFilter
) {
  try {
    const user = await getAuthUser();
    const demoMode = !usesLiveSupabase();
    const userId = demoMode ? MOCK_USER_ID : user?.id;

    const [events, fights] = await Promise.all([
      getEventsForPicks(sport, userId),
      getFightsForPicks(sport, userId, eventCard),
    ]);

    return {
      ok: true as const,
      events,
      fights,
      userId: userId ?? null,
      isLoggedIn: demoMode || Boolean(userId),
    };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : "Failed to load fight cards.",
      events: [],
      fights: [],
      userId: null,
      isLoggedIn: false,
    };
  }
}

export async function savePredictionAction(input: {
  fightId: string;
  predictedOutcome: Parameters<typeof savePrediction>[0]["predictedOutcome"];
  predictedMethod: Parameters<typeof savePrediction>[0]["predictedMethod"];
  predictedRound: number | null;
  scheduledRounds: number;
  sport: "boxing" | "mma";
  isLocked: boolean;
}) {
  const demoMode = !usesLiveSupabase();
  const user = demoMode ? null : await getAuthUser();
  const userId = demoMode ? MOCK_USER_ID : user?.id;
  if (!userId) {
    return { ok: false as const, error: "LOGIN_REQUIRED" };
  }

  const result = await savePrediction({
    userId,
    fightId: input.fightId,
    predictedOutcome: input.predictedOutcome,
    predictedMethod: input.predictedMethod,
    predictedRound: input.predictedRound,
    scheduledRounds: input.scheduledRounds,
    sport: input.sport,
    isLocked: input.isLocked,
  });

  if (result.ok) {
    revalidatePath("/profile", "layout");
  }

  return result;
}

export async function getSyncedGuestPickFightIdsAction(fightIds: string[]) {
  if (!usesLiveSupabase()) {
    return { ok: false as const, error: "NOT_AVAILABLE" };
  }

  const user = await getAuthUser();
  if (!user?.id) {
    return { ok: false as const, error: "LOGIN_REQUIRED" };
  }

  if (fightIds.length === 0) {
    return { ok: true as const, syncedFightIds: [] as string[] };
  }

  const uniqueFightIds = [...new Set(fightIds)];
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("predictions")
    .select("fight_id")
    .eq("user_id", user.id)
    .in("fight_id", uniqueFightIds);

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return {
    ok: true as const,
    syncedFightIds: (data ?? []).map((row) => row.fight_id as string),
  };
}

export async function migrateGuestPicksAction(drafts: GuestPickDraft[]) {
  if (!usesLiveSupabase()) {
    return { ok: false as const, error: "NOT_AVAILABLE" };
  }

  const user = await getAuthUser();
  if (!user?.id) {
    return { ok: false as const, error: "LOGIN_REQUIRED" };
  }

  if (drafts.length === 0) {
    return {
      ok: true as const,
      migrated: 0,
      skipped: 0,
      locked: 0,
      missing: 0,
      failed: 0,
      handledFightIds: [] as string[],
    };
  }

  const fightIds = [...new Set(drafts.map((draft) => draft.fight_id))];
  const fights = await fetchFightsByIds(fightIds);
  const fightById = new Map(fights.map((fight) => [fight.id, fight]));

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: existingRows, error: existingError } = await supabase
    .from("predictions")
    .select("fight_id, updated_at")
    .eq("user_id", user.id)
    .in("fight_id", fightIds);

  if (existingError) {
    return { ok: false as const, error: existingError.message };
  }

  const existingByFightId = new Map(
    (existingRows ?? []).map((row) => [row.fight_id as string, row])
  );

  let migrated = 0;
  let skipped = 0;
  let locked = 0;
  let missing = 0;
  let failed = 0;
  const handledFightIds: string[] = [];

  for (const draft of drafts) {
    const fight = fightById.get(draft.fight_id);
    if (!fight) {
      missing += 1;
      handledFightIds.push(draft.fight_id);
      continue;
    }

    if (isFightLocked(fight)) {
      locked += 1;
      handledFightIds.push(draft.fight_id);
      continue;
    }

    if (existingByFightId.has(draft.fight_id)) {
      skipped += 1;
      handledFightIds.push(draft.fight_id);
      continue;
    }

    const result = await savePrediction({
      userId: user.id,
      fightId: draft.fight_id,
      predictedOutcome: draft.predicted_outcome,
      predictedMethod: draft.predicted_method,
      predictedRound: draft.predicted_round,
      scheduledRounds: fight.scheduled_rounds,
      sport: fight.sport,
      isLocked: false,
    });

    if (result.ok) {
      migrated += 1;
      handledFightIds.push(draft.fight_id);
      existingByFightId.set(draft.fight_id, {
        fight_id: draft.fight_id,
        updated_at: draft.updated_at,
      });
    } else {
      failed += 1;
    }
  }

  if (migrated > 0) {
    revalidatePath("/picks");
    revalidatePath("/profile", "layout");
  }

  return {
    ok: true as const,
    migrated,
    skipped,
    locked,
    missing,
    failed,
    handledFightIds,
  };
}
