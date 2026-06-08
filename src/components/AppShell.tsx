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
  centeredBrand?: boolean;
  showProfileLink?: boolean;
}

export function AppShell({
  children,
  showBrand = true,
  showTagline = true,
  showBottomNav = true,
  prominentBrand = false,
  centeredBrand = false,
  showProfileLink = false,
}: AppShellProps) {
  return (
    <div className="min-h-dvh w-full pb-28">
      <main className={cn("pickfist-content", prominentBrand && "pt-0")}>
        {showBrand && (
          <BrandHeader
            showTagline={showTagline}
            prominent={prominentBrand}
            centered={prominentBrand || centeredBrand}
            showProfileLink={showProfileLink}
          />
        )}
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
