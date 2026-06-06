import { describe, expect, it } from "vitest";
import {
  getCurrentPickItems,
  getProgress,
  getRecentFormOutcomes,
  getRecentFormSummary,
  hasHiddenOpenPicksOnPublicProfile,
  getSportPickStats,
} from "./display";
import type { Event, FightWithRelations, Profile, Prediction } from "@/types";

function makeFight(
  id: string,
  lockTime: string,
  status: FightWithRelations["status"] = "upcoming"
): FightWithRelations {
  const event: Event = {
    id: "evt-1",
    name: "Test Card",
    promotion: null,
    location: null,
    event_date: "2026-06-10T18:00:00Z",
    created_at: "",
    updated_at: "",
  };
  return {
    id,
    event_id: event.id,
    sport: "boxing",
    fighter_a_name: "Fighter A",
    fighter_b_name: "Fighter B",
    scheduled_rounds: 10,
    weight_class: null,
    fight_order: 1,
    lock_time: lockTime,
    status,
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: "",
    updated_at: "",
    event,
    result: null,
    userPrediction: null,
  };
}

function makePrediction(fightId: string, gradedAt: string | null): Prediction {
  return {
    id: `pred-${fightId}`,
    user_id: "u1",
    fight_id: fightId,
    predicted_outcome: "fighterA",
    predicted_method: null,
    predicted_round: null,
    created_at: "",
    updated_at: "",
    locked_at: null,
    graded_at: gradedAt,
    rating_change: null,
    main_correct: null,
    method_correct: null,
    round_correct: null,
    perfect_pick: null,
    grading_details: null,
  };
}

describe("getProgress", () => {
  it("computes percent and remaining picks", () => {
    expect(getProgress(7, 10)).toEqual({
      current: 7,
      required: 10,
      percent: 70,
      remaining: 3,
    });
  });
});

describe("getSportPickStats", () => {
  it("derives incorrect picks from graded total minus correct", () => {
    const profile = {
      boxing_picks: 18,
      boxing_correct: 11,
      mma_picks: 20,
      mma_correct: 11,
    } as Profile;
    expect(getSportPickStats(profile, "boxing")).toEqual({
      picks: 18,
      correct: 11,
      incorrect: 7,
      accuracy: 61.1,
    });
  });
});

describe("getRecentFormOutcomes", () => {
  it("orders graded predictions oldest-to-newest for display", () => {
    const predictions: Prediction[] = [
      {
        id: "a",
        user_id: "u",
        fight_id: "f1",
        predicted_outcome: "fighterA",
        predicted_method: null,
        predicted_round: null,
        created_at: "",
        updated_at: "",
        locked_at: null,
        graded_at: "2020-01-02",
        rating_change: 10,
        main_correct: false,
        method_correct: null,
        round_correct: null,
        perfect_pick: null,
        grading_details: null,
      },
      {
        id: "b",
        user_id: "u",
        fight_id: "f2",
        predicted_outcome: "fighterA",
        predicted_method: null,
        predicted_round: null,
        created_at: "",
        updated_at: "",
        locked_at: null,
        graded_at: "2020-01-03",
        rating_change: 10,
        main_correct: true,
        method_correct: null,
        round_correct: null,
        perfect_pick: null,
        grading_details: null,
      },
    ];
    expect(getRecentFormOutcomes(predictions, 10)).toEqual(["loss", "win"]);
  });
});

describe("getRecentFormSummary", () => {
  it("summarizes the most recent graded picks", () => {
    const predictions: Prediction[] = [
      makePrediction("f1", "2020-01-01"),
      makePrediction("f2", "2020-01-02"),
      makePrediction("f3", "2020-01-03"),
    ];
    predictions[0].main_correct = true;
    predictions[1].main_correct = false;
    predictions[2].main_correct = true;

    expect(getRecentFormSummary(predictions, 3)).toEqual({
      outcomes: ["win", "loss", "win"],
      wins: 2,
      losses: 1,
      label: "Last 3: 2–1",
    });
  });
});

describe("getCurrentPickItems", () => {
  const futureLock = "2099-06-10T18:00:00Z";
  const pastLock = "2020-01-01T18:00:00Z";

  it("returns ungraded active picks for own profile", () => {
    const fights = [
      makeFight("f-open", futureLock, "upcoming"),
      makeFight("f-settled", futureLock, "settled"),
    ];
    const predictions = [
      makePrediction("f-open", null),
      makePrediction("f-settled", null),
    ];

    const items = getCurrentPickItems(predictions, fights, {
      isOwnProfile: true,
    });
    expect(items).toHaveLength(1);
    expect(items[0].fight.id).toBe("f-open");
  });

  it("hides open picks on public profile before lock", () => {
    const fights = [
      makeFight("f-open", futureLock, "upcoming"),
      makeFight("f-locked", pastLock, "locked"),
    ];
    const predictions = [
      makePrediction("f-open", null),
      makePrediction("f-locked", null),
    ];

    const items = getCurrentPickItems(predictions, fights, {
      isOwnProfile: false,
    });
    expect(items).toHaveLength(1);
    expect(items[0].fight.id).toBe("f-locked");
  });

  it("detects hidden open picks on public profile", () => {
    const fights = [makeFight("f-open", futureLock, "upcoming")];
    const predictions = [makePrediction("f-open", null)];

    expect(
      hasHiddenOpenPicksOnPublicProfile(predictions, fights)
    ).toBe(true);
  });
});
