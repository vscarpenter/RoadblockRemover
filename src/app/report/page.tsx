"use client";

import type { ReactElement } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ReportForm } from "@/components/roadblocks/ReportForm";

export default function ReportPage(): ReactElement {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-semibold text-[var(--color-text-primary)]">
          Report a Roadblock
        </h1>
        <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
          Help leadership identify and fix the friction slowing your team down.
        </p>
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
          <ReportForm />
        </div>
      </div>
    </AppShell>
  );
}
