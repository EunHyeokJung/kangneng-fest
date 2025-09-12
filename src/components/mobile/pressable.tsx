"use client";

import * as React from "react";
import clsx from "clsx";

type ExtraProps = { className?: string };
type AsProp<E extends React.ElementType> = { as?: E };
type PolymorphicProps<E extends React.ElementType> = AsProp<E> & Omit<React.ComponentPropsWithoutRef<E>, keyof AsProp<E>> & ExtraProps;

export function Pressable<E extends React.ElementType = "button">({ as, className, ...props }: PolymorphicProps<E>) {
  const Comp = (as || "button") as React.ElementType;
  return (
    <Comp
      className={clsx(
        "relative select-none rounded-lg transition active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "hover:bg-foreground/5 dark:hover:bg-foreground/10",
        className
      )}
      {...props}
    />
  );
}
