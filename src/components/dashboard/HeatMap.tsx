"use client";

import type { ReactElement } from "react";
import type { Roadblock, Category, Severity } from "@/types/roadblock";
import { CATEGORIES } from "@/constants/categories";
import { SEVERITIES } from "@/constants/severities";
import { HeatMapCell } from "./HeatMapCell";

interface HeatMapProps {
  roadblocks: Roadblock[];
}

type GridKey = `${Category}|${Severity}`;

function buildGrid(roadblocks: Roadblock[]): Map<GridKey, Roadblock[]> {
  const grid = new Map<GridKey, Roadblock[]>();
  for (const cat of CATEGORIES) {
    for (const sev of SEVERITIES) {
      grid.set(`${cat.value}|${sev.value}`, []);
    }
  }
  for (const rb of roadblocks) {
    const key: GridKey = `${rb.category}|${rb.severity}`;
    grid.get(key)?.push(rb);
  }
  return grid;
}

function getMaxCount(grid: Map<GridKey, Roadblock[]>): number {
  let max = 0;
  for (const bucket of grid.values()) {
    if (bucket.length > max) max = bucket.length;
  }
  return max;
}

function getCategoryTotals(
  grid: Map<GridKey, Roadblock[]>,
): Map<Category, { count: number; waste: number }> {
  const totals = new Map<Category, { count: number; waste: number }>();
  for (const cat of CATEGORIES) {
    let count = 0;
    let waste = 0;
    for (const sev of SEVERITIES) {
      const bucket = grid.get(`${cat.value}|${sev.value}`) ?? [];
      count += bucket.length;
      waste += bucket.reduce((sum, r) => sum + r.estimated_waste, 0);
    }
    totals.set(cat.value, { count, waste });
  }
  return totals;
}

function SeverityColumnTotal({
  roadblocks,
  severity,
}: {
  roadblocks: Roadblock[];
  severity: Severity;
}): ReactElement {
  const sevRoadblocks = roadblocks.filter((r) => r.severity === severity);
  const sevWaste = sevRoadblocks.reduce(
    (sum, r) => sum + r.estimated_waste,
    0,
  );
  return (
    <div className="flex h-12 flex-col items-center justify-center rounded-lg bg-[var(--color-surface-overlay)]">
      <span className="font-mono text-sm font-bold text-[var(--color-text-primary)]">
        {sevRoadblocks.length}
      </span>
      <span className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
        {sevWaste}h/wk
      </span>
    </div>
  );
}

export function HeatMap({ roadblocks }: HeatMapProps): ReactElement {
  const grid = buildGrid(roadblocks);
  const maxCount = getMaxCount(grid);
  const categoryTotals = getCategoryTotals(grid);

  const grandTotal = roadblocks.length;
  const grandWaste = roadblocks.reduce(
    (sum, r) => sum + r.estimated_waste,
    0,
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        {/* Header row: severity labels */}
        <div className="grid grid-cols-[160px_repeat(4,1fr)_80px] gap-2 mb-3">
          <div />
          {SEVERITIES.map((sev) => (
            <div
              key={sev.value}
              className="text-center font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)]"
            >
              {sev.label}
            </div>
          ))}
          <div className="text-center font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)]">
            Total
          </div>
        </div>

        {/* Category rows */}
        {CATEGORIES.map((cat) => {
          const totals = categoryTotals.get(cat.value);
          return (
            <div
              key={cat.value}
              className="grid grid-cols-[160px_repeat(4,1fr)_80px] gap-2 mb-2"
            >
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <span
                    className="h-8 w-0.5 rounded-full"
                    style={{ backgroundColor: cat.accentVar }}
                  />
                  <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">
                    {cat.label}
                  </span>
                </div>
              </div>
              {SEVERITIES.map((sev) => (
                <HeatMapCell
                  key={sev.value}
                  roadblocks={grid.get(`${cat.value}|${sev.value}`) ?? []}
                  maxCount={maxCount}
                />
              ))}
              <div className="flex h-20 flex-col items-center justify-center rounded-lg bg-[var(--color-surface-overlay)]">
                <span className="font-mono text-sm font-bold text-[var(--color-text-primary)]">
                  {totals?.count ?? 0}
                </span>
                <span className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
                  {totals?.waste ?? 0}h/wk
                </span>
              </div>
            </div>
          );
        })}

        {/* Grand totals row */}
        <div className="mt-3 grid grid-cols-[160px_repeat(4,1fr)_80px] gap-2">
          <div />
          {SEVERITIES.map((sev) => (
            <SeverityColumnTotal
              key={sev.value}
              roadblocks={roadblocks}
              severity={sev.value}
            />
          ))}
          <div className="flex h-12 flex-col items-center justify-center rounded-lg bg-[var(--color-accent-muted)]">
            <span className="font-mono text-sm font-bold text-[var(--color-accent-hover)]">
              {grandTotal}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-accent)]">
              {grandWaste}h/wk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
