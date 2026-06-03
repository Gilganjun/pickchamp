import { describe, expect, it } from "vitest";
import { calculateRatingChange } from "./calculateRatingChange";
import { getEffectivePickTier } from "./getEffectivePickTier";
import { validatePrediction } from "./validatePrediction";

const emptyPopularity = { fighterA: 0, fighterB: 0, draw: 0 };

function calc(
  overrides: Partial<Parameters<typeof calculateRatingChange>[0]> = {}
) {
  return calculateRatingChange({
    predictedOutcome: "fighterA",
    predictedMethod: null,
    predictedRound: null,
    resultOutcome: "fighterA",
    resultMethod: "decision",
    resultRound: null,
    scheduledRounds: 12,
    favouriteSide: "none",
    favouriteLevel: "even",
    popularity: emptyPopularity,
    fightStatus: "settled",
    ...overrides,
  });
}

describe("getEffectivePickTier", () => {
  it("maps draw pick to draw tier", () => {
    expect(
      getEffectivePickTier({
        predictedOutcome: "draw",
        favouriteSide: "none",
        favouriteLevel: "even",
      })
    ).toBe("draw");
  });

  it("maps even fight winner to even", () => {
    expect(
      getEffectivePickTier({
        predictedOutcome: "fighterA",
        favouriteSide: "none",
        favouriteLevel: "even",
      })
    ).toBe("even");
  });

  it("maps heavy fav side pick to heavy_favourite", () => {
    expect(
      getEffectivePickTier({
        predictedOutcome: "fighterA",
        favouriteSide: "fighterA",
        favouriteLevel: "heavy_favourite",
      })
    ).toBe("heavy_favourite");
  });

  it("maps heavy fav opponent to heavy_underdog", () => {
    expect(
      getEffectivePickTier({
        predictedOutcome: "fighterB",
        favouriteSide: "fighterA",
        favouriteLevel: "heavy_favourite",
      })
    ).toBe("heavy_underdog");
  });
});

