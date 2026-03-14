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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {roadblock.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {categoryConfig && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${categoryConfig.bgColor} ${categoryConfig.color}`}
            >
              {categoryConfig.label}
            </span>
          )}
          <SeverityBadge severity={roadblock.severity} />
          <StatusBadge status={roadblock.status} />
          <span className="text-sm text-gray-500">
            {roadblock.estimated_waste} hrs/week wasted
          </span>
        </div>
      </div>

      {/* Status timeline */}
      <div className="flex items-center gap-1">
        {STATUSES.map((s, index) => {
          const isCurrent = s.value === roadblock.status;
          const isPast =
            STATUSES.findIndex((st) => st.value === roadblock.status) > index;
          return (
            <div key={s.value} className="flex items-center gap-1">
              <div
                className={`flex h-8 items-center rounded-full px-3 text-xs font-medium ${
                  isCurrent
                    ? `${s.bgColor} ${s.color} ring-2 ring-offset-1`
                    : isPast
                      ? "bg-gray-200 text-gray-600"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {s.label}
              </div>
              {index < STATUSES.length - 1 && (
                <svg className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Description */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Description
        </h2>
        <div className="prose prose-sm max-w-none text-gray-700">
          <Markdown>{roadblock.description}</Markdown>
        </div>
      </div>

      {/* Resolution note (if exists) */}
      {roadblock.resolution_note && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-green-700">
            Resolution Note
          </h2>
          <p className="text-sm text-green-800">
            {roadblock.resolution_note}
          </p>
        </div>
      )}

      {/* Resolution workflow */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Update Status
        </h2>
        <ResolutionForm roadblock={roadblock} onUpdate={onUpdate} />
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-400">
        <p>Created: {new Date(roadblock.created).toLocaleString()}</p>
        <p>Updated: {new Date(roadblock.updated).toLocaleString()}</p>
      </div>
    </div>
  );
}
