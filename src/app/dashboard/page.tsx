"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HeatMap } from "@/components/dashboard/HeatMap";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { useRoadblocks } from "@/hooks/useRoadblocks";
import { Spinner } from "@/components/ui/Spinner";
import type { Status } from "@/types/roadblock";

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
          <h1 className="text-2xl font-bold text-gray-900">
            Friction Heat Map
          </h1>
          <p className="mt-1 text-gray-600">
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
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {!isLoading && !error && roadblocks.length === 0 && (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <p className="text-gray-500">
              No roadblocks found. Be the first to{" "}
              <a href="/report/" className="text-blue-600 hover:underline">
                report one
              </a>
              .
            </p>
          </div>
        )}

        {!isLoading && !error && roadblocks.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <HeatMap roadblocks={roadblocks} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
