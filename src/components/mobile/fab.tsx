"use client";

import * as React from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

type FabProps = React.ComponentProps<typeof Button> & {
  bottomOffset?: number; // extra px above bottom nav
  label?: string;
};

export function Fab({
  className,
  bottomOffset = 16,
  label,
  children,
  size = "lg",
  ...props
}: FabProps) {
  const style: React.CSSProperties = {
    bottom: `calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + ${bottomOffset}px)`,
  };
  return (
    <Button
      size={size}
      className={clsx(
        "fixed right-4 z-50 rounded-full shadow-lg",
        className
      )}
      style={style}
      {...props}
    >
      {children ?? label}
    </Button>
  );
}

