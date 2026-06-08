"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { usesLiveSupabase } from "@/lib/config";
import {
  getGuestPickCount,
  GUEST_PICKS_CHANGED_EVENT,
} from "@/lib/picks/guestPickStore";

const HIDDEN_PATH_PREFIXES = ["/login", "/signup", "/auth"];

export function GuestPickBanner() {
  const pathname = usePathname();
  const { isLoggedIn, ready } = useSupabaseAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!usesLiveSupabase()) return;

    const refresh = () => setCount(getGuestPickCount());
    refresh();

    window.addEventListener(GUEST_PICKS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(GUEST_PICKS_CHANGED_EVENT, refresh);
  }, []);

  useEffect(() => {
    if (!ready || isLoggedIn) return;
    setCount(getGuestPickCount());
  }, [ready, isLoggedIn]);

  if (!usesLiveSupabase() || !ready || isLoggedIn || count === 0) {
    return null;
  }

  if (HIDDEN_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const pickLabel = count === 1 ? "pick" : "picks";

  return (
    <div className="border-t border-red-900/50 bg-red-950/95 px-4 py-2 text-center text-xs">
      <span className="font-semibold text-red-200">
        {count} {pickLabel} waiting
      </span>
      <span className="text-zinc-500"> — </span>
      <Link
        href="/login?next=/picks"
        className="font-bold uppercase tracking-wide text-red-400 hover:text-red-300"
      >
        Sign in to save
      </Link>
    </div>
  );
}
