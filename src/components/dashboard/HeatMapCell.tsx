"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import type { Roadblock } from "@/types/roadblock";
import { RoadblockCard } from "@/components/roadblocks/RoadblockCard";

interface HeatMapCellProps {
  roadblocks: Roadblock[];
  maxCount: number;
}

const HEAT_THRESHOLDS = [
  { ceiling: 0.2, className: "bg-heat-1" },
  { ceiling: 0.4, className: "bg-heat-2" },
  { ceiling: 0.6, className: "bg-heat-3" },
  { ceiling: 0.8, className: "bg-heat-4" },
] as const;

/** Maps a count relative to max into a heat intensity CSS class */
function getHeatClass(count: number, maxCount: number): string {
  if (count === 0 || maxCount === 0) return "bg-gray-50";
  const ratio = count / maxCount;
  for (const { ceiling, className } of HEAT_THRESHOLDS) {
    if (ratio <= ceiling) return className;
  }
  return "bg-heat-5";
}

export function HeatMapCell({
  roadblocks,
  maxCount,
}: HeatMapCellProps): ReactElement {
  const [expanded, setExpanded] = useState(false);
  const count = roadblocks.length;
  const totalWaste = roadblocks.reduce(
    (sum, r) => sum + r.estimated_waste,
    0,
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => count > 0 && setExpanded(!expanded)}
        className={`flex h-20 w-full flex-col items-center justify-center rounded-md border border-gray-200 transition-colors ${getHeatClass(count, maxCount)} ${
          count > 0 ? "cursor-pointer hover:opacity-80" : "cursor-default"
        }`}
        aria-label={`${count} roadblocks, ${totalWaste} hours wasted per week`}
      >
        <span className="text-xl font-bold text-gray-900">{count}</span>
        {count > 0 && (
          <span className="text-xs text-gray-600">{totalWaste}h/wk</span>
        )}
      </button>

      {expanded && count > 0 && (
        <div className="absolute left-0 top-full z-30 mt-1 w-72 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {count} roadblock{count !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {roadblocks.map((r) => (
              <RoadblockCard key={r.id} roadblock={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
