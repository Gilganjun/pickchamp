"use client";

import { cn } from "@/lib/utils";

interface TabBarProps<T extends string> {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
}: TabBarProps<T>) {
  return (
    <div className="flex border-b border-[#2a2a2a]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors",
            value === tab.id
              ? "border-b-2 border-red-500 text-red-500"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
