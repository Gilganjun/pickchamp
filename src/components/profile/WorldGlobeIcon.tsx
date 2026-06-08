import { cn } from "@/lib/utils";

interface WorldGlobeIconProps {
  className?: string;
  size?: number;
}

export function WorldGlobeIcon({ className, size = 14 }: WorldGlobeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0 text-[#d4a853]", className)}
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="4"
        ry="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1" />
      <path d="M4.5 7.5h15" stroke="currentColor" strokeWidth="0.75" />
      <path d="M4.5 16.5h15" stroke="currentColor" strokeWidth="0.75" />
    </svg>
  );
}
