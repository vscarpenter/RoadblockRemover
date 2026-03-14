export type Category = "CI/CD" | "DX" | "Process" | "Tooling" | "Culture";

export type Severity = "Low" | "Med" | "High" | "Critical";

export type Status = "Open" | "In Progress" | "Resolved" | "Closed";

export interface Roadblock {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  estimated_waste: number;
  status: Status;
  resolver_id?: string;
  resolution_note?: string;
  created: string;
  updated: string;
}

/**
 * Payload for creating a new roadblock.
 * Intentionally omits any author/user reference to preserve anonymity.
 * Status defaults to "Open" server-side via PocketBase field default.
 */
export interface RoadblockCreatePayload {
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  estimated_waste: number;
}

export interface RoadblockUpdatePayload {
  status?: Status;
  resolver_id?: string;
  resolution_note?: string;
}
