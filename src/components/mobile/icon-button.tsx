"use client";

import * as React from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  sm: "size-9",
  md: "size-10",
  lg: "size-12",
};

export function IconButton({
  className,
  iconSize = "md",
  ...props
}: React.ComponentProps<typeof Button> & { iconSize?: Size }) {
  return (
    <Button
      variant={props.variant ?? "ghost"}
      size={"icon"}
      className={clsx("rounded-full", sizeMap[iconSize], className)}
      {...props}
    />
  );
}
