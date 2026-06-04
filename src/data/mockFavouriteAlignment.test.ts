import { describe, expect, it } from "vitest";
import { mockFights } from "./mock";
import type { FavouriteLevel, FavouriteSide } from "@/types";

/**
 * Expected PickFist favourite fields derived from June 7 odds screenshots.
 * Fighter A = first-listed fighter (matches mock fighter_a).
 * heavy_favourite when market favourite price <= -1000; else favourite.
 */
const MARKET_ALIGNED: Record<
  string,
  { favourite_side: FavouriteSide; favourite_level: FavouriteLevel }
> = {
  // Steel City — rows on boxing odds sheet
  "fight-001": { favourite_side: "fighterA", favourite_level: "favourite" }, // Padley -333
  "fight-002": { favourite_side: "fighterB", favourite_level: "favourite" }, // Sulaimaan -670
  "fight-003": { favourite_side: "fighterA", favourite_level: "favourite" }, // Bowen -400
  "fight-004": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Atang -8000
  "fight-006": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Mitchell vs Carrasco -8000
  // Steel City — Tapology / proboxingodds (not on June 7 screenshot)
  "fight-005": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Maca ~-8000
  "fight-007": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Hardy vs Bacchini ~-5000
  "fight-008": { favourite_side: "fighterA", favourite_level: "heavy_favourite" }, // Mulunda -10000
  // UFC — all 12 bouts on sheet
  "fight-009": { favourite_side: "fighterA", favourite_level: "favourite" }, // Belal -120
  "fight-010": { favourite_side: "fighterA", favourite_level: "favourite" }, // Allen -205
  "fight-011": { favourite_side: "fighterA", favourite_level: "favourite" }, // Ziam -310
  "fight-012": { favourite_side: "fighterA", favourite_level: "favourite" }, // Mitchell -135
  "fight-013": { favourite_side: "fighterA", favourite_level: "favourite" }, // Baraniewski -350
  "fight-014": { favourite_side: "fighterB", favourite_level: "favourite" }, // Costa -600
  "fight-015": { favourite_side: "fighterA", favourite_level: "favourite" }, // McGhee -450
  "fight-016": { favourite_side: "fighterA", favourite_level: "favourite" }, // Silva -125
  "fight-017": { favourite_side: "fighterB", favourite_level: "favourite" }, // Chandler -115
  "fight-018": { favourite_side: "fighterB", favourite_level: "favourite" }, // Brito -190
  "fight-019": { favourite_side: "fighterA", favourite_level: "favourite" }, // Chaves -370
  "fight-020": { favourite_side: "fighterA", favourite_level: "favourite" }, // Souza -300
};

describe("mock favourite alignment with market odds sheets", () => {
  for (const [fightId, expected] of Object.entries(MARKET_ALIGNED)) {
    it(`${fightId} matches converted market favourite`, () => {
      const fight = mockFights.find((f) => f.id === fightId);
      expect(fight).toBeDefined();
      expect(fight!.favourite_side).toBe(expected.favourite_side);
      expect(fight!.favourite_level).toBe(expected.favourite_level);
    });
  }
});
