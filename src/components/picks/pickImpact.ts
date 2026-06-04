export const PICK_IMPACT_ASSETS = [
  "/impact/Glove1.png",
  "/impact/Glove2.png",
] as const;

export const PICK_IMPACT_DURATION_MS = 330;

/** Set to false to revert to a single punch + sound per pick. */
export const PICK_IMPACT_COMBO_EXPERIMENT = true;

export const PICK_IMPACT_COMBO_MIN = 1;
export const PICK_IMPACT_COMBO_MAX = 4;
/** Gap between combo punches (~4 hits within one second). */
export const PICK_IMPACT_COMBO_GAP_MS = 220;

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

/** Random 1–4 hits per pick when combo experiment is on; otherwise always 1. */
export function rollPickImpactComboCount(): number {
  if (!PICK_IMPACT_COMBO_EXPERIMENT) {
    return PICK_IMPACT_COMBO_MIN;
  }
  const span = PICK_IMPACT_COMBO_MAX - PICK_IMPACT_COMBO_MIN + 1;
  return PICK_IMPACT_COMBO_MIN + Math.floor(Math.random() * span);
}

export function getPickImpactComboDurationMs(hitCount: number): number {
  const hits = Math.max(PICK_IMPACT_COMBO_MIN, hitCount);
  if (hits <= 1) {
    return PICK_IMPACT_DURATION_MS;
  }
  return (hits - 1) * PICK_IMPACT_COMBO_GAP_MS + PICK_IMPACT_DURATION_MS;
}

export function createPickImpactConfig(
  side: PickImpactSide,
  sequence = 0
): PickImpactConfig {
  const assetSrc =
    PICK_IMPACT_ASSETS[Math.floor(Math.random() * PICK_IMPACT_ASSETS.length)];
  return {
    assetSrc,
    side,
    triggerKey: Date.now() + sequence,
    angle: randomInRange(-10, 10),
    yOffset: randomInRange(-8, 8),
    scale: randomInRange(0.94, 1.08),
    entryDistance: randomInRange(36, 56),
  };
}
