import { BottomNav } from "./BottomNav";
import { BrandHeader } from "./BrandHeader";

interface AppShellProps {
  children: React.ReactNode;
  showBrand?: boolean;
  showTagline?: boolean;
  showBottomNav?: boolean;
}

export function AppShell({
  children,
  showBrand = true,
  showTagline = true,
  showBottomNav = true,
}: AppShellProps) {
  return (
    <div className="min-h-dvh pb-24">
      {showBrand && <BrandHeader showTagline={showTagline} />}
      <main className="mx-auto max-w-lg px-4">{children}</main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
