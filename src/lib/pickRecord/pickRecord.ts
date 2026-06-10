import {
  formatPickLine,
  formatResultLine,
  isActiveCurrentPickFight,
  methodLabel,
} from "@/lib/profile/display";
import {
  formatDateTimeInZone,
  resolveEventTimeZone,
} from "@/lib/datetime";
import { isFightLocked } from "@/lib/utils";
import type {
  FightWithRelations,
  Prediction,
  PredictedOutcome,
} from "@/types";

export type PickRecordTab = "future" | "past" | "all";

export type PickRecordStatus =
  | "pending"
  | "waiting_for_results"
  | "won"
  | "lost"
  | "perfect";

export type PickRecordBucket = "future" | "past";

export interface PickRecordItem {
  prediction: Prediction;
  fight: FightWithRelations;
  bucket: PickRecordBucket;
  status: PickRecordStatus;
}

export type PickRecordListEntry =
  | {
      kind: "section";
      sectionKey: PickRecordBucket;
      title: string;
      subtitle: string;
    }
  | {
      kind: "header";
      eventId: string;
      sport: FightWithRelations["sport"];
      eventName: string;
      eventDateLabel: string;
    }
  | { kind: "row"; item: PickRecordItem };

export interface PickRecordCounts {
  upcoming: number;
  settled: number;
  total: number;
}

function getPredictedWinnerName(
  fight: FightWithRelations,
  outcome: PredictedOutcome
): string {
  if (outcome === "fighterA") return fight.fighter_a_name;
  if (outcome === "fighterB") return fight.fighter_b_name;
  return "Draw";
}

export function formatEventDateShort(fight: FightWithRelations): string {
  const zone = resolveEventTimeZone(fight.event);
  const d = new Date(fight.event.event_date);
  if (Number.isNaN(d.getTime())) return "DATE TBC";
  return d.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    timeZone: zone,
  });
}

export function isPastPickRecordItem(prediction: Prediction): boolean {
  return prediction.graded_at != null;
}

export function isFuturePickRecordItem(
  prediction: Prediction,
  fight: FightWithRelations
): boolean {
  return (
    prediction.graded_at == null && isActiveCurrentPickFight(fight)
  );
}

export function getPickRecordStatus(
  prediction: Prediction,
  fight: FightWithRelations
): PickRecordStatus {
  if (prediction.graded_at == null) {
    return isFightLocked(fight) ? "waiting_for_results" : "pending";
  }
  if (prediction.perfect_pick === true) return "perfect";
  if (prediction.main_correct === true) return "won";
  if (prediction.main_correct === false) return "lost";
  return "waiting_for_results";
}

export function getPickRecordStatusLabel(status: PickRecordStatus): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "waiting_for_results":
      return "Waiting for results";
    case "won":
      return "Won";
    case "lost":
      return "Lost";
    case "perfect":
      return "Perfect";
  }
}

export function buildPickRecordItems(
  predictions: Prediction[],
  fights: FightWithRelations[]
): PickRecordItem[] {
  const fightById = new Map(fights.map((fight) => [fight.id, fight]));
  const items: PickRecordItem[] = [];

  for (const prediction of predictions) {
    const fight = fightById.get(prediction.fight_id);
    if (!fight) continue;

    const bucket: PickRecordBucket = isPastPickRecordItem(prediction)
      ? "past"
      : isFuturePickRecordItem(prediction, fight)
        ? "future"
        : "past";

    if (
      prediction.graded_at == null &&
      !isFuturePickRecordItem(prediction, fight)
    ) {
      continue;
    }

    items.push({
      prediction,
      fight,
      bucket,
      status: getPickRecordStatus(prediction, fight),
    });
  }

  return items;
}

export function getPickRecordCounts(items: PickRecordItem[]): PickRecordCounts {
  const upcoming = items.filter((item) => item.bucket === "future").length;
  const settled = items.filter((item) => item.bucket === "past").length;
  return { upcoming, settled, total: items.length };
}

function compareByEventDate(
  a: PickRecordItem,
  b: PickRecordItem,
  direction: "asc" | "desc"
): number {
  const eventDiff =
    new Date(a.fight.event.event_date).getTime() -
    new Date(b.fight.event.event_date).getTime();
  if (eventDiff !== 0) {
    return direction === "asc" ? eventDiff : -eventDiff;
  }
  const orderA = a.fight.fight_order ?? 999;
  const orderB = b.fight.fight_order ?? 999;
  return direction === "asc" ? orderA - orderB : orderB - orderA;
}

