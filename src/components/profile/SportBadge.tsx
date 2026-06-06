import { cn } from "@/lib/utils";
import type { Sport } from "@/types";

export function SportBadge({ sport }: { sport: Sport }) {
  return (
    <span
      className={cn(
        "inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white",
        sport === "boxing" ? "bg-red-600" : "bg-purple-600"
      )}
    >
      {sport}
    </span>
  );
}
