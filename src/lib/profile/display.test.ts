import { describe, expect, it } from "vitest";
import {
  formatPicksToQualifyLabel,
  getCurrentPickItems,
  getGlobalRankHeroState,
  getLockedPickCount,
  getLockedPickCountForSport,
  getProgress,
  getRecentFormOutcomes,
  getRecentFormSummary,
  getSportRankHeroState,
  getWorldRankingLabel,
  hasHiddenOpenPicksOnPublicProfile,
  getSportPickStats,
} from "./display";
import type { RankDisplay } from "@/types";
import type { Event, FightWithRelations, Profile, Prediction } from "@/types";

function makeFight(
  id: string,
  lockTime: string,
  status: FightWithRelations["status"] = "upcoming",
  sport: FightWithRelations["sport"] = "boxing"
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
    sport,
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

describe("formatPicksToQualifyLabel", () => {
  it("uses singular pick when one remains", () => {
    expect(formatPicksToQualifyLabel(1)).toBe("1 PICK TO GO");
  });

  it("uses plural picks otherwise", () => {
    expect(formatPicksToQualifyLabel(10)).toBe("10 PICKS TO GO");
    expect(formatPicksToQualifyLabel(3)).toBe("3 PICKS TO GO");
  });
});

describe("getLockedPickCount", () => {
  const futureLock = "2099-06-10T18:00:00Z";
  const pastLock = "2020-01-01T18:00:00Z";

  it("counts predictions on locked fights only", () => {
    const fights = [
      makeFight("f-open", futureLock, "upcoming"),
      makeFight("f-locked", pastLock, "locked"),
      makeFight("f-settled", pastLock, "settled"),
    ];
    const predictions = [
      makePrediction("f-open", null),
      makePrediction("f-locked", null),
      makePrediction("f-settled", "2020-01-02"),
    ];

    expect(getLockedPickCount(predictions, fights)).toBe(2);
  });
});

describe("getLockedPickCountForSport", () => {
  const pastLock = "2020-01-01T18:00:00Z";

  it("counts locked picks for one sport only", () => {
    const fights = [
      makeFight("f-box-locked", pastLock, "locked", "boxing"),
      makeFight("f-mma-locked", pastLock, "locked", "mma"),
      makeFight("f-box-open", "2099-01-01T18:00:00Z", "upcoming", "boxing"),
    ];
    const predictions = [
      makePrediction("f-box-locked", null),
      makePrediction("f-mma-locked", null),
      makePrediction("f-box-open", null),
    ];

    expect(getLockedPickCountForSport(predictions, fights, "boxing")).toBe(1);
    expect(getLockedPickCountForSport(predictions, fights, "mma")).toBe(1);
  });
});

describe("getSportRankHeroState", () => {
  const officialRank: RankDisplay = {
    label: "#17 Boxing",
    status: "official",
    rank: 17,
  };
  const provisionalRank: RankDisplay = {
    label: "Not Yet Qualified",
    status: "provisional",
  };

  it("uses locked picks for sport qualification display", () => {
    expect(getSportRankHeroState("boxing", 0, provisionalRank)).toEqual({
      kind: "needs_locked",
      remaining: 5,
    });
    expect(getSportRankHeroState("boxing", 3, provisionalRank)).toEqual({
      kind: "needs_locked",
      remaining: 2,
    });
    expect(getSportRankHeroState("boxing", 5, provisionalRank)).toEqual({
      kind: "waiting_results",
    });
    expect(getSportRankHeroState("mma", 6, provisionalRank)).toEqual({
      kind: "waiting_results",
    });
    expect(getSportRankHeroState("boxing", 5, officialRank)).toEqual({
      kind: "official",
      rank: 17,
    });
  });
});

describe("getWorldRankingLabel", () => {
  it("uses explicit labels on profile", () => {
    expect(getWorldRankingLabel("global", "profile")).toBe(
      "Global World Ranking"
    );
    expect(getWorldRankingLabel("boxing", "profile")).toBe(
      "Boxing World Ranking"
    );
    expect(getWorldRankingLabel("mma", "profile")).toBe("MMA World Ranking");
  });

  it("omits sport labels on leaderboard tabs with context", () => {
    expect(getWorldRankingLabel("boxing", "leaderboard")).toBe("");
    expect(getWorldRankingLabel("global", "leaderboard")).toBe(
      "Global World Ranking"
    );
  });
});

describe("getGlobalRankHeroState", () => {
  const officialRank: RankDisplay = {
    label: "#412 World",
    status: "official",
    rank: 412,
  };
  const provisionalRank: RankDisplay = {
    label: "Not Yet Qualified",
    status: "provisional",
  };
  const inactiveRank: RankDisplay = {
    label: "Not Yet Qualified",
    status: "inactive",
  };

  it("shows picks remaining when fewer than 10 locked picks", () => {
    expect(getGlobalRankHeroState(0, inactiveRank)).toEqual({
      kind: "needs_locked",
      remaining: 10,
    });
    expect(getGlobalRankHeroState(7, provisionalRank)).toEqual({
      kind: "needs_locked",
      remaining: 3,
    });
  });

  it("shows waiting when locked threshold met but not officially ranked", () => {
    expect(getGlobalRankHeroState(10, provisionalRank)).toEqual({
      kind: "waiting_results",
    });
    expect(getGlobalRankHeroState(12, inactiveRank)).toEqual({
      kind: "waiting_results",
    });
  });

  it("shows official rank when on the leaderboard", () => {
    expect(getGlobalRankHeroState(10, officialRank)).toEqual({
      kind: "official",
      rank: 412,
    });
  });
});

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
