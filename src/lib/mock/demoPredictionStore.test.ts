import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOCK_USER_ID } from "@/data/mock";

vi.mock("@/lib/config", () => ({
  usesLiveSupabase: () => false,
}));

import {
  clearDemoPredictions,
  getDemoPredictionsForUser,
  upsertDemoPrediction,
} from "./demoPredictionStore";

beforeEach(() => {
  clearDemoPredictions();
});

afterEach(() => {
  clearDemoPredictions();
});

describe("demoPredictionStore", () => {
  it("persists demo picks in memory for the mock user", () => {
    upsertDemoPrediction({
      user_id: MOCK_USER_ID,
      fight_id: "fight-001",
      predicted_outcome: "fighterA",
      predicted_method: "decision",
      predicted_round: null,
      locked_at: null,
      graded_at: null,
      rating_change: null,
      main_correct: null,
      method_correct: null,
      round_correct: null,
      perfect_pick: null,
      grading_details: null,
    });

    const picks = getDemoPredictionsForUser(MOCK_USER_ID);
    expect(picks).toHaveLength(1);
    expect(picks[0].fight_id).toBe("fight-001");
    expect(picks[0].predicted_outcome).toBe("fighterA");
  });

  it("updates an existing demo pick for the same fight", () => {
    upsertDemoPrediction({
      user_id: MOCK_USER_ID,
      fight_id: "fight-002",
      predicted_outcome: "fighterA",
      predicted_method: null,
      predicted_round: null,
      locked_at: null,
      graded_at: null,
      rating_change: null,
      main_correct: null,
      method_correct: null,
      round_correct: null,
      perfect_pick: null,
      grading_details: null,
    });

    upsertDemoPrediction({
      user_id: MOCK_USER_ID,
      fight_id: "fight-002",
      predicted_outcome: "fighterB",
      predicted_method: "ko_tko",
      predicted_round: 3,
      locked_at: null,
      graded_at: null,
      rating_change: null,
      main_correct: null,
      method_correct: null,
      round_correct: null,
      perfect_pick: null,
      grading_details: null,
    });

    const picks = getDemoPredictionsForUser(MOCK_USER_ID);
    expect(picks).toHaveLength(1);
    expect(picks[0].predicted_outcome).toBe("fighterB");
    expect(picks[0].predicted_method).toBe("ko_tko");
    expect(picks[0].predicted_round).toBe(3);
  });
});
