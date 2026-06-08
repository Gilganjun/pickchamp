import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearGuestPicks,
  consumeGuestPicksAccountSynced,
  getGuestPick,
  getGuestPickCount,
  GUEST_PICKS_STORAGE_KEY,
  GUEST_PICKS_SYNCED_SESSION_KEY,
  markGuestPicksAccountSynced,
  removeGuestPicksForFightIds,
  upsertGuestPick,
} from "@/lib/picks/guestPickStore";

describe("guestPickStore", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        },
      },
      sessionStorage: {
        getItem: (key: string) => storage.get(`session:${key}`) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(`session:${key}`, value);
        },
        removeItem: (key: string) => {
          storage.delete(`session:${key}`);
        },
      },
      dispatchEvent: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("stores and retrieves a guest pick draft", () => {
    upsertGuestPick({
      fight_id: "fight-1",
      predicted_outcome: "fighterA",
      predicted_method: "ko_tko",
      predicted_round: 3,
    });

    expect(getGuestPickCount()).toBe(1);
    expect(getGuestPick("fight-1")).toMatchObject({
      fight_id: "fight-1",
      predicted_outcome: "fighterA",
      predicted_method: "ko_tko",
      predicted_round: 3,
    });
  });

  it("clears all guest picks", () => {
    upsertGuestPick({
      fight_id: "fight-1",
      predicted_outcome: "fighterB",
      predicted_method: null,
      predicted_round: null,
    });
    clearGuestPicks();
    expect(getGuestPickCount()).toBe(0);
    expect(storage.has(GUEST_PICKS_STORAGE_KEY)).toBe(false);
  });

  it("removes only the requested guest pick fight ids", () => {
    upsertGuestPick({
      fight_id: "fight-1",
      predicted_outcome: "fighterA",
      predicted_method: null,
      predicted_round: null,
    });
    upsertGuestPick({
      fight_id: "fight-2",
      predicted_outcome: "fighterB",
      predicted_method: null,
      predicted_round: null,
    });

    expect(removeGuestPicksForFightIds(["fight-1"])).toBe(1);
    expect(getGuestPickCount()).toBe(1);
    expect(getGuestPick("fight-2")).not.toBeNull();
  });

  it("tracks account sync in session storage once", () => {
    markGuestPicksAccountSynced();
    expect(storage.get(`session:${GUEST_PICKS_SYNCED_SESSION_KEY}`)).toBe("1");
    expect(consumeGuestPicksAccountSynced()).toBe(true);
    expect(consumeGuestPicksAccountSynced()).toBe(false);
  });
});
