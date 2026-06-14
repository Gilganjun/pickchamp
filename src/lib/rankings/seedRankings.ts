import { SEED_RANKINGS_PROFILES, isSeedRankingsProfileId } from "@/data/seedRankingsProfiles";
import { normalizeUsername } from "@/lib/auth/username";
import { getSeedRankingsTarget, seedRankingsEnabled } from "@/lib/config";
import {
  getRating,
  isEligibleForOfficialRank,
} from "@/lib/rankings";
import type { Profile, RankingTab } from "@/types";

/**
 * Bootstrap seed profiles for live leaderboards only.
 * Must never be merged into admin, analytics, prizes, or pick systems.
 */
export function isSeedRankingsProfile(profile: Pick<Profile, "id">): boolean {
  return isSeedRankingsProfileId(profile.id);
}

export function shouldUseSeedRankings(): boolean {
  return seedRankingsEnabled();
}

export function findSeedProfileByUsername(username: string): Profile | null {
  const normalized = normalizeUsername(username);
  return (
    SEED_RANKINGS_PROFILES.find(
      (seed) => normalizeUsername(seed.username) === normalized
    ) ?? null
  );
}

function countRealEligible(realProfiles: Profile[], tab: RankingTab): number {
  return realProfiles.filter((profile) =>
    isEligibleForOfficialRank(profile, tab)
  ).length;
}

/** Seeds whose id or normalized username already belongs to a real profile. */
export function getAvailableSeedProfiles(realProfiles: Profile[]): Profile[] {
  const realIds = new Set(realProfiles.map((profile) => profile.id));
  const realUsernames = new Set(
    realProfiles.map((profile) => normalizeUsername(profile.username))
  );

  return SEED_RANKINGS_PROFILES.filter((seed) => {
    if (realIds.has(seed.id)) return false;
    if (realUsernames.has(normalizeUsername(seed.username))) return false;
    return true;
  });
}

function selectSeedsForTab(
  availableSeeds: Profile[],
  tab: RankingTab,
  seedsToShow: number
): Profile[] {
  if (seedsToShow <= 0) return [];

  const eligible = availableSeeds.filter((seed) =>
    isEligibleForOfficialRank(seed, tab)
  );

  const sorted = [...eligible].sort((a, b) => {
    const ratingDiff = getRating(b, tab) - getRating(a, tab);
    if (ratingDiff !== 0) return ratingDiff;
    return a.username.localeCompare(b.username);
  });

  return sorted.slice(0, seedsToShow);
}

/**
 * Merges progressive bootstrap seeds into real profiles for rankings only.
 * seedsToShow = max(0, targetSize - realEligible) — lowest-rated seeds drop first.
 */
export function mergeProfilesForRankings(
  realProfiles: Profile[],
  tab: RankingTab
): Profile[] {
  if (!shouldUseSeedRankings()) {
    return realProfiles;
  }

  const realEligible = countRealEligible(realProfiles, tab);
  const targetSize = getSeedRankingsTarget();
  const seedsToShow = Math.max(0, targetSize - realEligible);
  const availableSeeds = getAvailableSeedProfiles(realProfiles);
  const selectedSeeds = selectSeedsForTab(availableSeeds, tab, seedsToShow);

  return [...realProfiles, ...selectedSeeds];
}
