import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = "", ...props }, ref) => {
    const textareaId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-[var(--color-text-secondary)]"
        >
          {label}
        </label>
        {hint && (
          <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">{hint}</p>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          className={`mt-1.5 block w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-colors duration-150 focus:outline-none focus:ring-1 ${
            error
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
              : "border-[var(--color-border-default)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/50"
          } ${className}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1.5 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
