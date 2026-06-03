"use client";

import { useState } from "react";
import { settleFight } from "@/app/actions/admin";
import { AdminFormSection } from "@/components/AdminFormSection";
import type { Fight } from "@/types";
import type { GradingSummary } from "@/types/grading";

interface ResultsFormProps {
  fights: Fight[];
}

export function ResultsForm({ fights }: ResultsFormProps) {
  const [summary, setSummary] = useState<GradingSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await settleFight(formData);
    setPending(false);
    if (!res.ok) {
      setError(res.error ?? "Failed");
      return;
    }
    if (res.summary) setSummary(res.summary as GradingSummary);
  }

  return (
    <>
      <form action={handleSubmit}>
        <AdminFormSection title="Enter Result & Settle">
          <div className="space-y-3">
            <label className="block text-xs text-zinc-400">
              Fight *
              <select
                name="fight_id"
                required
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
              >
                {fights
                  .filter((f) => f.status !== "settled")
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.fighter_a_name} vs {f.fighter_b_name} ({f.scheduled_rounds}{" "}
                      rds)
                    </option>
                  ))}
              </select>
            </label>
            <label className="block text-xs text-zinc-400">
              Outcome *
              <select
                name="outcome"
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
              >
                <option value="fighterA">Fighter A</option>
                <option value="fighterB">Fighter B</option>
                <option value="draw">Draw</option>
                <option value="no_contest">No Contest</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label className="block text-xs text-zinc-400">
              Method *
              <select
                name="method"
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
              >
                <option value="decision">Decision</option>
                <option value="ko_tko">KO/TKO</option>
                <option value="submission">Submission</option>
                <option value="dq">DQ</option>
                <option value="technical_decision">Technical Decision</option>
                <option value="draw">Draw</option>
                <option value="no_contest">No Contest</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
            <label className="block text-xs text-zinc-400">
              Result round (nullable for decision)
              <input
                name="result_round"
                type="number"
                min={1}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs text-zinc-400">
              Notes
              <textarea
                name="official_notes"
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
              />
            </label>
            <button
              type="submit"
              disabled={pending}
              className="rounded bg-red-600 px-4 py-2 text-sm font-bold disabled:opacity-50"
            >
              {pending ? "Grading…" : "Settle Fight & Grade Predictions"}
            </button>
          </div>
        </AdminFormSection>
      </form>

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      {summary && (
        <div className="mt-6 rounded border border-green-800 bg-green-950/30 p-4 text-sm">
          <h3 className="font-bold text-green-400">Grading Summary</h3>
          <ul className="mt-2 space-y-1 text-zinc-300">
            <li>Total predictions: {summary.totalPredictions}</li>
            <li>Fighter A picks: {summary.fighterAPickCount}</li>
            <li>Fighter B picks: {summary.fighterBPickCount}</li>
            <li>Draw picks: {summary.drawPickCount}</li>
            {summary.popularity && (
              <li>
                Popularity (analytics): A {summary.popularity.fighterA}% · B{" "}
                {summary.popularity.fighterB}% · Draw {summary.popularity.draw}%
              </li>
            )}
            <li>Correct: {summary.correctCount}</li>
            <li>Avg rating change: {summary.averageRatingChange}</li>
            <li>Largest gain: {summary.largestGain}</li>
            <li>Largest loss: {summary.largestLoss}</li>
          </ul>
        </div>
      )}
    </>
  );
}
