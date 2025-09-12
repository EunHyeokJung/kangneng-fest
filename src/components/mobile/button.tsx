"use client";

import * as React from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type BaseButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  stretch?: boolean; // full width
  spinnerSize?: number;
};

export function MobileButton({
  className,
  loading,
  children,
  stretch = true,
  spinnerSize = 16,
  disabled,
  size = "lg",
  ...props
}: BaseButtonProps) {
  return (
    <Button
      size={size}
      className={clsx(stretch && "w-full", className)}
      aria-busy={loading || undefined}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Spinner size={spinnerSize} className="mr-1.5" />}
      {children}
    </Button>
  );
}

export function MobileSecondaryButton(props: BaseButtonProps) {
  return <MobileButton variant="secondary" {...props} />;
}

export function MobileOutlineButton(props: BaseButtonProps) {
  return <MobileButton variant="outline" {...props} />;
}

export function MobileDestructiveButton(props: BaseButtonProps) {
  return <MobileButton variant="destructive" {...props} />;
}
