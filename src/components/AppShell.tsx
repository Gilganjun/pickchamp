"use client";

import { BottomNav } from "./BottomNav";
import { BrandHeader } from "./BrandHeader";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  showBrand?: boolean;
  showTagline?: boolean;
  showBottomNav?: boolean;
  prominentBrand?: boolean;
}

export function AppShell({
  children,
  showBrand = true,
  showTagline = true,
  showBottomNav = true,
  prominentBrand = false,
}: AppShellProps) {
  return (
    <div className="min-h-dvh w-full pb-24">
      <main className={cn("pickchamp-content", prominentBrand && "pt-0")}>
        {showBrand && (
          <BrandHeader
            showTagline={showTagline}
            prominent={prominentBrand}
            centered={prominentBrand}
          />
        )}
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
