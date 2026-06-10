import { cn } from "@/lib/utils";
import type { PickRecordBucket } from "@/lib/pickRecord/pickRecord";

interface PickRecordSectionDividerProps {
  sectionKey: PickRecordBucket;
  title: string;
  subtitle: string;
}

export function PickRecordSectionDivider({
  sectionKey,
  title,
  subtitle,
}: PickRecordSectionDividerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2.5",
        sectionKey === "future"
          ? "border-sky-600/35 bg-sky-600/10"
          : "border-[#d4a853]/35 bg-[#d4a853]/10"
      )}
    >
      <p
        className={cn(
          "font-[family-name:var(--font-teko)] text-xl font-bold uppercase leading-none tracking-wide",
          sectionKey === "future" ? "text-sky-300" : "text-[#d4a853]"
        )}
      >
        {title}
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
        {subtitle}
      </p>
    </div>
  );
}
