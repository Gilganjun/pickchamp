import { describe, expect, it } from "vitest";
import {
  PICK_IMPACT_SOUND_DELAY_MS,
  PICK_IMPACT_SOUNDS,
  PICK_IMPACT_SOUND_VOLUME,
  playPickImpactSound,
} from "./playPickImpactSound";

describe("playPickImpactSound", () => {
  it("exposes ten punch assets and default timing", () => {
    expect(PICK_IMPACT_SOUNDS).toHaveLength(10);
    expect(PICK_IMPACT_SOUNDS[0]).toBe("/sounds/Punch2.mp3");
    expect(PICK_IMPACT_SOUNDS[9]).toBe("/sounds/Punch11.mp3");
    expect(PICK_IMPACT_SOUND_DELAY_MS).toBe(120);
    expect(PICK_IMPACT_SOUND_VOLUME).toBe(0.18);
  });

  it("does not throw when window is undefined", () => {
    expect(() => playPickImpactSound()).not.toThrow();
  });
});
