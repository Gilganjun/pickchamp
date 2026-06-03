"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/picks", label: "Picks", icon: "✓" },
  { href: "/rankings", label: "Rankings", icon: "🏆" },
  { href: "/events", label: "Events", icon: "📅" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-[64px] flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-[10px] font-semibold uppercase tracking-wide transition-colors",
                active ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <span className="text-base leading-none" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
