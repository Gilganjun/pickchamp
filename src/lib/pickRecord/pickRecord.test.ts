import { describe, expect, it } from "vitest";
import {
  buildPickRecordItems,
  getPickRecordCounts,
  getPickRecordStatus,
  buildPickRecordListEntries,
  groupPickRecordList,
  sortPickRecordItems,
} from "./pickRecord";
import {
  buildExportSummaryStats,
  buildPickRecordExportSections,
  buildPickRecordExportText,
  buildStatChipLabels,
  formatPastOutcomeLine,
  groupExportItemsByEvent,
} from "./exportPickRecord";
import type { Event, FightWithRelations, Prediction, Profile } from "@/types";

function makeEvent(id: string, name: string, eventDate: string): Event {
  return {
    id,
    name,
    promotion: null,
    location: "London, UK",
    timezone: "Europe/London",
    event_date: eventDate,
    created_at: "",
    updated_at: "",
  };
}

function makeFight(
  id: string,
  event: Event,
  lockTime: string,
  status: FightWithRelations["status"] = "upcoming",
  fightOrder = 1
): FightWithRelations {
  return {
    id,
    event_id: event.id,
    sport: "boxing",
    fighter_a_name: "Fighter A",
    fighter_b_name: "Fighter B",
    scheduled_rounds: 10,
    weight_class: null,
    fight_order: fightOrder,
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

function makePrediction(
  fightId: string,
  gradedAt: string | null = null,
  mainCorrect: boolean | null = null
): Prediction {
  return {
    id: `pred-${fightId}`,
    user_id: "user-1",
    fight_id: fightId,
    predicted_outcome: "fighterA",
    predicted_method: "decision",
    predicted_round: null,
    created_at: "2026-06-01T12:00:00.000Z",
    updated_at: "2026-06-01T12:00:00.000Z",
    locked_at: null,
    graded_at: gradedAt,
    rating_change: gradedAt ? 10 : null,
    main_correct: mainCorrect,
    method_correct: null,
    round_correct: null,
    perfect_pick: false,
    grading_details: null,
  };
}

const profile: Profile = {
  id: "user-1",
  username: "tester",
  display_name: "Test User",
  avatar_initials: "TU",
  global_rating: 1000,
  boxing_rating: 1000,
  mma_rating: 1000,
  total_picks: 2,
  total_correct: 1,
  boxing_picks: 2,
  boxing_correct: 1,
  mma_picks: 0,
  mma_correct: 0,
  perfect_picks: 0,
  current_streak: 0,
  best_streak: 0,
  created_at: "",
  updated_at: "",
};

describe("pickRecord classification", () => {
  it("splits future and past picks", () => {
    const eventA = makeEvent("evt-a", "Card A", "2026-06-20T18:00:00.000Z");
    const eventB = makeEvent("evt-b", "Card B", "2026-06-10T18:00:00.000Z");
    const fights = [
      makeFight("f1", eventA, "2026-06-20T18:00:00.000Z"),
      makeFight("f2", eventB, "2026-06-10T18:00:00.000Z", "settled"),
    ];
    const predictions = [
      makePrediction("f1"),
      makePrediction("f2", "2026-06-11T12:00:00.000Z", true),
    ];

    const items = buildPickRecordItems(predictions, fights);
    expect(items).toHaveLength(2);
    expect(getPickRecordCounts(items)).toEqual({
      upcoming: 1,
      settled: 1,
      total: 2,
    });
    expect(items.find((i) => i.fight.id === "f1")?.bucket).toBe("future");
    expect(items.find((i) => i.fight.id === "f2")?.bucket).toBe("past");
  });

  it("uses pending vs waiting for results on future picks", () => {
    const event = makeEvent("evt-a", "Card A", "2026-06-20T18:00:00.000Z");
    const upcomingFight = makeFight(
      "f1",
      event,
      "2099-01-01T18:00:00.000Z",
      "upcoming"
    );
    const liveFight = makeFight(
      "f2",
      event,
      "2020-01-01T18:00:00.000Z",
      "locked",
      2
    );

    expect(getPickRecordStatus(makePrediction("f1"), upcomingFight)).toBe(
      "pending"
    );
    expect(getPickRecordStatus(makePrediction("f2"), liveFight)).toBe(
      "waiting_for_results"
    );
  });
});

describe("pickRecord sorting and grouping", () => {
  it("sorts future soonest first and past newest first", () => {
    const eventEarly = makeEvent("evt-early", "Early", "2026-06-10T18:00:00.000Z");
    const eventLate = makeEvent("evt-late", "Late", "2026-06-20T18:00:00.000Z");
    const fights = [
      makeFight("f-late", eventLate, "2026-06-20T18:00:00.000Z"),
      makeFight("f-early", eventEarly, "2026-06-10T18:00:00.000Z"),
      makeFight(
        "f-past-late",
        eventLate,
        "2026-06-20T18:00:00.000Z",
        "settled"
      ),
      makeFight(
        "f-past-early",
        eventEarly,
        "2026-06-10T18:00:00.000Z",
        "settled"
      ),
    ];
    const predictions = [
      makePrediction("f-late"),
      makePrediction("f-early"),
      makePrediction("f-past-late", "2026-06-21T12:00:00.000Z", true),
      makePrediction("f-past-early", "2026-06-11T12:00:00.000Z", false),
    ];
    const items = buildPickRecordItems(predictions, fights);

    const future = sortPickRecordItems(items, "future");
    expect(future.map((item) => item.fight.id)).toEqual(["f-early", "f-late"]);

    const past = sortPickRecordItems(items, "past");
    expect(past.map((item) => item.fight.id)).toEqual([
      "f-past-late",
      "f-past-early",
    ]);

    const all = sortPickRecordItems(items, "all");
    expect(all.map((item) => item.fight.id)).toEqual([
      "f-late",
      "f-past-late",
      "f-early",
      "f-past-early",
    ]);
  });

  it("inserts section dividers for all picks before each bucket", () => {
    const eventEarly = makeEvent("evt-early", "Early", "2026-06-10T18:00:00.000Z");
    const eventLate = makeEvent("evt-late", "Late", "2026-06-20T18:00:00.000Z");
    const fights = [
      makeFight("f-future", eventLate, "2026-06-20T18:00:00.000Z"),
      makeFight(
        "f-past",
        eventEarly,
        "2026-06-10T18:00:00.000Z",
        "settled"
      ),
    ];
    const items = buildPickRecordItems(
      [makePrediction("f-future"), makePrediction("f-past", "2026-06-11T12:00:00.000Z", false)],
      fights
    );

    const entries = buildPickRecordListEntries(items, "all");
    expect(entries.map((entry) => entry.kind)).toEqual([
      "section",
      "header",
      "row",
      "section",
      "header",
      "row",
    ]);
    expect(entries[0]).toMatchObject({
      kind: "section",
      title: "FUTURE PICKS",
    });
    expect(entries[3]).toMatchObject({
      kind: "section",
      title: "PAST PICKS",
    });
  });

  it("inserts event headers when the event changes", () => {
    const eventA = makeEvent("evt-a", "Card A", "2026-06-10T18:00:00.000Z");
    const eventB = makeEvent("evt-b", "Card B", "2026-06-20T18:00:00.000Z");
    const fights = [
      makeFight("f1", eventA, "2026-06-10T18:00:00.000Z"),
      makeFight("f2", eventB, "2026-06-20T18:00:00.000Z"),
    ];
    const items = buildPickRecordItems(
      [makePrediction("f1"), makePrediction("f2")],
      fights
    );
    const grouped = groupPickRecordList(sortPickRecordItems(items, "future"));
    expect(grouped.map((entry) => entry.kind)).toEqual([
      "header",
      "row",
      "header",
      "row",
    ]);
  });
});

describe("pickRecord export text", () => {
  it("builds past export with a PAST PICKS section heading", () => {
    const event = makeEvent("evt-a", "Steel City King", "2026-06-06T16:00:00.000Z");
    const fight = makeFight("f1", event, "2026-06-06T16:00:00.000Z", "settled");
    fight.fighter_a_name = "Padley";
    fight.fighter_b_name = "Fiaz";
    const items = buildPickRecordItems(
      [makePrediction("f1", "2026-06-07T12:00:00.000Z", true)],
      [fight]
    );

    const text = buildPickRecordExportText(items, {
      profile,
      scope: "past",
      generatedAt: "2026-06-08T12:00:00.000Z",
    });

    expect(text).toContain("PICKFIST PICK RECORD");
    expect(text).toContain("@tester");
    expect(text).toContain("Export type: PAST PICKS");
    expect(text).toContain("PAST PICKS");
    expect(text).toContain("1 PICKS");
    expect(text).toContain("1 PAST");
    expect(text).toContain("100% ACCURACY");
    expect(text).toContain("STEEL CITY KING");
    expect(text).toContain("Padley vs Fiaz");
    expect(text).toContain("Pick:");
    expect(text).toContain("Result:");
    expect(text).toContain("+10 · Won");
    expect(formatPastOutcomeLine(items[0]!)).toBe("+10 · Won");
    expect(buildStatChipLabels(buildExportSummaryStats(items))).toEqual([
      "1 PICKS",
      "0 FUTURE",
      "1 PAST",
      "100% ACCURACY",
    ]);
  });

  it("splits all picks export into FUTURE PICKS and PAST PICKS sections", () => {
    const eventEarly = makeEvent("evt-early", "Early Card", "2026-06-10T18:00:00.000Z");
    const eventLate = makeEvent("evt-late", "Late Card", "2026-06-20T18:00:00.000Z");
    const fights = [
      makeFight("f-future", eventLate, "2026-06-20T18:00:00.000Z"),
      makeFight(
        "f-past",
        eventEarly,
        "2026-06-10T18:00:00.000Z",
        "settled"
      ),
    ];
    const items = buildPickRecordItems(
      [makePrediction("f-future"), makePrediction("f-past", "2026-06-11T12:00:00.000Z", false)],
      fights
    );

    const sections = buildPickRecordExportSections(items, "all");
    expect(sections.map((section) => section.title)).toEqual([
      "FUTURE PICKS",
      "PAST PICKS",
    ]);

    const text = buildPickRecordExportText(items, {
      profile,
      scope: "all",
      generatedAt: "2026-06-08T12:00:00.000Z",
    });

    expect(text).toContain("Export type: ALL PICKS");
    expect(text).toContain("FUTURE PICKS");
    expect(text).toContain("PAST PICKS");
    expect(text.indexOf("FUTURE PICKS")).toBeLessThan(text.indexOf("PAST PICKS"));
    expect(text).toContain("Pick:");
    expect(text).toContain("Result:");
    expect(text).not.toContain("PENDING");
    expect(groupExportItemsByEvent(items)).toHaveLength(2);
    expect(buildExportSummaryStats(items)).toEqual({
      total: 2,
      future: 1,
      past: 1,
      accuracy: "0%",
    });
    expect(buildStatChipLabels(buildExportSummaryStats(items))).toEqual([
      "2 PICKS",
      "1 FUTURE",
      "1 PAST",
      "0% ACCURACY",
    ]);
  });

  it("builds future export with a FUTURE PICKS section heading", () => {
    const event = makeEvent("evt-a", "Upcoming Card", "2026-06-20T18:00:00.000Z");
    const fight = makeFight("f1", event, "2099-01-01T18:00:00.000Z");
    const items = buildPickRecordItems([makePrediction("f1")], [fight]);

    const text = buildPickRecordExportText(items, {
      profile,
      scope: "future",
      generatedAt: "2026-06-08T12:00:00.000Z",
    });

    expect(text).toContain("Export type: FUTURE PICKS");
    expect(text).toContain("FUTURE PICKS");
    expect(text).not.toContain("PENDING");
    expect(text).toContain("BOXING");
    expect(text).toContain("UPCOMING CARD");
    expect(text).toContain("Pick:");
    expect(groupExportItemsByEvent(items)).toHaveLength(1);
  });
});
