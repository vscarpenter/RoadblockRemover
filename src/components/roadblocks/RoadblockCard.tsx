import type { ReactElement } from "react";
import Link from "next/link";
import type { Roadblock } from "@/types/roadblock";
import { StatusBadge } from "./StatusBadge";
import { SeverityBadge } from "./SeverityBadge";

interface RoadblockCardProps {
  roadblock: Roadblock;
}

export function RoadblockCard({ roadblock }: RoadblockCardProps): ReactElement {
  return (
    <Link
      href={`/roadblocks/?id=${roadblock.id}`}
      className="block rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 transition-all duration-150 hover:border-[var(--color-border-default)] hover:bg-[var(--color-surface-raised)]"
    >
      <h3 className="mb-2 text-sm font-medium text-[var(--color-text-primary)] line-clamp-2">
        {roadblock.title}
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={roadblock.severity} />
        <StatusBadge status={roadblock.status} />
        <span className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
          {roadblock.estimated_waste}h/wk
        </span>
      </div>
    </Link>
  );
}
