import { ReactNode } from "react";
import { MobileHeader } from "@/components/mobile-header";
import { BottomNav } from "@/components/bottom-nav";

export function AppShell({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="relative mx-auto min-h-screen w-full">
      <MobileHeader title={title} />
      <main className="container-inline safe-pl safe-pr content-area">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
