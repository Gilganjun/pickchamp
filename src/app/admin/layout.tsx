import Link from "next/link";
import { requireAdminUser } from "@/lib/auth/admin";
import { usesLiveSupabase } from "@/lib/config";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if (usesLiveSupabase()) {
    const gate = await requireAdminUser();
    if (!gate.ok && gate.reason === "unauthenticated") {
      redirect("/login?next=/admin");
    }
    if (!gate.ok && gate.reason === "unauthorized") {
      return (
        <div className="min-h-dvh bg-zinc-950 p-6 text-white">
          <h1 className="text-2xl font-bold">Unauthorized</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Your account does not have admin access.
          </p>
          <Link href="/picks" className="mt-6 inline-block text-red-500">
            ← Back to picks
          </Link>
        </div>
      );
    }
  }

  return <>{children}</>;
}
