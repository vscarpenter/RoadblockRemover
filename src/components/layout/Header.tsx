"use client";

import type { ReactElement } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps): ReactElement {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 px-4 backdrop-blur-xl lg:px-6">
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-text-primary)] lg:hidden"
        aria-label="Toggle navigation"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="hidden lg:block" />

      {/* User section */}
      <div className="flex items-center gap-3">
        {user && (
          <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
            {user.email}
          </span>
        )}
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
