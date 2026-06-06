"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import {
  signInWithGoogleSignupAction,
  signUpAction,
} from "@/app/actions/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { getAuthErrorMessage } from "@/lib/auth/errors";

function SignUpForm() {
  const searchParams = useSearchParams();
  const oauthError = getAuthErrorMessage(searchParams.get("error"));
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(oauthError);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <AuthCard
      title="Sign up"
      subtitle="Choose your username, then sign up with email or Google."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-red-500 hover:text-red-400">
            Log in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Username
          </span>
          <input
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
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
        {success ? (
          <p className="rounded-lg border border-emerald-900/50 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
            {success}
          </p>
        ) : null}

        <form
          className="space-y-4"
          action={(formData) => {
            setError(null);
            setSuccess(null);
            startTransition(async () => {
              const result = await signUpAction(formData);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              setSuccess(
                result.needsEmailConfirmation
                  ? "You're in! Check your email for a confirmation link, then log in to start picking."
                  : "You're in! Log in to start picking."
              );
            });
          }}
        >
          <input type="hidden" name="username" value={username} />
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-[#2a2a2a] bg-[#181818] px-4 py-3 text-white outline-none focus:border-red-600"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Password
            </span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-1 w-full rounded-xl border border-[#2a2a2a] bg-[#181818] px-4 py-3 text-white outline-none focus:border-red-600"
            />
            <span className="mt-1 block text-xs text-zinc-600">
              Minimum 6 characters
            </span>
          </label>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-500 disabled:opacity-60"
          >
            {pending ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <AuthDivider />

        <form
          action={signInWithGoogleSignupAction}
          onSubmit={(event) => {
            if (!username.trim()) {
              event.preventDefault();
              setSuccess(null);
              setError("Username is required.");
            }
          }}
        >
          <input type="hidden" name="username" value={username} />
          <GoogleAuthButton disabled={pending} />
        </form>
      </div>
    </AuthCard>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
