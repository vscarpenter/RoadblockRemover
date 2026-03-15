"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Roadblock } from "@/types/roadblock";
import { RoadblockCard } from "@/components/roadblocks/RoadblockCard";

interface HeatMapCellProps {
  roadblocks: Roadblock[];
  maxCount: number;
}

const HEAT_THRESHOLDS = [
  { ceiling: 0.2, bg: "bg-heat-1", glow: "heat-glow-1" },
  { ceiling: 0.4, bg: "bg-heat-2", glow: "heat-glow-2" },
  { ceiling: 0.6, bg: "bg-heat-3", glow: "heat-glow-3" },
  { ceiling: 0.8, bg: "bg-heat-4", glow: "heat-glow-4" },
] as const;

function getHeatStyles(count: number, maxCount: number): { bg: string; glow: string; textColor: string } {
  if (count === 0 || maxCount === 0) {
    return { bg: "bg-[var(--color-surface-raised)]", glow: "", textColor: "text-[var(--color-text-tertiary)]" };
  }
  const ratio = count / maxCount;
  for (const { ceiling, bg, glow } of HEAT_THRESHOLDS) {
    if (ratio <= ceiling) {
      return { bg, glow, textColor: ratio <= 0.4 ? "text-[var(--color-text-primary)]" : "text-white" };
    }
  }
  return { bg: "bg-heat-5", glow: "heat-glow-5", textColor: "text-white" };
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
  const { bg, glow, textColor } = getHeatStyles(count, maxCount);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => count > 0 && setExpanded(!expanded)}
        className={`flex h-20 w-full flex-col items-center justify-center rounded-lg border border-[var(--color-border-subtle)] transition-all duration-200 ${bg} ${glow} ${
          count > 0 ? "cursor-pointer hover:scale-[1.03] hover:brightness-110" : "cursor-default"
        }`}
        aria-label={`${count} roadblocks, ${totalWaste} hours wasted per week`}
      >
        <span className={`font-mono text-xl font-bold ${textColor}`}>{count}</span>
        {count > 0 && (
          <span className={`font-mono text-[10px] ${textColor} opacity-70`}>
            {totalWaste}h/wk
          </span>
        )}
      </button>

      <AnimatePresence>
        {expanded && count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full z-30 mt-1 w-72 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-raised)]/95 p-3 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {count} roadblock{count !== 1 ? "s" : ""}
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="rounded-md p-0.5 text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
                aria-label="Close"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {roadblocks.map((r) => (
                <RoadblockCard key={r.id} roadblock={r} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
