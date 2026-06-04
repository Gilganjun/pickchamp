import { describe, expect, it } from "vitest";
import {
  formatDateTimeInZone,
  formatEventDateTime,
  formatPickLockDateTime,
  resolveEventTimeZone,
} from "./datetime";

describe("resolveEventTimeZone", () => {
  it("prefers explicit timezone on event", () => {
    expect(
      resolveEventTimeZone({
        location: "Somewhere",
        timezone: "America/Chicago",
      })
    ).toBe("America/Chicago");
  });

  it("infers Europe/London from Sheffield", () => {
    expect(
      resolveEventTimeZone({
        location: "Utilita Arena, Sheffield, UK",
        timezone: null,
      })
    ).toBe("Europe/London");
  });

  it("infers America/Los_Angeles from Las Vegas", () => {
    expect(
      resolveEventTimeZone({
        location: "Meta APEX, Las Vegas, Nevada, USA",
        timezone: null,
      })
    ).toBe("America/Los_Angeles");
  });
});

describe("formatEventDateTime", () => {
  it("formats Steel City first bell in UK time regardless of viewer locale", () => {
    const label = formatEventDateTime({
      event_date: "2026-06-06T16:00:00.000Z",
      location: "Utilita Arena, Sheffield, UK",
      timezone: "Europe/London",
    });
    expect(label).toContain("6");
    expect(label).toContain("2026");
    expect(label).toMatch(/17:00|5:00/);
  });
});

describe("formatPickLockDateTime", () => {
  it("formats UFC main-card lock in Pacific time", () => {
    const label = formatPickLockDateTime("2026-06-07T00:00:00.000Z", {
      location: "Meta APEX, Las Vegas, Nevada, USA",
      timezone: "America/Los_Angeles",
    });
    expect(label).toContain("6");
    expect(label).toContain("2026");
    expect(label).toMatch(/17:00|5:00/);
  });
});

describe("formatDateTimeInZone", () => {
  it("does not shift main-event lock to next calendar day in UK zone", () => {
    const uk = formatDateTimeInZone(
      "2026-06-06T21:00:00.000Z",
      "Europe/London"
    );
    expect(uk).toContain("6");
    expect(uk).toContain("2026");
    expect(uk).not.toContain("7 JUN");
  });
});
