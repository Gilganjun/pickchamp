import { getAdminData } from "@/app/actions/admin";
import { ResultsForm } from "./ResultsForm";
import Link from "next/link";

export default async function AdminResultsPage() {
  const { fights } = await getAdminData();

  return (
    <div className="min-h-dvh bg-zinc-950 p-6 text-white max-w-2xl">
      <Link href="/admin" className="text-sm text-zinc-500">
        ← Admin
      </Link>
      <h1 className="mt-2 text-xl font-bold">Results & Grading</h1>
      <ResultsForm fights={fights} />
    </div>
  );
}
