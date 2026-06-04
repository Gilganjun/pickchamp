import { describe, expect, it } from "vitest";
import { getPickPotential } from "./getPickPotential";

describe("getPickPotential", () => {
  it("favourite pick on favourite side", () => {
    const p = getPickPotential({
      predictedOutcome: "fighterA",
      favouriteSide: "fighterA",
      favouriteLevel: "favourite",
    });
    expect(p.tier).toBe("favourite");
    expect(p.correctBase).toBe(10);
    expect(p.wrongRisk).toBe(-12);
  });

  it("underdog pick opposite favourite side", () => {
    const p = getPickPotential({
      predictedOutcome: "fighterB",
      favouriteSide: "fighterA",
      favouriteLevel: "favourite",
    });
    expect(p.tier).toBe("underdog");
    expect(p.correctBase).toBe(25);
    expect(p.wrongRisk).toBe(-10);
  });

  it("heavy underdog opposite heavy favourite", () => {
    const p = getPickPotential({
      predictedOutcome: "fighterB",
      favouriteSide: "fighterA",
      favouriteLevel: "heavy_favourite",
    });
    expect(p.tier).toBe("heavy_underdog");
    expect(p.correctBase).toBe(40);
    expect(p.wrongRisk).toBe(-8);
  });

  it("even fight pick", () => {
    const p = getPickPotential({
      predictedOutcome: "fighterA",
      favouriteSide: "none",
      favouriteLevel: "even",
    });
    expect(p.tier).toBe("even");
    expect(p.correctBase).toBe(15);
    expect(p.wrongRisk).toBe(-15);
  });

  it("draw pick", () => {
    const p = getPickPotential({
      predictedOutcome: "draw",
      favouriteSide: "fighterA",
      favouriteLevel: "favourite",
    });
    expect(p.tier).toBe("draw");
    expect(p.correctBase).toBe(20);
    expect(p.wrongRisk).toBe(-15);
  });

  it("includes method and round in perfect ceiling", () => {
    const p = getPickPotential({
      predictedOutcome: "fighterB",
      favouriteSide: "fighterA",
      favouriteLevel: "favourite",
      predictedMethod: "ko_tko",
      predictedRound: 5,
    });
    expect(p.maxWithCurrentDetails).toBe(37);
    expect(p.perfectCeiling).toBe(42);
    expect(p.methodBonus).toBe(4);
    expect(p.roundExactBonus).toBe(8);
    expect(p.perfectBonus).toBe(5);
  });
});
