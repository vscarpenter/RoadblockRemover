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
      className={`inline-flex items-center gap-1.5 rounded-full border border-current/15 px-2.5 py-0.5 text-[11px] font-medium ${config.bgColor} ${config.color}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
