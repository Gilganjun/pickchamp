import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearGuestPicks,
  getGuestPick,
  getGuestPickCount,
  GUEST_PICKS_STORAGE_KEY,
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
});
