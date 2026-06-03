"use client";

import { cn } from "@/lib/utils";
import type { SportFilter as SportFilterType } from "@/types";

const filters: { id: SportFilterType; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "🌐" },
  { id: "boxing", label: "Boxing", icon: "🥊" },
  { id: "mma", label: "MMA", icon: "⬡" },
];

interface SportFilterProps {
  value: SportFilterType;
  onChange: (value: SportFilterType) => void;
}

export function SportFilter({ value, onChange }: SportFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          onClick={() => onChange(f.id)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
            value === f.id
              ? "border-red-500 bg-red-500/10 text-white"
              : "border-[#2a2a2a] bg-[#111111] text-zinc-400 hover:border-zinc-600"
          )}
        >
          <span aria-hidden>{f.icon}</span>
          {f.label}
        </button>
      ))}
    </div>
  );
}
