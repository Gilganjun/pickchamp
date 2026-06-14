import { cn } from "@/lib/utils";

export function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-3.5 w-3.5", className)}
      aria-hidden
    >
      <path d="M4 18h16v2H4v-2zm1.5-3 2.2-6.3 3.3 3.6L12 4.5l1 3.8 3.3-3.6L18.5 15H5.5z" />
    </svg>
  );
}

export function MedalIcon({
  className,
  variant = "silver",
}: {
  className?: string;
  variant?: "silver" | "bronze";
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn(
        "h-3.5 w-3.5",
        variant === "silver" ? "text-[#c0c0c0]" : "text-[#cd7f32]",
        className
      )}
      aria-hidden
    >
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 14 6 21M15.5 14 18 21" strokeLinecap="round" />
    </svg>
  );
}
