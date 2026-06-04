import { describe, expect, it } from "vitest";
import { createPickImpactConfig, PICK_IMPACT_ASSETS } from "./pickImpact";

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
});
