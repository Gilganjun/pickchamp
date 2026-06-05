import { describe, expect, it } from "vitest";
import { resolveCardFilterForSport } from "./PicksFilterBar";
import type { Event } from "@/types";

const events: Event[] = [
  {
    id: "evt-boxing",
    name: "Steel City King",
    promotion: "Matchroom",
    location: "Sheffield",
    event_date: "2026-06-07T18:00:00Z",
    created_at: "",
    updated_at: "",
  },
  {
    id: "evt-mma",
    name: "UFC Fight Night",
    promotion: "UFC",
    location: "Las Vegas",
    event_date: "2026-06-08T02:00:00Z",
    created_at: "",
    updated_at: "",
  },
];

describe("resolveCardFilterForSport", () => {
  it("keeps All Cards", () => {
    expect(resolveCardFilterForSport("all", events)).toBe("all");
  });

  it("keeps a valid card selection", () => {
    expect(resolveCardFilterForSport("evt-boxing", [events[0]])).toBe(
      "evt-boxing"
    );
  });

  it("resets invalid card selections to All Cards", () => {
    expect(resolveCardFilterForSport("evt-mma", [events[0]])).toBe("all");
  });
});
