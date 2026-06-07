import { describe, expect, it } from "vitest";
import {
  isActivePicksFight,
  isEventPicksLocked,
  isFocusedLockedCardSelection,
  orderEventCardGroups,
  type EventFightGroup,
} from "./fights-utils";
import type { Event, FightWithRelations } from "@/types";

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

function makeFight(
  id: string,
  lockTime: string,
  status: FightWithRelations["status"] = "upcoming"
): FightWithRelations {
  const event: Event = {
    id: "evt-1",
    name: "Test Card",
    promotion: null,
    location: null,
    event_date: "2026-06-10T18:00:00Z",
    created_at: "",
    updated_at: "",
  };
  return {
    id,
    event_id: event.id,
    sport: "boxing",
    fighter_a_name: "A",
    fighter_b_name: "B",
    scheduled_rounds: 10,
    weight_class: null,
    fight_order: 1,
    lock_time: lockTime,
    status,
    favourite_side: "fighterA",
    favourite_level: "favourite",
    created_at: "",
    updated_at: "",
    event,
    result: null,
    userPrediction: null,
  };
}

describe("isActivePicksFight", () => {
  it("includes settled fights so Past Picks cards remain visible", () => {
    const settled = makeFight("f1", "2020-01-01T18:00:00Z", "settled");
    expect(isActivePicksFight(settled)).toBe(true);
  });

  it("excludes cancelled and no-contest fights", () => {
    const cancelled = makeFight("f1", "2020-01-01T18:00:00Z", "cancelled");
    expect(isActivePicksFight(cancelled)).toBe(false);
  });
});

describe("isEventPicksLocked", () => {
  const pastLock = "2020-01-01T18:00:00Z";
  const futureLock = "2099-06-10T18:00:00Z";

  it("returns false when any fight is still open for picks", () => {
    const fights = [
      makeFight("f1", pastLock, "locked"),
      makeFight("f2", futureLock, "upcoming"),
    ];
    expect(isEventPicksLocked(fights)).toBe(false);
  });

  it("returns true when every fight on the card is locked", () => {
    const fights = [
      makeFight("f1", pastLock, "locked"),
      makeFight("f2", pastLock, "result_pending"),
    ];
    expect(isEventPicksLocked(fights)).toBe(true);
  });

  it("returns true when every fight on the card is settled", () => {
    const fights = [
      makeFight("f1", pastLock, "settled"),
      makeFight("f2", pastLock, "settled"),
    ];
    expect(isEventPicksLocked(fights)).toBe(true);
  });

  it("returns false for an empty card", () => {
    expect(isEventPicksLocked([])).toBe(false);
  });
});

describe("isFocusedLockedCardSelection", () => {
  const pastLock = "2020-01-01T18:00:00Z";
  const futureLock = "2099-06-10T18:00:00Z";

  it("returns false for All Cards", () => {
    expect(isFocusedLockedCardSelection("all", [])).toBe(false);
  });

  it("returns true when the filtered event is fully locked", () => {
    const fights = [makeFight("f1", pastLock, "locked")];
    expect(isFocusedLockedCardSelection("evt-1", fights)).toBe(true);
  });

  it("returns false when the filtered event still has open picks", () => {
    const fights = [makeFight("f1", futureLock, "upcoming")];
    expect(isFocusedLockedCardSelection("evt-1", fights)).toBe(false);
  });
});

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
