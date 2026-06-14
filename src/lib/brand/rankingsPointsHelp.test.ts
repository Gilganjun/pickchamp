import { describe, expect, it } from "vitest";
import {
  getRankingsPointsHelpBonusesLine,
  getRankingsTierHelpRows,
  RANKINGS_POINTS_HELP_SUMMARY,
} from "@/lib/brand/rankingsPointsHelp";
import { TIER_RATINGS } from "@/lib/rating/tierRatings";

describe("rankingsPointsHelp", () => {
  it("lists every difficulty tier with formatted win/lose values", () => {
    const rows = getRankingsTierHelpRows();
    expect(rows).toHaveLength(Object.keys(TIER_RATINGS).length);
    expect(rows[0]).toMatchObject({ correct: "+5", wrong: "-15" });
    expect(rows.at(-1)).toMatchObject({ label: "Draw", correct: "+20", wrong: "-15" });
  });

  it("mentions eligibility thresholds and per-fight caps", () => {
    expect(RANKINGS_POINTS_HELP_SUMMARY[2]).toContain("Global 10");
    expect(getRankingsPointsHelpBonusesLine()).toContain("+75");
    expect(getRankingsPointsHelpBonusesLine()).toContain("-20");
  });
});
