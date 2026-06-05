import { describe, expect, it } from "vitest";
import { orderEventCardGroups, type EventFightGroup } from "./fights-utils";
import type { Event } from "@/types";

function makeGroup(id: string, date: string): EventFightGroup {
  const event: Event = {
    id,
    name: id,
    promotion: null,
    location: null,
    event_date: date,
    created_at: "",
    updated_at: "",
  };
  return { event, fights: [] };
}

describe("orderEventCardGroups", () => {
  const groups = [
    makeGroup("evt-a", "2026-06-07T18:00:00Z"),
    makeGroup("evt-b", "2026-06-08T02:00:00Z"),
    makeGroup("evt-c", "2026-06-09T02:00:00Z"),
  ];

  it("leaves order unchanged for All Cards", () => {
    expect(orderEventCardGroups(groups, "all")).toEqual(groups);
  });

  it("moves the selected card to the top", () => {
    expect(orderEventCardGroups(groups, "evt-c").map((g) => g.event.id)).toEqual(
      ["evt-c", "evt-a", "evt-b"]
    );
  });

  it("keeps order when the selected card is already first", () => {
    expect(orderEventCardGroups(groups, "evt-a").map((g) => g.event.id)).toEqual(
      ["evt-a", "evt-b", "evt-c"]
    );
  });
});
