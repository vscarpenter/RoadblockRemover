"use client";

import type { ReactElement } from "react";
import type { Status } from "@/types/roadblock";
import { STATUSES } from "@/constants/statuses";

interface DashboardFiltersProps {
  selectedStatuses: Status[];
  onStatusChange: (statuses: Status[]) => void;
  timeFrame: number | null;
  onTimeFrameChange: (days: number | null) => void;
}

const TIME_FRAMES = [
  { value: null, label: "All Time" },
  { value: 7, label: "Last 7 Days" },
  { value: 30, label: "Last 30 Days" },
  { value: 90, label: "Last 90 Days" },
] as const;

export function DashboardFilters({
  selectedStatuses,
  onStatusChange,
  timeFrame,
  onTimeFrameChange,
}: DashboardFiltersProps): ReactElement {
  function toggleStatus(status: Status): void {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Status:</span>
        <div className="flex flex-wrap gap-1">
          {STATUSES.map((s) => {
            const isSelected = selectedStatuses.includes(s.value);
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleStatus(s.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  isSelected
                    ? `${s.bgColor} ${s.color}`
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Period:</span>
        <select
          value={timeFrame ?? ""}
          onChange={(e) =>
            onTimeFrameChange(e.target.value ? Number(e.target.value) : null)
          }
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {TIME_FRAMES.map((tf) => (
            <option key={tf.label} value={tf.value ?? ""}>
              {tf.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