describe("calculateRatingChange V2", () => {
  it("1. even fight — winner correct +15", () => {
    const r = calc({
      favouriteSide: "none",
      favouriteLevel: "even",
      predictedOutcome: "fighterA",
      resultOutcome: "fighterA",
    });
    expect(r.details.baseTierScore).toBe(15);
    expect(r.ratingChange).toBe(15);
    expect(r.details.effectiveTier).toBe("even");
  });

  it("2. favourite fight — favourite pick correct +10", () => {
    const r = calc({
      favouriteSide: "fighterA",
      favouriteLevel: "favourite",
      predictedOutcome: "fighterA",
      resultOutcome: "fighterA",
    });
    expect(r.details.baseTierScore).toBe(10);
    expect(r.ratingChange).toBe(10);
  });

  it("3. favourite fight — underdog pick correct +25", () => {
    const r = calc({
      favouriteSide: "fighterA",
      favouriteLevel: "favourite",
      predictedOutcome: "fighterB",
      resultOutcome: "fighterB",
    });
    expect(r.details.baseTierScore).toBe(25);
    expect(r.ratingChange).toBe(25);
    expect(r.details.effectiveTier).toBe("underdog");
  });

  it("4. heavy favourite — fav pick correct +5", () => {
    const r = calc({
      favouriteSide: "fighterA",
      favouriteLevel: "heavy_favourite",
      predictedOutcome: "fighterA",
      resultOutcome: "fighterA",
    });
    expect(r.details.baseTierScore).toBe(5);
    expect(r.ratingChange).toBe(5);
  });

  it("5. heavy favourite — underdog pick correct +40", () => {
    const r = calc({
      favouriteSide: "fighterA",
      favouriteLevel: "heavy_favourite",
      predictedOutcome: "fighterB",
      resultOutcome: "fighterB",
    });
    expect(r.details.baseTierScore).toBe(40);
    expect(r.ratingChange).toBe(40);
  });

  it("6. heavy favourite wrong -15", () => {
    const r = calc({
      favouriteSide: "fighterA",
      favouriteLevel: "heavy_favourite",
      predictedOutcome: "fighterA",
      resultOutcome: "fighterB",
    });
    expect(r.ratingChange).toBe(-15);
    expect(r.details.methodAdjustment).toBe(0);
  });

  it("7. heavy underdog wrong -8", () => {
    const r = calc({
      favouriteSide: "fighterA",
      favouriteLevel: "heavy_favourite",
      predictedOutcome: "fighterB",
      resultOutcome: "fighterA",
    });
    expect(r.ratingChange).toBe(-8);
    expect(r.details.effectiveTier).toBe("heavy_underdog");
  });

  it("8. draw correct +20", () => {
    const r = calc({
      predictedOutcome: "draw",
      resultOutcome: "draw",
    });
    expect(r.details.baseTierScore).toBe(20);
    expect(r.ratingChange).toBe(20);
  });

  it("9. draw wrong -15", () => {
    const r = calc({
      predictedOutcome: "draw",
      resultOutcome: "fighterA",
    });
    expect(r.ratingChange).toBe(-15);
  });

  it("10. wrong main ignores sub-predictions", () => {
    const r = calc({
      predictedOutcome: "fighterA",
      resultOutcome: "fighterB",
      predictedMethod: "ko_tko",
      resultMethod: "ko_tko",
      predictedRound: 7,
      resultRound: 7,
    });
    expect(r.ratingChange).toBe(-15);
    expect(r.details.methodAdjustment).toBe(0);
    expect(r.details.roundAdjustment).toBe(0);
  });

  it("11. correct main applies method and round bonuses", () => {
    const r = calc({
      favouriteSide: "fighterA",
      favouriteLevel: "favourite",
      predictedOutcome: "fighterB",
      resultOutcome: "fighterB",
      predictedMethod: "ko_tko",
      resultMethod: "ko_tko",
      predictedRound: 4,
      resultRound: 4,
      scheduledRounds: 12,
    });
    expect(r.details.baseTierScore).toBe(25);
    expect(r.details.methodAdjustment).toBe(4);
    expect(r.details.roundAdjustment).toBe(8);
    expect(r.details.perfectBonus).toBe(5);
    expect(r.ratingChange).toBe(42);
  });

  it("12. perfect pick bonus +5", () => {
    const r = calc({
      favouriteSide: "none",
      favouriteLevel: "even",
      predictedMethod: "ko_tko",
      resultMethod: "ko_tko",
      predictedRound: 8,
      resultRound: 8,
    });
    expect(r.perfectPick).toBe(true);
    expect(r.details.perfectBonus).toBe(5);
    expect(r.ratingChange).toBe(15 + 4 + 8 + 5);
  });

  it("13. no contest → 0", () => {
    const r = calc({
      fightStatus: "no_contest",
      resultOutcome: "no_contest",
      resultMethod: "no_contest",
    });
    expect(r.ratingChange).toBe(0);
    expect(r.details.voided).toBe(true);
  });

  it("14. cancelled → 0", () => {
    const r = calc({
      resultOutcome: "cancelled",
      resultMethod: "cancelled",
      fightStatus: "cancelled",
    });
    expect(r.ratingChange).toBe(0);
  });

  it("popularity in details does not affect ratingChange", () => {
    const lowPop = calc({
      favouriteSide: "none",
      favouriteLevel: "even",
      predictedOutcome: "fighterB",
      resultOutcome: "fighterB",
      popularity: { fighterA: 99, fighterB: 1, draw: 0 },
    });
    const highPop = calc({
      favouriteSide: "none",
      favouriteLevel: "even",
      predictedOutcome: "fighterB",
      resultOutcome: "fighterB",
      popularity: { fighterA: 10, fighterB: 90, draw: 0 },
    });
    expect(lowPop.ratingChange).toBe(highPop.ratingChange);
    expect(lowPop.ratingChange).toBe(15);
  });

  it("grading_details fields populated", () => {
    const r = calc({
      favouriteSide: "fighterA",
      favouriteLevel: "heavy_favourite",
      predictedOutcome: "fighterB",
      resultOutcome: "fighterB",
      popularity: { fighterA: 82, fighterB: 15, draw: 3 },
    });
    expect(r.details.favouriteSide).toBe("fighterA");
    expect(r.details.favouriteLevel).toBe("heavy_favourite");
    expect(r.details.popularity.fighterA).toBe(82);
    expect(r.details.finalRatingChange).toBe(r.ratingChange);
    expect(r.details.explanation).toBeTruthy();
  });
});

describe("validatePrediction", () => {
  it("invalid predicted round beyond scheduledRounds rejected", () => {
    const result = validatePrediction({
      predictedOutcome: "fighterA",
      predictedRound: 11,
      scheduledRounds: 10,
      sport: "boxing",
      isLocked: false,
      isLoggedIn: true,
    });
    expect(result.valid).toBe(false);
  });
});
