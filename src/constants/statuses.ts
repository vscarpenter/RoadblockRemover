import type { Status } from "@/types/roadblock";

export interface StatusConfig {
  value: Status;
  label: string;
  color: string;
  bgColor: string;
}

export const STATUSES: StatusConfig[] = [
  { value: "Open", label: "Open", color: "text-indigo-400", bgColor: "bg-indigo-400/10" },
  { value: "In Progress", label: "In Progress", color: "text-amber-400", bgColor: "bg-amber-400/10" },
  { value: "Resolved", label: "Resolved", color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
  { value: "Closed", label: "Closed", color: "text-gray-400", bgColor: "bg-gray-400/10" },
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
