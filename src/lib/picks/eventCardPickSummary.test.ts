import { describe, expect, it } from "vitest";
import { summarizeEventCardPicks } from "@/lib/picks/eventCardPickSummary";
import type { Event, FightWithRelations, Prediction } from "@/types";

const event: Event = {
  id: "evt-1",
  name: "Test Card",
  promotion: "Test",
  location: null,
  event_date: "2026-06-06T18:00:00Z",
  created_at: "",
  updated_at: "",
};

function makeFight(
  id: string,
  order: number,
  prediction?: Partial<Prediction> | null,
  result?: FightWithRelations["result"]
): FightWithRelations {
  return {
    id,
    event_id: event.id,
    sport: "boxing",
    fighter_a_name: "Josh Padley",
    fighter_b_name: "Aqib Fiaz",
    scheduled_rounds: 12,
    weight_class: null,
    fight_order: order,
    lock_time: "2020-01-01T18:00:00Z",
    status: result ? "settled" : "locked",
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: "",
    updated_at: "",
    event,
    result: result ?? null,
    userPrediction: prediction
      ? {
          id: `pred-${id}`,
          user_id: "user-1",
          fight_id: id,
          predicted_outcome: "fighterA",
          predicted_method: "decision",
          predicted_round: null,
          created_at: "",
          updated_at: "",
          locked_at: null,
          graded_at: null,
          rating_change: null,
          main_correct: null,
          method_correct: null,
          round_correct: null,
          perfect_pick: null,
          grading_details: null,
          ...prediction,
        }
      : null,
  };
}

describe("summarizeEventCardPicks", () => {
  it("returns empty summary when user made no picks", () => {
    const summary = summarizeEventCardPicks([
      makeFight("f1", 1, null),
      makeFight("f2", 2, null),
    ]);
    expect(summary.picksMade).toBe(0);
    expect(summary.rows).toHaveLength(0);
  });

  it("counts graded wins, losses, and total points", () => {
    const summary = summarizeEventCardPicks([
      makeFight("f1", 1, {
        graded_at: "2026-06-07T00:00:00Z",
        main_correct: true,
        rating_change: 12,
      }),
      makeFight("f2", 2, {
        graded_at: "2026-06-07T00:00:00Z",
        main_correct: false,
        rating_change: -8,
      }),
      makeFight("f3", 3, { predicted_outcome: "fighterB" }),
    ]);

    expect(summary.picksMade).toBe(3);
    expect(summary.wins).toBe(1);
    expect(summary.losses).toBe(1);
    expect(summary.pending).toBe(1);
    expect(summary.totalPoints).toBe(4);
    expect(summary.hasScoredPicks).toBe(true);
  });
});
