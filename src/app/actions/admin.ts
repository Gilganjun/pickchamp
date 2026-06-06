"use server";

import {
  getMockEvents,
  getMockFights,
  getMockPredictions,
  getMockProfiles,
  mockEvents,
  mockFights,
  mockProfiles,
  mockResults,
} from "@/data/mock";
import {
  getAllDemoPredictions,
  updateDemoPrediction,
} from "@/lib/mock/demoPredictionStore";
import { requireAdminUser } from "@/lib/auth/admin";
import { usesLiveSupabase } from "@/lib/config";
import {
  applyRatingToProfile,
  gradePredictionsForFight,
} from "@/lib/grading/gradeFight";
import {
  parseFavouriteLevelFromForm,
  parseFavouriteSideFromForm,
  validateFavouriteFields,
} from "@/lib/rating/validateFavouriteFields";
import { createAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin";
import { mapFight, mapPrediction, mapProfile } from "@/lib/supabase/mappers";
import {
  fetchAllEvents,
  fetchAllFights,
  fetchAllProfiles,
} from "@/lib/data/supabase-fetch";
import type { Event, Fight, FightResult, ResultMethod, ResultOutcome } from "@/types";

async function assertAdminAccess() {
  const gate = await requireAdminUser();
  if (!usesLiveSupabase()) {
    return gate;
  }
  if (!gate.ok) {
    throw new Error(
      gate.reason === "unauthenticated" ? "LOGIN_REQUIRED" : "UNAUTHORIZED"
    );
  }
  return gate;
}

export async function createEvent(formData: FormData): Promise<void> {
  await assertAdminAccess();

  const event: Event = {
    id: `evt-${Date.now()}`,
    name: String(formData.get("name") ?? ""),
    promotion: (formData.get("promotion") as string) || null,
    location: (formData.get("location") as string) || null,
    timezone: (formData.get("timezone") as string) || null,
    event_date: String(formData.get("event_date") ?? new Date().toISOString()),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseAdminConfig()) {
    const admin = createAdminClient();
    const { error } = await admin.from("events").insert({
      name: event.name,
      promotion: event.promotion,
      location: event.location,
      timezone: event.timezone,
      event_date: event.event_date,
    });
    if (error) throw new Error(error.message);
    return;
  }

  mockEvents.push(event);
}

export async function createFight(formData: FormData): Promise<void> {
  await assertAdminAccess();

  const scheduledRounds = parseInt(String(formData.get("scheduled_rounds")), 10);
  if (!scheduledRounds || scheduledRounds < 1) {
    return;
  }

  const favouriteSide = parseFavouriteSideFromForm(
    String(formData.get("favourite_side") ?? "none")
  );
  const favouriteLevel = parseFavouriteLevelFromForm(
    String(formData.get("favourite_level") ?? "even")
  );
  const favValidation = validateFavouriteFields(favouriteSide, favouriteLevel);
  if (!favValidation.valid) {
    return;
  }

  const fight: Fight = {
    id: `fight-${Date.now()}`,
    event_id: String(formData.get("event_id")),
    sport: (formData.get("sport") as "boxing" | "mma") ?? "boxing",
    fighter_a_name: String(formData.get("fighter_a_name")),
    fighter_b_name: String(formData.get("fighter_b_name")),
    scheduled_rounds: scheduledRounds,
    weight_class: (formData.get("weight_class") as string) || null,
    fight_order: formData.get("fight_order")
      ? parseInt(String(formData.get("fight_order")), 10)
      : null,
    lock_time: String(formData.get("lock_time")),
    status: "upcoming",
    favourite_side: favouriteSide,
    favourite_level: favouriteLevel,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (hasSupabaseAdminConfig()) {
    const admin = createAdminClient();
    const { error } = await admin.from("fights").insert({
      event_id: fight.event_id,
      sport: fight.sport,
      fighter_a_name: fight.fighter_a_name,
      fighter_b_name: fight.fighter_b_name,
      scheduled_rounds: fight.scheduled_rounds,
      weight_class: fight.weight_class,
      fight_order: fight.fight_order,
      lock_time: fight.lock_time,
      status: fight.status,
      favourite_side: fight.favourite_side,
      favourite_level: fight.favourite_level,
    });
    if (error) throw new Error(error.message);
    return;
  }

  mockFights.push(fight);
}

export async function settleFight(formData: FormData) {
  await assertAdminAccess();

  const fightId = String(formData.get("fight_id"));
  const outcome = String(formData.get("outcome")) as ResultOutcome;
  const method = String(formData.get("method")) as ResultMethod;
  const resultRoundRaw = formData.get("result_round");
  const resultRound = resultRoundRaw
    ? parseInt(String(resultRoundRaw), 10)
    : null;

  if (hasSupabaseAdminConfig()) {
    const admin = createAdminClient();
    const { data: fightRow, error: fightError } = await admin
      .from("fights")
      .select("*")
      .eq("id", fightId)
      .single();
    if (fightError || !fightRow) {
      return { ok: false, error: "Fight not found" };
    }
    const fight = mapFight(fightRow);

    if (
      resultRound != null &&
      (resultRound < 1 || resultRound > fight.scheduled_rounds)
    ) {
      return {
        ok: false,
        error: `resultRound must be between 1 and ${fight.scheduled_rounds}`,
      };
    }

    const result: FightResult = {
      id: `res-${Date.now()}`,
      fight_id: fightId,
      outcome,
      method,
      result_round: resultRound,
      official_notes: (formData.get("official_notes") as string) || null,
      settled_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: resultError } = await admin.from("fight_results").upsert(
      {
        fight_id: fightId,
        outcome: result.outcome,
        method: result.method,
        result_round: result.result_round,
        official_notes: result.official_notes,
        settled_at: result.settled_at,
        updated_at: result.updated_at,
      },
      { onConflict: "fight_id" }
    );
    if (resultError) return { ok: false, error: resultError.message };

    const newStatus =
      outcome === "cancelled" || outcome === "no_contest"
        ? outcome
        : "settled";

    await admin
      .from("fights")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", fightId);

    const { data: predRows } = await admin
      .from("predictions")
      .select("*")
      .eq("fight_id", fightId);

    const predictions = (predRows ?? []).map((row) => mapPrediction(row));
    const { graded, summary } = gradePredictionsForFight(
      { ...fight, status: newStatus },
      result,
      predictions
    );

    for (const g of graded) {
      await admin
        .from("predictions")
        .update({
          graded_at: g.graded_at,
          rating_change: g.rating_change,
          main_correct: g.main_correct,
          method_correct: g.method_correct,
          round_correct: g.round_correct,
          perfect_pick: g.perfect_pick,
          grading_details: g.gradingDetails,
          updated_at: new Date().toISOString(),
        })
        .eq("id", g.id);

      if (g.rating_change != null) {
        const { data: profileRow } = await admin
          .from("profiles")
          .select("*")
          .eq("id", g.user_id)
          .single();
        if (profileRow) {
          const before = mapProfile(profileRow);
          const updatedProfile = applyRatingToProfile(
            before,
            fight.sport,
            g.rating_change,
            g.main_correct ?? false,
            g.perfect_pick ?? false
          );
          await admin
            .from("profiles")
            .update({
              global_rating: updatedProfile.global_rating,
              boxing_rating: updatedProfile.boxing_rating,
              mma_rating: updatedProfile.mma_rating,
              total_picks: updatedProfile.total_picks,
              total_correct: updatedProfile.total_correct,
              boxing_picks: updatedProfile.boxing_picks,
              boxing_correct: updatedProfile.boxing_correct,
              mma_picks: updatedProfile.mma_picks,
              mma_correct: updatedProfile.mma_correct,
              perfect_picks: updatedProfile.perfect_picks,
              current_streak: updatedProfile.current_streak,
              best_streak: updatedProfile.best_streak,
              updated_at: new Date().toISOString(),
            })
            .eq("id", g.user_id);

          await admin.from("rating_history").insert({
            user_id: g.user_id,
            fight_id: fightId,
            sport: fight.sport,
            old_global_rating: before.global_rating,
            new_global_rating: updatedProfile.global_rating,
            old_sport_rating:
              fight.sport === "boxing"
                ? before.boxing_rating
                : before.mma_rating,
            new_sport_rating:
              fight.sport === "boxing"
                ? updatedProfile.boxing_rating
                : updatedProfile.mma_rating,
            rating_change: g.rating_change,
            reason: g.gradingDetails,
          });
        }
      }
    }

    await admin.from("grading_runs").insert({
      fight_id: fightId,
      total_predictions: summary.totalPredictions,
      fighter_a_pick_count: summary.fighterAPickCount,
      fighter_b_pick_count: summary.fighterBPickCount,
      draw_pick_count: summary.drawPickCount,
      result_summary: summary,
    });

    return { ok: true, summary };
  }

  const fight = mockFights.find((f) => f.id === fightId);
  if (!fight) return { ok: false, error: "Fight not found" };

  if (
    resultRound != null &&
    (resultRound < 1 || resultRound > fight.scheduled_rounds)
  ) {
    return {
      ok: false,
      error: `resultRound must be between 1 and ${fight.scheduled_rounds}`,
    };
  }

  const result: FightResult = {
    id: `res-${Date.now()}`,
    fight_id: fightId,
    outcome,
    method,
    result_round: resultRound,
    official_notes: (formData.get("official_notes") as string) || null,
    settled_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const existingIdx = mockResults.findIndex((r) => r.fight_id === fightId);
  if (existingIdx >= 0) mockResults[existingIdx] = result;
  else mockResults.push(result);

  fight.status =
    outcome === "cancelled" || outcome === "no_contest"
      ? outcome
      : "settled";
  fight.updated_at = new Date().toISOString();

  const predictions = getAllDemoPredictions().filter(
    (p) => p.fight_id === fightId
  );
  const { graded, summary } = gradePredictionsForFight(
    fight,
    result,
    predictions
  );

  for (const g of graded) {
    updateDemoPrediction(g.id, {
      ...g,
      grading_details: g.gradingDetails,
    });
    const profileIdx = mockProfiles.findIndex((p) => p.id === g.user_id);
    if (profileIdx >= 0 && g.rating_change != null) {
      mockProfiles[profileIdx] = applyRatingToProfile(
        mockProfiles[profileIdx],
        fight.sport,
        g.rating_change,
        g.main_correct ?? false,
        g.perfect_pick ?? false
      );
    }
  }

  return { ok: true, summary };
}

export async function getAdminData() {
  await assertAdminAccess();

  if (usesLiveSupabase()) {
    const [events, fights, profiles] = await Promise.all([
      fetchAllEvents(),
      fetchAllFights(),
      fetchAllProfiles(),
    ]);
    const admin = hasSupabaseAdminConfig() ? createAdminClient() : null;
    const { data: predictions } = admin
      ? await admin.from("predictions").select("*")
      : { data: [] };

    return {
      events,
      fights,
      predictions: (predictions ?? []).map((row) => mapPrediction(row)),
      profiles,
    };
  }

  return {
    events: getMockEvents(),
    fights: getMockFights(),
    predictions: getMockPredictions(),
    profiles: getMockProfiles(),
  };
}
