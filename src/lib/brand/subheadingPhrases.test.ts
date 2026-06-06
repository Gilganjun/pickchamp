import { describe, expect, it } from "vitest";
import { ROTATING_SUBHEADING_PHRASES } from "./subheadingPhrases";

describe("ROTATING_SUBHEADING_PHRASES", () => {
  it("lists all eight hero subheadings in order", () => {
    expect(ROTATING_SUBHEADING_PHRASES).toEqual([
      "Who Is The World's Best Fight Predictor?",
      "Put Your Fight IQ To The Test.",
      "How Good Are Your Picks Really?",
      "The Ultimate Fight Prediction Challenge.",
      "Climb The Global Rankings To Be #1!",
      "Fight Fans. One Leaderboard.",
      "From Novice, To Champion, To All-Time Great.",
      "You Don't Know S#!T About Fighting?",
    ]);
  });

  it("does not use the old asterisk version", () => {
    const combined = ROTATING_SUBHEADING_PHRASES.join(" ");
    expect(combined).not.toContain("S***");
    expect(combined).not.toContain("S\\*\\*\\*");
  });
});
