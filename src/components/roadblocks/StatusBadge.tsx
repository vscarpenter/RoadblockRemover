import type { ReactElement } from "react";
import type { Status } from "@/types/roadblock";
import { STATUS_MAP } from "@/constants/statuses";

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps): ReactElement | null {
  const config = STATUS_MAP.get(status);
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-current/15 px-2.5 py-0.5 text-[11px] font-medium ${config.bgColor} ${config.color}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