export function sortPickRecordItems(
  items: PickRecordItem[],
  tab: PickRecordTab
): PickRecordItem[] {
  const filtered =
    tab === "all"
      ? [...items]
      : items.filter((item) =>
          tab === "future" ? item.bucket === "future" : item.bucket === "past"
        );

  const direction = tab === "future" ? "asc" : "desc";
  return filtered.sort((a, b) => compareByEventDate(a, b, direction));
}

export function groupPickRecordList(
  items: PickRecordItem[],
  options?: { includeDateInHeader?: boolean }
): PickRecordListEntry[] {
  const includeDate = options?.includeDateInHeader ?? true;
  const entries: PickRecordListEntry[] = [];
  let lastEventId: string | null = null;

  for (const item of items) {
    const eventId = item.fight.event_id;
    if (eventId !== lastEventId) {
      entries.push({
        kind: "header",
        eventId,
        sport: item.fight.sport,
        eventName: item.fight.event.name,
        eventDateLabel: includeDate
          ? formatEventDateShort(item.fight)
          : "",
      });
      lastEventId = eventId;
    }
    entries.push({ kind: "row", item });
  }

  return entries;
}

function futureSectionSubtitle(items: PickRecordItem[]): string {
  const pending = items.filter((item) => item.status === "pending").length;
  const waiting = items.filter(
    (item) => item.status === "waiting_for_results"
  ).length;
  return `${items.length} upcoming · ${pending} pending · ${waiting} awaiting results`;
}

function pastSectionSubtitle(items: PickRecordItem[]): string {
  const won = items.filter(
    (item) => item.status === "won" || item.status === "perfect"
  ).length;
  const lost = items.filter((item) => item.status === "lost").length;
  const perfect = items.filter((item) => item.status === "perfect").length;
  const graded = won + lost;
  const accuracy =
    graded > 0 ? `${Math.round((won / graded) * 1000) / 10}%` : "—";
  return `${items.length} settled · ${won} won · ${lost} lost · ${perfect} perfect · ${accuracy} accuracy`;
}

export function buildPickRecordListEntries(
  items: PickRecordItem[],
  tab: PickRecordTab
): PickRecordListEntry[] {
  if (tab !== "all") {
    return groupPickRecordList(sortPickRecordItems(items, tab));
  }

  const entries: PickRecordListEntry[] = [];
  const future = sortPickRecordItems(
    items.filter((item) => item.bucket === "future"),
    "future"
  );
  const past = sortPickRecordItems(
    items.filter((item) => item.bucket === "past"),
    "past"
  );

  if (future.length > 0) {
    entries.push({
      kind: "section",
      sectionKey: "future",
      title: "FUTURE PICKS",
      subtitle: futureSectionSubtitle(future),
    });
    entries.push(...groupPickRecordList(future));
  }
  if (past.length > 0) {
    entries.push({
      kind: "section",
      sectionKey: "past",
      title: "PAST PICKS",
      subtitle: pastSectionSubtitle(past),
    });
    entries.push(...groupPickRecordList(past));
  }

  return entries;
}

export function formatCompactPickLine(item: PickRecordItem): string {
  const { prediction, fight } = item;
  const winner = getPredictedWinnerName(fight, prediction.predicted_outcome);
  const parts = [winner];
  if (prediction.predicted_method) {
    parts.push(methodLabel(prediction.predicted_method));
  }
  if (prediction.predicted_round != null) {
    parts.push(`R${prediction.predicted_round}`);
  }
  return `Pick: ${parts.join(" · ")}`;
}

export function formatCompactResultLine(item: PickRecordItem): string | null {
  if (item.fight.result == null) return null;
  const resultText = formatResultLine(item.fight, item.fight.result);
  return `Result: ${resultText}`;
}

export function formatFullPickLine(item: PickRecordItem): string {
  const { prediction, fight } = item;
  return formatPickLine(
    fight,
    prediction.predicted_outcome,
    prediction.predicted_method,
    prediction.predicted_round
  );
}

export function formatRatingChangeLine(item: PickRecordItem): string | null {
  const change = item.prediction.rating_change;
  if (change == null || item.bucket !== "past") return null;
  const prefix = change >= 0 ? "+" : "";
  const status = getPickRecordStatusLabel(item.status);
  return `${prefix}${change} · ${status}`;
}

export function formatEventHeaderLine(
  sport: FightWithRelations["sport"],
  eventName: string,
  eventDateLabel: string
): string {
  const sportLabel = sport.toUpperCase();
  if (eventDateLabel) {
    return `${sportLabel} · ${eventName} · ${eventDateLabel}`;
  }
  return `${sportLabel} · ${eventName}`;
}

export function formatExportGeneratedAt(iso: string): string {
  return formatDateTimeInZone(iso, "UTC", { includeTimeZoneName: false });
}
