import {
  GLOBAL_RANK_ELIGIBILITY,
  SPORT_RANK_ELIGIBILITY,
} from "@/lib/rating/constants";
import { getGradedCount } from "@/lib/rankings";
import { getLockCountdown, inferFightTab, isFightLocked } from "@/lib/utils";
import type {
  FightResult,
  FightWithRelations,
  Prediction,
  Profile,
  RankDisplay,
  RankingTab,
  PredictedMethod,
  PredictedOutcome,
} from "@/types";

export function getPredictorTitle(globalRating: number): string {
  if (globalRating < 1000) return "Rookie Predictor";
  if (globalRating < 1100) return "Rising Predictor";
  if (globalRating < 1250) return "Sharp Fan";
  if (globalRating < 1500) return "Fight Analyst";
  return "Elite Predictor";
}

export function getProgress(current: number, required: number) {
  const safeRequired = Math.max(required, 1);
  const clamped = Math.min(Math.max(current, 0), safeRequired);
  return {
    current: clamped,
    required: safeRequired,
    percent: Math.min(100, Math.round((clamped / safeRequired) * 100)),
    remaining: Math.max(0, required - current),
  };
}

export function getEligibilityThreshold(tab: RankingTab): number {
  return tab === "global" ? GLOBAL_RANK_ELIGIBILITY : SPORT_RANK_ELIGIBILITY;
}

export function formatRankStatus(status: RankDisplay["status"]): string {
  if (status === "inactive") return "Inactive";
  if (status === "provisional") return "Unranked";
  return "Official Rank";
}

export function getSportPickStats(profile: Profile, sport: "boxing" | "mma") {
  const picks =
    sport === "boxing" ? profile.boxing_picks : profile.mma_picks;
  const correct =
    sport === "boxing" ? profile.boxing_correct : profile.mma_correct;
  const incorrect = Math.max(0, picks - correct);
  return {
    picks,
    correct,
    incorrect,
    accuracy: getSportAccuracy(profile, sport),
  };
}

export function getSportAccuracy(profile: Profile, tab: "boxing" | "mma"): number {
  const picks = tab === "boxing" ? profile.boxing_picks : profile.mma_picks;
  const correct =
    tab === "boxing" ? profile.boxing_correct : profile.mma_correct;
  if (picks === 0) return 0;
  return Math.round((correct / picks) * 1000) / 10;
}

export function getGlobalAccuracy(profile: Profile): number {
  const graded = profile.boxing_picks + profile.mma_picks;
  if (graded === 0) return 0;
  return Math.round((profile.total_correct / graded) * 1000) / 10;
}

const METHOD_LABELS: Record<string, string> = {
  decision: "Decision",
  ko_tko: "KO",
  submission: "Submission",
  dq: "DQ",
  technical_decision: "Tech Decision",
  draw: "Draw",
  no_contest: "No Contest",
  cancelled: "Cancelled",
};

export function methodLabel(method: PredictedMethod | string): string {
  return METHOD_LABELS[method] ?? method;
}

function formatOutcomeLine(
  fight: FightWithRelations,
  outcome: PredictedOutcome | FightResult["outcome"],
  method: PredictedMethod | FightResult["method"] | null,
  round: number | null
): string {
  if (outcome === "no_contest") return "No Contest";
  if (outcome === "cancelled") return "Cancelled";

  const winner =
    outcome === "fighterA"
      ? fight.fighter_a_name
      : outcome === "fighterB"
        ? fight.fighter_b_name
        : "Draw";
  const methodPart =
    method && method !== "draw" ? ` by ${methodLabel(method)}` : "";
  const roundPart = round != null ? ` R${round}` : "";
  return `${winner}${methodPart}${roundPart}`;
}

export function formatPickLine(
  fight: FightWithRelations,
  outcome: PredictedOutcome,
  method: PredictedMethod | null,
  round: number | null
): string {
  return formatOutcomeLine(fight, outcome, method, round);
}

export function formatResultLine(
  fight: FightWithRelations,
  result: FightResult
): string {
  return formatOutcomeLine(
    fight,
    result.outcome,
    result.method,
    result.result_round
  );
}

export type FormOutcome = "win" | "loss" | "pending";

