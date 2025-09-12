"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, MapPin, Home, Store, Megaphone } from "lucide-react";
import clsx from "clsx";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/schedule", label: "일정", icon: CalendarDays },
  { href: "/map", label: "지도", icon: MapPin },
  { href: "/booths", label: "주점", icon: Store },
  { href: "/notices", label: "공지", icon: Megaphone },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="safe-pl safe-pr safe-pb fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-inline flex h-[var(--bottom-nav-height)] items-stretch justify-between">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex w-full flex-col items-center justify-center gap-1 text-[11px]",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
