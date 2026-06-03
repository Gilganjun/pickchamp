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
  mockPredictions,
} from "@/data/mock";
import {
  applyRatingToProfile,
  gradePredictionsForFight,
} from "@/lib/grading/gradeFight";
import {
  parseFavouriteLevelFromForm,
  parseFavouriteSideFromForm,
  validateFavouriteFields,
} from "@/lib/rating/validateFavouriteFields";
import type { Event, Fight, FightResult, ResultMethod, ResultOutcome } from "@/types";

// MVP admin: no auth gate in mock mode. Production uses is_admin + ADMIN_EMAILS.
const MOCK_ADMIN_ENABLED = true;

export async function createEvent(formData: FormData): Promise<void> {
  if (!MOCK_ADMIN_ENABLED) return;
  const event: Event = {
    id: `evt-${Date.now()}`,
    name: String(formData.get("name") ?? ""),
    promotion: (formData.get("promotion") as string) || null,
    location: (formData.get("location") as string) || null,
    event_date: String(formData.get("event_date") ?? new Date().toISOString()),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockEvents.push(event);
}

export async function createFight(formData: FormData): Promise<void> {
  if (!MOCK_ADMIN_ENABLED) return;
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
  mockFights.push(fight);
}

export async function settleFight(formData: FormData) {
  if (!MOCK_ADMIN_ENABLED) return { ok: false, error: "Unauthorized" };

  const fightId = String(formData.get("fight_id"));
  const outcome = String(formData.get("outcome")) as ResultOutcome;
  const method = String(formData.get("method")) as ResultMethod;
  const resultRoundRaw = formData.get("result_round");
  const resultRound = resultRoundRaw
    ? parseInt(String(resultRoundRaw), 10)
    : null;

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

  const predictions = mockPredictions.filter((p) => p.fight_id === fightId);
  const { graded, summary } = gradePredictionsForFight(
    fight,
    result,
    predictions
  );

  for (const g of graded) {
    const idx = mockPredictions.findIndex((p) => p.id === g.id);
    if (idx >= 0) {
      mockPredictions[idx] = {
        ...g,
        grading_details: g.gradingDetails,
      };
    }
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
  return {
    events: getMockEvents(),
    fights: getMockFights(),
    predictions: getMockPredictions(),
    profiles: getMockProfiles(),
  };
}
