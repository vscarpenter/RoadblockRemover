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
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}
    >
      {config.label}
    </span>
  );
}
