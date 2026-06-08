import type { PredictedMethod, PredictedOutcome } from "@/types";

export const GUEST_PICKS_STORAGE_KEY = "pickfist-guest-picks";
export const GUEST_PICKS_CHANGED_EVENT = "pickfist-guest-picks-changed";
export const GUEST_PICKS_MIGRATED_EVENT = "pickfist-guest-picks-migrated";

/** Guest drafts expire after 48 hours. */
export const GUEST_PICKS_EXPIRY_MS = 48 * 60 * 60 * 1000;

export interface GuestPickDraft {
  fight_id: string;
  predicted_outcome: PredictedOutcome;
  predicted_method: PredictedMethod | null;
  predicted_round: number | null;
  updated_at: string;
}

interface GuestPickStorePayload {
  version: 1;
  expires_at: string;
  picks: Record<string, GuestPickDraft>;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function notifyGuestPicksChanged(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(GUEST_PICKS_CHANGED_EVENT));
}

function readPayload(): GuestPickStorePayload | null {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(GUEST_PICKS_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GuestPickStorePayload;
    if (parsed.version !== 1 || !parsed.picks || !parsed.expires_at) {
      window.localStorage.removeItem(GUEST_PICKS_STORAGE_KEY);
      return null;
    }

    if (new Date(parsed.expires_at).getTime() <= Date.now()) {
      window.localStorage.removeItem(GUEST_PICKS_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(GUEST_PICKS_STORAGE_KEY);
    return null;
  }
}

function writePayload(picks: Record<string, GuestPickDraft>): void {
  if (!isBrowser()) return;

  if (Object.keys(picks).length === 0) {
    window.localStorage.removeItem(GUEST_PICKS_STORAGE_KEY);
    notifyGuestPicksChanged();
    return;
  }

  const payload: GuestPickStorePayload = {
    version: 1,
    expires_at: new Date(Date.now() + GUEST_PICKS_EXPIRY_MS).toISOString(),
    picks,
  };
  window.localStorage.setItem(GUEST_PICKS_STORAGE_KEY, JSON.stringify(payload));
  notifyGuestPicksChanged();
}

export function getGuestPicks(): Record<string, GuestPickDraft> {
  return readPayload()?.picks ?? {};
}

export function getGuestPick(fightId: string): GuestPickDraft | null {
  return getGuestPicks()[fightId] ?? null;
}

export function getGuestPickCount(): number {
  return Object.keys(getGuestPicks()).length;
}

export function upsertGuestPick(
  draft: Omit<GuestPickDraft, "updated_at"> & { updated_at?: string }
): GuestPickDraft {
  const picks = getGuestPicks();
  const next: GuestPickDraft = {
    fight_id: draft.fight_id,
    predicted_outcome: draft.predicted_outcome,
    predicted_method: draft.predicted_method,
    predicted_round: draft.predicted_round,
    updated_at: draft.updated_at ?? new Date().toISOString(),
  };
  picks[draft.fight_id] = next;
  writePayload(picks);
  return next;
}

export function removeGuestPick(fightId: string): void {
  const picks = getGuestPicks();
  if (!picks[fightId]) return;
  delete picks[fightId];
  writePayload(picks);
}

export function clearGuestPicks(): void {
  writePayload({});
}
