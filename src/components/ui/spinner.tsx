import React from "react";
import clsx from "clsx";

export function Spinner({
  size = 16,
  className,
  label = "로딩 중",
}: {
  size?: number;
  className?: string;
  label?: string;
}) {
  const style: React.CSSProperties = { width: size, height: size };
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={clsx(
        "inline-block animate-spin rounded-full border border-current border-t-transparent",
        className
      )}
      style={style}
    />
  );
}

