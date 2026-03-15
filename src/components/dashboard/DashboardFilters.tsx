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
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)]">
          Status
        </span>
        <div className="flex flex-wrap gap-1">
          {STATUSES.map((s) => {
            const isSelected = selectedStatuses.includes(s.value);
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleStatus(s.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  isSelected
                    ? `${s.bgColor} ${s.color} border border-current/15`
                    : "border border-[var(--color-border-subtle)] text-[var(--color-text-tertiary)] hover:border-[var(--color-border-default)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)]">
          Period
        </span>
        <select
          value={timeFrame ?? ""}
          onChange={(e) =>
            onTimeFrameChange(e.target.value ? Number(e.target.value) : null)
          }
          className="rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs text-[var(--color-text-primary)] transition-colors focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]/50"
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
