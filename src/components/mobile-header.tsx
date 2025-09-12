"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "/", label: "홈" },
  { href: "/schedule", label: "일정" },
  { href: "/map", label: "지도" },
  { href: "/booths", label: "주점" },
  { href: "/notices", label: "공지" },
];

export function MobileHeader({ title }: { title?: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-[var(--header-height)] border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-inline safe-pl safe-pr flex h-full items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="메뉴 열기">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="safe-pl p-0">
            <nav className="p-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex-1 truncate text-center text-[15px] font-semibold">
          {title ?? "ALL STAR"}
        </div>

        {/* Right side spacer for symmetry */}
        <div className="w-9" />
      </div>
    </header>
  );
}
