"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition, Suspense } from "react";
import {
  signInAction,
  signInWithGoogleLoginAction,
} from "@/app/actions/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthDivider } from "@/components/auth/AuthDivider";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { getAuthErrorMessage } from "@/lib/auth/errors";

function LoginForm() {
  const searchParams = useSearchParams();
  const oauthError = getAuthErrorMessage(searchParams.get("error"));
  const [error, setError] = useState<string | null>(oauthError);
  const [pending, startTransition] = useTransition();

  return (
    <AuthCard
      title="Log in"
      subtitle="Log in with email and password or Google."
      footer={
        <>
          No account?{" "}
          <Link href="/signup" className="text-red-500 hover:text-red-400">
            Sign up
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        action={(formData) => {
          setError(null);
          startTransition(async () => {
            const result = await signInAction(formData);
            if (!result.ok) {
              setError(result.error);
            }
          });
        }}
      >
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
            autoComplete="current-password"
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
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>

      <AuthDivider />

      <form action={signInWithGoogleLoginAction}>
        <GoogleAuthButton disabled={pending} />
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
