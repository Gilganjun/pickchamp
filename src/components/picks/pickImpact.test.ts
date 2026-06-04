import { describe, expect, it, vi } from "vitest";
import {
  createPickImpactConfig,
  getPickImpactComboDurationMs,
  PICK_IMPACT_ASSETS,
  PICK_IMPACT_COMBO_GAP_MS,
  PICK_IMPACT_DURATION_MS,
  rollPickImpactComboCount,
} from "./pickImpact";

describe("createPickImpactConfig", () => {
  it("returns valid asset and variation ranges", () => {
    const config = createPickImpactConfig("left");
    expect(PICK_IMPACT_ASSETS).toContain(config.assetSrc);
    expect(config.side).toBe("left");
    expect(config.angle).toBeGreaterThanOrEqual(-10);
    expect(config.angle).toBeLessThanOrEqual(10);
    expect(config.yOffset).toBeGreaterThanOrEqual(-8);
    expect(config.yOffset).toBeLessThanOrEqual(8);
    expect(config.scale).toBeGreaterThanOrEqual(0.94);
    expect(config.scale).toBeLessThanOrEqual(1.08);
    expect(config.entryDistance).toBeGreaterThanOrEqual(36);
    expect(config.entryDistance).toBeLessThanOrEqual(56);
    expect(config.triggerKey).toBeGreaterThan(0);
  });

  it("uses distinct trigger keys per combo sequence index", () => {
    const a = createPickImpactConfig("right", 0);
    const b = createPickImpactConfig("right", 1);
    expect(b.triggerKey).toBeGreaterThan(a.triggerKey);
  });
});

describe("rollPickImpactComboCount", () => {
  it("returns 1 through 4", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    expect(rollPickImpactComboCount()).toBe(1);
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    expect(rollPickImpactComboCount()).toBe(4);
    vi.restoreAllMocks();
  });
});

describe("getPickImpactComboDurationMs", () => {
  it("extends duration for multi-hit combos", () => {
    expect(getPickImpactComboDurationMs(1)).toBe(PICK_IMPACT_DURATION_MS);
    expect(getPickImpactComboDurationMs(4)).toBe(
      3 * PICK_IMPACT_COMBO_GAP_MS + PICK_IMPACT_DURATION_MS
    );
  });
});
