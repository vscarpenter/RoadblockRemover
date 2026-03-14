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
      className="block rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="mb-2 text-sm font-medium text-gray-900 line-clamp-2">
        {roadblock.title}
      </h3>
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={roadblock.severity} />
        <StatusBadge status={roadblock.status} />
        <span className="text-xs text-gray-500">
          {roadblock.estimated_waste}h/wk
        </span>
      </div>
    </Link>
  );
}
