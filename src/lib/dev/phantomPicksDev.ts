import fs from "fs";
import path from "path";
import type { Event, FightWithRelations, Prediction } from "@/types";

const MOCK_DATA_DIR = path.join(process.cwd(), ".mock-data");
const PHANTOM_CARD_FILE = path.join(MOCK_DATA_DIR, "phantom-picks-card.json");
const PHANTOM_PREDICTIONS_FILE = path.join(
  MOCK_DATA_DIR,
  "phantom-predictions.json"
);

export const PHANTOM_FIGHT_ID_PREFIX = "phantom-local-";

export function isPhantomLocalFightId(fightId: string): boolean {
  return fightId.startsWith(PHANTOM_FIGHT_ID_PREFIX);
}

function isPhantomDevEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.PICKFIST_PHANTOM_CARD === "true"
  );
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return null;
  }
}

function writeJsonFile(filePath: string, data: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

type PhantomCardFile = {
  event: Event;
  fights: Array<
    Omit<FightWithRelations, "event" | "userPrediction" | "result"> & {
      result?: FightWithRelations["result"];
    }
  >;
};

function loadPhantomPredictions(): Prediction[] {
  return readJsonFile<Prediction[]>(PHANTOM_PREDICTIONS_FILE) ?? [];
}

export function getPhantomPredictionsForDev(userId?: string): Prediction[] {
  if (!isPhantomDevEnabled()) return [];
  const all = loadPhantomPredictions();
  if (!userId) return all;
  return all.filter((p) => p.user_id === userId);
}

function savePhantomPredictions(predictions: Prediction[]): void {
  writeJsonFile(PHANTOM_PREDICTIONS_FILE, predictions);
}

export function appendPhantomPicksForDev(
  fights: FightWithRelations[],
  userId?: string
): FightWithRelations[] {
  if (!isPhantomDevEnabled()) return fights;

  const card = readJsonFile<PhantomCardFile>(PHANTOM_CARD_FILE);
  if (!card) return fights;

  const predictions = loadPhantomPredictions();
  const userPredictions = userId
    ? predictions.filter((p) => p.user_id === userId)
    : [];

  const phantomFights: FightWithRelations[] = card.fights.map((fight) => ({
    ...fight,
    event: card.event,
    result: fight.result ?? null,
    userPrediction:
      userPredictions.find((p) => p.fight_id === fight.id) ?? null,
  }));

  const withoutStalePhantom = fights.filter(
    (f) => !isPhantomLocalFightId(f.id)
  );

  return [...phantomFights, ...withoutStalePhantom];
}

export function getPhantomEventsForDev(
  events: Event[],
  fights: FightWithRelations[]
): Event[] {
  if (!isPhantomDevEnabled()) return events;

  const phantomEventIds = new Set(
    fights.filter((f) => isPhantomLocalFightId(f.id)).map((f) => f.event_id)
  );
  if (phantomEventIds.size === 0) return events;

  const card = readJsonFile<PhantomCardFile>(PHANTOM_CARD_FILE);
  if (!card) return events;

  const withoutPhantom = events.filter((e) => !phantomEventIds.has(e.id));
  return [card.event, ...withoutPhantom].sort(
    (a, b) =>
      new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );
}

export function upsertPhantomLocalPrediction(
  pred: Omit<Prediction, "id" | "created_at" | "updated_at"> & { id?: string }
): Prediction | null {
  if (!isPhantomDevEnabled() || !isPhantomLocalFightId(pred.fight_id)) {
    return null;
  }

  const all = loadPhantomPredictions();
  const existing = all.find(
    (p) => p.user_id === pred.user_id && p.fight_id === pred.fight_id
  );
  const nowIso = new Date().toISOString();

  if (existing) {
    const updated: Prediction = {
      ...existing,
      ...pred,
      updated_at: nowIso,
    };
    savePhantomPredictions(
      all.map((p) => (p.id === existing.id ? updated : p))
    );
    return updated;
  }

  const created: Prediction = {
    ...pred,
    id: pred.id ?? `phantom-pred-${Date.now()}`,
    created_at: nowIso,
    updated_at: nowIso,
    locked_at: pred.locked_at ?? null,
    graded_at: pred.graded_at ?? null,
    rating_change: pred.rating_change ?? null,
    main_correct: pred.main_correct ?? null,
    method_correct: pred.method_correct ?? null,
    round_correct: pred.round_correct ?? null,
    perfect_pick: pred.perfect_pick ?? null,
    grading_details: pred.grading_details ?? null,
  };
  savePhantomPredictions([...all, created]);
  return created;
}
