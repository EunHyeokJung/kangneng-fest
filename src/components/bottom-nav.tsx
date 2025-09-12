"use client";

import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, MapPin, Home, Store, Megaphone } from "lucide-react";
import clsx from "clsx";

type Item = {
  value: string; // href
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const items: Item[] = [
  { value: "/", label: "홈", icon: Home },
  { value: "/schedule", label: "일정", icon: CalendarDays },
  { value: "/map", label: "지도", icon: MapPin },
  { value: "/booths", label: "주점", icon: Store },
  { value: "/notices", label: "공지", icon: Megaphone },
];

function activeValueFromPath(pathname: string): string {
  const match = items.find((it) => it.value !== "/" && pathname.startsWith(it.value));
  return match ? match.value : "/";
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const active = activeValueFromPath(pathname);

  return (
    <nav
      role="navigation"
      aria-label="하단 내비게이션"
      className="safe-pl safe-pr safe-pb fixed inset-x-0 bottom-0 z-40 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container-inline">
        <ToggleGroup.Root
          type="single"
          value={active}
          onValueChange={(v) => v && router.push(v)}
          className="grid h-[var(--bottom-nav-height)] grid-cols-5"
        >
          {items.map(({ value, label, icon: Icon }) => (
            <ToggleGroup.Item
              key={value}
              value={value}
              className={clsx(
                "group mx-1 flex items-center justify-center rounded-full text-muted-foreground transition-colors",
                "data-[state=on]:text-primary-foreground",
                "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                // inner pill background using pseudo-element to allow gradient without affecting layout
                "relative",
                "before:absolute before:inset-0 before:-z-10 before:rounded-full before:opacity-0 before:transition-opacity",
                "data-[state=on]:before:opacity-100 before:[background-image:var(--brand-gradient)]"
              )}
            >
              <span className="flex items-center gap-1.5 px-3 py-2">
                <Icon className="size-5" />
                <span className="text-[11px] leading-none">{label}</span>
              </span>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>
    </nav>
  );
}

