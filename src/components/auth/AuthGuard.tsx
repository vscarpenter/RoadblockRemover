"use client";

import { useEffect } from "react";
import type { ReactElement, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: ReactNode }): ReactElement | null {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-base)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border-default)] border-t-[var(--color-accent)]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
