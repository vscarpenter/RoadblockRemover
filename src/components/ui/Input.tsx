import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`mt-1.5 block w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-colors duration-150 focus:outline-none focus:ring-1 ${
            error
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
              : "border-[var(--color-border-default)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/50"
          } ${className}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