export function getRecentFormOutcomes(
  predictions: Prediction[],
  limit = 10
): FormOutcome[] {
  return [...predictions]
    .filter((p) => p.graded_at != null)
    .sort(
      (a, b) =>
        new Date(b.graded_at!).getTime() - new Date(a.graded_at!).getTime()
    )
    .slice(0, limit)
    .reverse()
    .map((p) => {
      if (p.main_correct === true) return "win";
      if (p.main_correct === false) return "loss";
      return "pending";
    });
}

export function getGradedCountForTab(profile: Profile, tab: RankingTab): number {
  return getGradedCount(profile, tab);
}

export interface CurrentPickItem {
  prediction: Prediction;
  fight: FightWithRelations;
}

const INACTIVE_FIGHT_STATUSES = new Set([
  "settled",
  "cancelled",
  "no_contest",
]);

export function isActiveCurrentPickFight(fight: FightWithRelations): boolean {
  return !INACTIVE_FIGHT_STATUSES.has(fight.status);
}

/** Public profiles may only show picks after lock time has passed. */
export function isCurrentPickPublicVisible(fight: FightWithRelations): boolean {
  return isFightLocked(fight);
}

export function getCurrentPickLockLabel(fight: FightWithRelations): string {
  const tab = inferFightTab(fight.status, fight.lock_time);
  if (tab === "live") {
    if (fight.status === "result_pending" || fight.status === "locked") {
      return "Locked — awaiting result";
    }
    return "Live card";
  }
  const countdown = getLockCountdown(fight.lock_time);
  if (countdown === "Locked") return "Locked — awaiting result";
  return countdown;
}

function compareCurrentPicks(a: CurrentPickItem, b: CurrentPickItem): number {
  const lockDiff =
    new Date(a.fight.lock_time).getTime() -
    new Date(b.fight.lock_time).getTime();
  if (lockDiff !== 0) return lockDiff;
  const eventDiff =
    new Date(a.fight.event.event_date).getTime() -
    new Date(b.fight.event.event_date).getTime();
  if (eventDiff !== 0) return eventDiff;
  const orderA = a.fight.fight_order ?? 999;
  const orderB = b.fight.fight_order ?? 999;
  return orderA - orderB;
}

export function getCurrentPickItems(
  predictions: Prediction[],
  fights: FightWithRelations[],
  options: { isOwnProfile: boolean }
): CurrentPickItem[] {
  const fightById = new Map(fights.map((fight) => [fight.id, fight]));
  const items: CurrentPickItem[] = [];

  for (const prediction of predictions) {
    if (prediction.graded_at != null) continue;
    const fight = fightById.get(prediction.fight_id);
    if (!fight || !isActiveCurrentPickFight(fight)) continue;
    if (
      !options.isOwnProfile &&
      !isCurrentPickPublicVisible(fight)
    ) {
      continue;
    }
    items.push({ prediction, fight });
  }

  return items.sort(compareCurrentPicks);
}

export function hasHiddenOpenPicksOnPublicProfile(
  predictions: Prediction[],
  fights: FightWithRelations[]
): boolean {
  if (predictions.length === 0 || fights.length === 0) return false;
  const fightById = new Map(fights.map((fight) => [fight.id, fight]));

  for (const prediction of predictions) {
    if (prediction.graded_at != null) continue;
    const fight = fightById.get(prediction.fight_id);
    if (!fight || !isActiveCurrentPickFight(fight)) continue;
    if (!isCurrentPickPublicVisible(fight)) return true;
  }
  return false;
}

export function getRecentFormSummary(predictions: Prediction[], limit = 5) {
  const outcomes = getRecentFormOutcomes(predictions, limit);
  const wins = outcomes.filter((o) => o === "win").length;
  const losses = outcomes.filter((o) => o === "loss").length;
  return {
    outcomes,
    wins,
    losses,
    label:
      outcomes.length > 0
        ? `Last ${outcomes.length}: ${wins}–${losses}`
        : null,
  };
}

export function formatSportRecord(
  correct: number,
  incorrect: number,
  accuracy: number
): string {
  return `${correct}–${incorrect} · ${accuracy}%`;
}
