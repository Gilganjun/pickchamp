import { usesLiveSupabase } from "@/lib/config";
import { syncDemoGradingForSettledFights } from "@/lib/mock/syncDemoGrading";
import { ensureSupabaseGradingForSettledFights } from "@/lib/grading/syncSupabaseGrading";

/**
 * Grade predictions for settled fights that have results but were never
 * run through the admin settle pipeline (e.g. SQL-only result seeds).
 */
export async function ensureSettledFightsGraded(): Promise<void> {
  if (usesLiveSupabase()) {
    await ensureSupabaseGradingForSettledFights();
    return;
  }
  syncDemoGradingForSettledFights();
}
