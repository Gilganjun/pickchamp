import { describe, expect, it } from "vitest";
import { getTrialDisplayInfo } from "./trialDisplay";

describe("getTrialDisplayInfo", () => {
  it("derives trial end one calendar month after signup", () => {
    const trial = getTrialDisplayInfo("2026-06-06T12:00:00.000Z");
    expect(trial.signupLabel).toBe("6 Jun 2026");
    expect(trial.trialEndsLabel).toBe("6 Jul 2026");
  });
});
