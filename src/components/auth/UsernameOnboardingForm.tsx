"use client";

import { useState, useTransition } from "react";
import { completeUsernameOnboardingAction } from "@/app/actions/auth";
import { AuthCard } from "@/components/auth/AuthCard";

export function UsernameOnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <AuthCard
      title="Choose your username"
      subtitle="Pick your PickFist handle to finish setting up your account."
      footer={null}
    >
      <form
        className="space-y-4"
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            const result = await completeUsernameOnboardingAction(formData);
            if (!result.ok) {
              setError(result.error);
            }
          });
        }}
      >
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Username
          </span>
          <input
            name="username"
            type="text"
            required
            minLength={3}
            maxLength={24}
            pattern="[A-Za-z0-9_]{3,24}"
            autoComplete="username"
            className="mt-1 w-full rounded-xl border border-[#2a2a2a] bg-[#181818] px-4 py-3 text-white outline-none focus:border-red-600"
          />
        </label>
        {error ? (
          <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-500 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Continue"}
        </button>
      </form>
    </AuthCard>
  );
}
