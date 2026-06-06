import fs from "fs";
import path from "path";
import { usesLiveSupabase } from "@/lib/config";
import type { Prediction } from "@/types";

const MOCK_DATA_DIR = path.join(process.cwd(), ".mock-data");
const PREDICTIONS_FILE = path.join(MOCK_DATA_DIR, "demo-predictions.json");

type DemoPredictionGlobal = typeof globalThis & {
  __pickfistDemoPredictions?: Prediction[];
  __pickfistDemoPredictionsLoaded?: boolean;
};

function getGlobalState(): DemoPredictionGlobal {
  return globalThis as DemoPredictionGlobal;
}

function shouldUseDemoStore(): boolean {
  return !usesLiveSupabase();
}

function shouldPersistToDisk(): boolean {
  return shouldUseDemoStore() && process.env.NODE_ENV === "development";
}

function readPredictionsFromDisk(): Prediction[] | null {
  if (!shouldPersistToDisk()) return null;
  try {
    if (!fs.existsSync(PREDICTIONS_FILE)) return null;
    const raw = fs.readFileSync(PREDICTIONS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Prediction[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writePredictionsToDisk(predictions: Prediction[]): void {
  if (!shouldPersistToDisk()) return;
  try {
    fs.mkdirSync(MOCK_DATA_DIR, { recursive: true });
    fs.writeFileSync(PREDICTIONS_FILE, JSON.stringify(predictions, null, 2));
  } catch (error) {
    console.warn("[demo] Failed to persist mock predictions:", error);
  }
}

function loadAllDemoPredictions(): Prediction[] {
  if (!shouldUseDemoStore()) return [];

  const globalState = getGlobalState();
  if (globalState.__pickfistDemoPredictionsLoaded) {
    return globalState.__pickfistDemoPredictions ?? [];
  }

  const fromDisk = readPredictionsFromDisk();
  const predictions = fromDisk ?? [];
  globalState.__pickfistDemoPredictions = predictions;
  globalState.__pickfistDemoPredictionsLoaded = true;
  return predictions;
}

function saveAllDemoPredictions(predictions: Prediction[]): void {
  if (!shouldUseDemoStore()) return;

  const globalState = getGlobalState();
  globalState.__pickfistDemoPredictions = predictions;
  globalState.__pickfistDemoPredictionsLoaded = true;
  writePredictionsToDisk(predictions);
}

export function getAllDemoPredictions(): Prediction[] {
  return [...loadAllDemoPredictions()];
}

export function getDemoPredictionsForUser(userId: string): Prediction[] {
  return loadAllDemoPredictions().filter((p) => p.user_id === userId);
}

export function upsertDemoPrediction(
  pred: Omit<Prediction, "id" | "created_at" | "updated_at"> & {
    id?: string;
  }
): Prediction {
  const all = loadAllDemoPredictions();
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
    const next = all.map((p) => (p.id === existing.id ? updated : p));
    saveAllDemoPredictions(next);
    return updated;
  }

  const created: Prediction = {
    ...pred,
    id: pred.id ?? `pred-${Date.now()}`,
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
  saveAllDemoPredictions([...all, created]);
  return created;
}

export function updateDemoPrediction(
  id: string,
  patch: Partial<Prediction>
): void {
  const all = loadAllDemoPredictions();
  const next = all.map((p) => (p.id === id ? { ...p, ...patch } : p));
  saveAllDemoPredictions(next);
}

/** Dev-only helper — clears persisted demo picks for a fresh test session. */
export function clearDemoPredictions(): void {
  saveAllDemoPredictions([]);
  if (shouldPersistToDisk() && fs.existsSync(PREDICTIONS_FILE)) {
    try {
      fs.unlinkSync(PREDICTIONS_FILE);
    } catch {
      // ignore
    }
  }
}
