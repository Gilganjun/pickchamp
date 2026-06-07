import { describe, expect, it } from "vitest";
import { resolveEventCardTier } from "@/lib/events/cardTier";
import type { Event } from "@/types";

const baseEvent: Event = {
  id: "evt-001",
  name: "Test Card",
  promotion: null,
  location: null,
  event_date: "2026-06-06T16:00:00.000Z",
  created_at: "2026-05-15T12:00:00.000Z",
  updated_at: "2026-06-01T12:00:00.000Z",
};

describe("resolveEventCardTier", () => {
  it("returns null when no tier is set", () => {
    expect(resolveEventCardTier(baseEvent)).toBeNull();
  });

  it("returns editorial tier from event data", () => {
    expect(
      resolveEventCardTier({ ...baseEvent, card_tier: "featured" })
    ).toBe("featured");
  });

  it("returns test tier for phantom local cards", () => {
    expect(
      resolveEventCardTier({ ...baseEvent, id: "phantom-local-event" })
    ).toBe("test");
  });
});
