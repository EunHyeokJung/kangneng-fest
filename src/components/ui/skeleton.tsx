import * as React from "react";
import clsx from "clsx";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-foreground/5 dark:bg-foreground/10",
        className
      )}
      {...props}
    />
  );
}

