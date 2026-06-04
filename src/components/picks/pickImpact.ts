export const PICK_IMPACT_ASSETS = [
  "/impact/Glove1.png",
  "/impact/Glove2.png",
] as const;

export const PICK_IMPACT_DURATION_MS = 330;

export type PickImpactSide = "left" | "right";

export interface PickImpactConfig {
  assetSrc: string;
  side: PickImpactSide;
  triggerKey: number;
  angle: number;
  yOffset: number;
  scale: number;
  entryDistance: number;
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function createPickImpactConfig(side: PickImpactSide): PickImpactConfig {
  const assetSrc =
    PICK_IMPACT_ASSETS[Math.floor(Math.random() * PICK_IMPACT_ASSETS.length)];
  return {
    assetSrc,
    side,
    triggerKey: Date.now(),
    angle: randomInRange(-10, 10),
    yOffset: randomInRange(-8, 8),
    scale: randomInRange(0.94, 1.08),
    entryDistance: randomInRange(36, 56),
  };
}
