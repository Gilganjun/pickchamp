import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFights, mockProfiles, mockResults, MOCK_USER_ID } from "@/data/mock";
import type { Prediction } from "@/types";

vi.mock("@/lib/config", () => ({
  usesLiveSupabase: () => false,
}));

const predictions: Prediction[] = [];

vi.mock("@/lib/mock/demoPredictionStore", () => ({
  getAllDemoPredictions: () => predictions,
  updateDemoPrediction: vi.fn((id: string, patch: Partial<Prediction>) => {
    const idx = predictions.findIndex((p) => p.id === id);
    if (idx >= 0) {
      predictions[idx] = { ...predictions[idx], ...patch };
    }
  }),
}));

import { syncDemoGradingForSettledFights } from "./syncDemoGrading";

describe("syncDemoGradingForSettledFights", () => {
  beforeEach(() => {
    predictions.length = 0;
    const profile = mockProfiles.find((p) => p.id === MOCK_USER_ID)!;
    profile.total_picks = 10;
    profile.total_correct = 5;
    profile.mma_picks = 6;
    profile.mma_correct = 3;
    profile.global_rating = 1000;
    profile.mma_rating = 1000;
    profile.current_streak = 1;
  });

  it("grades ungraded predictions when a mock fight result exists", () => {
    const fight = mockFights.find((f) => f.id === "fight-009")!;
    const result = mockResults.find((r) => r.fight_id === fight.id)!;

    predictions.push({
      id: "pred-test-1",
      user_id: MOCK_USER_ID,
      fight_id: fight.id,
      predicted_outcome: "fighterB",
      predicted_method: "decision",
      predicted_round: null,
      created_at: "2026-06-05T00:00:00.000Z",
      updated_at: "2026-06-05T00:00:00.000Z",
      locked_at: null,
      graded_at: null,
      rating_change: null,
      main_correct: null,
      method_correct: null,
      round_correct: null,
      perfect_pick: null,
      grading_details: null,
    });

    syncDemoGradingForSettledFights();

    expect(predictions[0].graded_at).not.toBeNull();
    expect(predictions[0].main_correct).toBe(true);
    expect(predictions[0].rating_change).not.toBeNull();

    const profile = mockProfiles.find((p) => p.id === MOCK_USER_ID)!;
    expect(profile.total_picks).toBe(11);
    expect(profile.total_correct).toBe(6);
    expect(profile.mma_picks).toBe(7);
    expect(profile.mma_correct).toBe(4);
    expect(profile.global_rating).toBeGreaterThan(1000);

    expect(result.outcome).toBe("fighterB");
  });
});
