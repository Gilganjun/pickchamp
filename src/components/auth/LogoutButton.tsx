"use client";

import { useTransition } from "react";
import { signOutAction } from "@/app/actions/auth";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOutAction())}
      className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-300 hover:border-zinc-600 hover:text-white disabled:opacity-60"
    >
      {pending ? "Logging out…" : "Log out"}
    </button>
  );
}
