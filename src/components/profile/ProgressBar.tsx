import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  variant?: "red" | "gold" | "silver" | "bronze";
  className?: string;
}

const VARIANT_FILL: Record<NonNullable<ProgressBarProps["variant"]>, string> = {
  red: "bg-red-500",
  gold: "bg-[#d4a853]",
  silver: "bg-[#c0c0c0]",
  bronze: "bg-[#cd7f32]",
};

export function ProgressBar({
  percent,
  variant = "red",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-[#1a1a1a]",
        className
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300",
          VARIANT_FILL[variant]
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
