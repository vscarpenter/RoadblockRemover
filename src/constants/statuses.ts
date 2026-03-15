import type { Status } from "@/types/roadblock";

export interface StatusConfig {
  value: Status;
  label: string;
  color: string;
  bgColor: string;
}

export const STATUSES: StatusConfig[] = [
  { value: "Open", label: "Open", color: "text-[var(--color-status-open)]", bgColor: "bg-[var(--color-status-open)]/10" },
  { value: "In Progress", label: "In Progress", color: "text-[var(--color-status-in-progress)]", bgColor: "bg-[var(--color-status-in-progress)]/10" },
  { value: "Resolved", label: "Resolved", color: "text-[var(--color-status-resolved)]", bgColor: "bg-[var(--color-status-resolved)]/10" },
  { value: "Closed", label: "Closed", color: "text-[var(--color-status-closed)]", bgColor: "bg-[var(--color-status-closed)]/10" },
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
