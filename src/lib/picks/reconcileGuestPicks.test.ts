import { beforeEach, describe, expect, it, vi } from "vitest";
import { pruneGuestPicksByFightIds } from "@/lib/picks/reconcileGuestPicks";

vi.mock("@/lib/picks/guestPickStore", () => ({
  clearGuestPicks: vi.fn(),
  getGuestPickCount: vi.fn(() => 0),
  getGuestPicks: vi.fn(() => ({})),
  GUEST_PICKS_CHANGED_EVENT: "pickfist-guest-picks-changed",
  markGuestPicksAccountSynced: vi.fn(),
  removeGuestPicksForFightIds: vi.fn((ids: string[]) => ids.length),
}));

import {
  getGuestPickCount,
  markGuestPicksAccountSynced,
  removeGuestPicksForFightIds,
} from "@/lib/picks/guestPickStore";

describe("pruneGuestPicksByFightIds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getGuestPickCount).mockReturnValue(0);
    vi.stubGlobal("window", {
      dispatchEvent: vi.fn(),
    });
  });

  it("dispatches change and marks sync when guest picks are fully pruned", () => {
    vi.mocked(removeGuestPicksForFightIds).mockReturnValue(2);
    vi.mocked(getGuestPickCount).mockReturnValue(0);

    const removed = pruneGuestPicksByFightIds(["fight-1", "fight-2"]);

    expect(removed).toBe(2);
    expect(markGuestPicksAccountSynced).toHaveBeenCalled();
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});
