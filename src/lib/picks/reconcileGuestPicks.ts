import { getSyncedGuestPickFightIdsAction } from "@/app/actions/picks";
import {
  clearGuestPicks,
  getGuestPickCount,
  getGuestPicks,
  GUEST_PICKS_CHANGED_EVENT,
  markGuestPicksAccountSynced,
  removeGuestPicksForFightIds,
} from "@/lib/picks/guestPickStore";

export function pruneGuestPicksByFightIds(fightIds: string[]): number {
  const removed = removeGuestPicksForFightIds(fightIds);
  if (removed > 0) {
    window.dispatchEvent(new CustomEvent(GUEST_PICKS_CHANGED_EVENT));
    if (getGuestPickCount() === 0) {
      markGuestPicksAccountSynced();
    }
  }
  return removed;
}

/**
 * Drops guest drafts that already exist on the signed-in user's account.
 * Call while authenticated (e.g. after migration or before sign-out).
 */
export async function reconcileGuestPicksWithAccount(): Promise<number> {
  const drafts = Object.values(getGuestPicks());
  if (drafts.length === 0) return 0;

  const result = await getSyncedGuestPickFightIdsAction(
    drafts.map((draft) => draft.fight_id)
  );
  if (!result.ok) return 0;

  const removed = pruneGuestPicksByFightIds(result.syncedFightIds);
  if (removed > 0 && getGuestPickCount() === 0) {
    clearGuestPicks();
    markGuestPicksAccountSynced();
  }

  return removed;
}
