/** Maps display tier names to PNG assets in /public/ranks (from Graphics/). */
const TIER_GRAPHIC_FILES: Record<string, string> = {
  NOVICE: "Rank_Novice.png",
  ROOKIE: "Rank_Rookie.png",
  PROSPECT: "Rank_Prospect.png",
  CONTENDER: "Rank_Contender.png",
  "#1 CONTENDER": "Rank_1Contender.png",
  "TITLE CHALLENGER": "Rank_TitleChallenger.png",
  "WORLD TITLE CHALLENGER": "Rank_WorldTitleChallenger.png",
  CHAMPION: "Rank_Champion.png",
  "UNIFIED CHAMPION": "Rank_UnifiedChampion.png",
  "UNDISPUTED CHAMPION": "Rank_UndisputedChampion.png",
  "HALL OF FAME": "Rank_HallOfFame.png",
  "ALL-TIME GREAT": "Rank_AllTimeGreat.png",
};

export const DISPLAY_TIER_COUNT = 12;

export function getRankGraphicSrc(tierName: string): string {
  const file = TIER_GRAPHIC_FILES[tierName] ?? "Rank_Novice.png";
  return `/ranks/${file}`;
}

export function getTierIndex(tierName: string): number {
  const names = Object.keys(TIER_GRAPHIC_FILES);
  const index = names.indexOf(tierName);
  return index >= 0 ? index + 1 : 1;
}
