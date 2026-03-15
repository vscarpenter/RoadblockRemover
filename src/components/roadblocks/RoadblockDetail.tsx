"use client";

import type { ReactElement } from "react";
import Markdown from "react-markdown";
import type { Roadblock, RoadblockUpdatePayload } from "@/types/roadblock";
import { StatusBadge } from "./StatusBadge";
import { SeverityBadge } from "./SeverityBadge";
import { ResolutionForm } from "./ResolutionForm";
import { CATEGORY_MAP } from "@/constants/categories";
import { STATUSES } from "@/constants/statuses";

interface RoadblockDetailProps {
  roadblock: Roadblock;
  onUpdate: (data: RoadblockUpdatePayload) => Promise<void>;
}

export function RoadblockDetail({
  roadblock,
  onUpdate,
}: RoadblockDetailProps): ReactElement {
  const categoryConfig = CATEGORY_MAP.get(roadblock.category);
  const currentIndex = STATUSES.findIndex((st) => st.value === roadblock.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
          {roadblock.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {categoryConfig && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-current/15 px-2.5 py-0.5 text-[11px] font-medium ${categoryConfig.bgColor} ${categoryConfig.color}`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: categoryConfig.accentVar }}
              />
              {categoryConfig.label}
            </span>
          )}
          <SeverityBadge severity={roadblock.severity} />
          <StatusBadge status={roadblock.status} />
          <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
            {roadblock.estimated_waste} hrs/week wasted
          </span>
        </div>
      </div>

      {/* Status timeline */}
      <div className="flex items-center gap-1">
        {STATUSES.map((s, index) => {
          const isCurrent = index === currentIndex;
          const isPast = index < currentIndex;
          return (
            <div key={s.value} className="flex items-center gap-1">
              <div
                className={`flex h-8 items-center rounded-full px-3 text-xs font-medium transition-all ${
                  isCurrent
                    ? `${s.bgColor} ${s.color} ring-2 ring-current/20 ring-offset-1 ring-offset-[var(--color-base)]`
                    : isPast
                      ? "bg-[var(--color-surface-overlay)] text-[var(--color-text-secondary)]"
                      : "bg-[var(--color-surface-raised)] text-[var(--color-text-tertiary)]"
                }`}
              >
                {isPast && (
                  <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {s.label}
              </div>
              {index < STATUSES.length - 1 && (
                <div className={`h-px w-4 ${isPast ? "bg-[var(--color-text-tertiary)]" : "bg-[var(--color-border-subtle)]"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Description */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)]">
          Description
        </h2>
        <div className="prose prose-sm prose-dark max-w-none">
          <Markdown>{roadblock.description}</Markdown>
        </div>
      </div>

      {/* Resolution note (if exists) */}
      {roadblock.resolution_note && (
        <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-6">
          <h2 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-emerald-400">
            Resolution Note
          </h2>
          <p className="text-sm text-emerald-300">
            {roadblock.resolution_note}
          </p>
        </div>
      )}

      {/* Resolution workflow */}
      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)]">
          Update Status
        </h2>
        <ResolutionForm roadblock={roadblock} onUpdate={onUpdate} />
      </div>

      {/* Metadata */}
      <div className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
        <p>Created: {new Date(roadblock.created).toLocaleString()}</p>
        <p>Updated: {new Date(roadblock.updated).toLocaleString()}</p>
      </div>
    </div>
  );
}
