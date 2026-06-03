import { describe, expect, it } from "vitest";
import {
  getPredictorTitle,
  getProgress,
  getRecentFormOutcomes,
  getSportPickStats,
} from "./display";
import type { Profile } from "@/types";
import type { Prediction } from "@/types";

describe("getPredictorTitle", () => {
  it("maps rating bands to display titles", () => {
    expect(getPredictorTitle(900)).toBe("Rookie Predictor");
    expect(getPredictorTitle(1042)).toBe("Rising Predictor");
    expect(getPredictorTitle(1200)).toBe("Sharp Fan");
    expect(getPredictorTitle(1300)).toBe("Fight Analyst");
    expect(getPredictorTitle(1500)).toBe("Elite Predictor");
  });
});

describe("getProgress", () => {
  it("computes percent and remaining picks", () => {
    expect(getProgress(38, 50)).toEqual({
      current: 38,
      required: 50,
      percent: 76,
      remaining: 12,
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
