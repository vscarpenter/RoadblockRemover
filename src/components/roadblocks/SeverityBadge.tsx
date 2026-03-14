import type { ReactElement } from "react";
import type { Severity } from "@/types/roadblock";
import { SEVERITY_MAP } from "@/constants/severities";

interface SeverityBadgeProps {
  severity: Severity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps): ReactElement | null {
  const config = SEVERITY_MAP.get(severity);
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.color}`}
    >
      {config.label}
    </span>
  );
}
