import { cn } from "@/lib/utils";

interface ProfileSectionHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function ProfileSectionHeading({
  children,
  className,
}: ProfileSectionHeadingProps) {
  return (
    <div className={cn("mb-2.5 flex items-center justify-center gap-3", className)}>
      <span
        className="h-px w-10 bg-gradient-to-r from-transparent to-zinc-600/80"
        aria-hidden
      />
      <h2 className="text-center font-[family-name:var(--font-teko)] text-xl font-bold uppercase tracking-wide text-white">
        {children}
      </h2>
      <span
        className="h-px w-10 bg-gradient-to-l from-transparent to-zinc-600/80"
        aria-hidden
      />
    </div>
  );
}
