import type { ReactElement } from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
} as const;

export function Spinner({ size = "md", className = "" }: SpinnerProps): ReactElement {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-[var(--color-border-default)] border-t-[var(--color-accent)] ${SIZE_CLASSES[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
