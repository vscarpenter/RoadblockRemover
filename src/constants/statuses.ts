import type { Status } from "@/types/roadblock";

export interface StatusConfig {
  value: Status;
  label: string;
  color: string;
  bgColor: string;
}

export const STATUSES: StatusConfig[] = [
  { value: "Open", label: "Open", color: "text-status-open", bgColor: "bg-status-open/20" },
  { value: "In Progress", label: "In Progress", color: "text-status-in-progress", bgColor: "bg-status-in-progress/20" },
  { value: "Resolved", label: "Resolved", color: "text-status-resolved", bgColor: "bg-status-resolved/20" },
  { value: "Closed", label: "Closed", color: "text-status-closed", bgColor: "bg-status-closed/20" },
] as const;

export const STATUS_MAP = new Map(
  STATUSES.map((s) => [s.value, s]),
);

/** Valid status transitions — enforces the workflow: Open → In Progress → Resolved → Closed */
export const ALLOWED_TRANSITIONS: Record<Status, Status[]> = {
  Open: ["In Progress"],
  "In Progress": ["Resolved"],
  Resolved: ["Closed"],
  Closed: [],
};
