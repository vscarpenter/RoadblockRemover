import type { Severity } from "@/types/roadblock";

export interface SeverityConfig {
  value: Severity;
  label: string;
  weight: number;
  color: string;
  bgColor: string;
}

export const SEVERITIES: SeverityConfig[] = [
  { value: "Low", label: "Low", weight: 1, color: "text-severity-low", bgColor: "bg-severity-low/20" },
  { value: "Med", label: "Medium", weight: 2, color: "text-severity-med", bgColor: "bg-severity-med/20" },
  { value: "High", label: "High", weight: 3, color: "text-severity-high", bgColor: "bg-severity-high/20" },
  { value: "Critical", label: "Critical", weight: 4, color: "text-severity-critical", bgColor: "bg-severity-critical/20" },
] as const;

export const SEVERITY_MAP = new Map(
  SEVERITIES.map((s) => [s.value, s]),
);
