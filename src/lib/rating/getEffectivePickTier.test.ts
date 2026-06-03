import { describe, expect, it } from "vitest";
import { getEffectivePickTier } from "./getEffectivePickTier";

describe("getEffectivePickTier full mapping", () => {
  it("fighterB favourite level favourite", () => {
    expect(
      getEffectivePickTier({
        predictedOutcome: "fighterB",
        favouriteSide: "fighterB",
        favouriteLevel: "favourite",
      })
    ).toBe("favourite");
    expect(
      getEffectivePickTier({
        predictedOutcome: "fighterA",
        favouriteSide: "fighterB",
        favouriteLevel: "favourite",
      })
    ).toBe("underdog");
  });
});
