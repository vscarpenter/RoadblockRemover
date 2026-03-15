"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ReactElement } from "react";
import { ClientResponseError } from "pocketbase";
import { useAuth } from "@/hooks/useAuth";

const MIN_PASSWORD_LENGTH = 8;

function formatPocketBaseError(err: unknown): string {
  if (!(err instanceof ClientResponseError)) {
    return err instanceof Error ? err.message : "Registration failed. Please try again.";
  }

  const fieldErrors = err.response?.data;
  if (!fieldErrors || typeof fieldErrors !== "object") {
    return err.message;
  }

  const messages: string[] = [];
  for (const [field, detail] of Object.entries(fieldErrors)) {
    const { code } = detail as { code: string; message: string };
    if (field === "email" && code === "validation_not_unique") {
      messages.push("An account with this email already exists.");
    } else if (field === "email" && code === "validation_invalid_email") {
      messages.push("Please enter a valid email address.");
    } else {
      messages.push((detail as { message: string }).message);
    }
  }

  return messages.length > 0 ? messages.join(" ") : err.message;
}

export function RegisterForm(): ReactElement {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(email, password, passwordConfirm);
      router.replace("/dashboard/");
    } catch (err) {
      setError(formatPocketBaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClasses = "mt-1.5 block w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/50";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Email
        </label>
        <input
          id="register-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="register-password-confirm" className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Confirm Password
        </label>
        <input
          id="register-password-confirm"
          type="password"
          required
          minLength={8}
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          className={inputClasses}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-violet-500 px-4 py-2.5 text-sm font-medium text-white transition-all duration-150 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-base)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
