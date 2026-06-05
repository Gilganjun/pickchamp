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
  showProfileLink?: boolean;
}

export function AppShell({
  children,
  showBrand = true,
  showTagline = true,
  showBottomNav = true,
  prominentBrand = false,
  showProfileLink = false,
}: AppShellProps) {
  return (
    <div className="min-h-dvh w-full pb-24">
      <main className={cn("pickfist-content", prominentBrand && "pt-0")}>
        {showBrand && (
          <BrandHeader
            showTagline={showTagline}
            prominent={prominentBrand}
            centered={prominentBrand}
            showProfileLink={showProfileLink}
          />
        )}
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
