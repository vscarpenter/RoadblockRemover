"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HeatMap } from "@/components/dashboard/HeatMap";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { useRoadblocks } from "@/hooks/useRoadblocks";
import { Spinner } from "@/components/ui/Spinner";
import type { Status } from "@/types/roadblock";

function HeatmapSkeleton(): ReactElement {
  return (
    <div className="space-y-2">
      {/* Header row */}
      <div className="grid grid-cols-[160px_repeat(4,1fr)_80px] gap-2">
        <div />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-6" />
        ))}
        <div className="skeleton h-6" />
      </div>
      {/* Data rows */}
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className="grid grid-cols-[160px_repeat(4,1fr)_80px] gap-2">
          <div className="skeleton h-20" />
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="skeleton h-20" />
          ))}
          <div className="skeleton h-20" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage(): ReactElement {
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([
    "Open",
    "In Progress",
  ]);
  const [timeFrame, setTimeFrame] = useState<number | null>(null);

  const { roadblocks, isLoading, error } = useRoadblocks({
    statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    daysBack: timeFrame,
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
            Friction{" "}
            <span className="bg-gradient-to-r from-violet-400 to-rose-400 bg-clip-text text-transparent">
              Heat Map
            </span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Real-time view of engineering roadblocks by category and severity
          </p>
        </div>

        <DashboardFilters
          selectedStatuses={selectedStatuses}
          onStatusChange={setSelectedStatuses}
          timeFrame={timeFrame}
          onTimeFrameChange={setTimeFrame}
        />

        {isLoading && (
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
            <HeatmapSkeleton />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!isLoading && !error && roadblocks.length === 0 && (
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent-muted)]">
              <svg className="h-6 w-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
              </svg>
            </div>
            <p className="text-[var(--color-text-secondary)]">
              No roadblocks found. Be the first to{" "}
              <a href="/report/" className="text-[var(--color-accent-hover)] hover:underline">
                report one
              </a>
              .
            </p>
          </div>
        )}

        {!isLoading && !error && roadblocks.length > 0 && (
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
            <HeatMap roadblocks={roadblocks} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
