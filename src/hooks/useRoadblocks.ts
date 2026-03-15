"use client";

import { useCallback, useEffect, useState } from "react";
import pb, { pbEscape, toRecord } from "@/lib/pocketbase";
import { logger } from "@/lib/logger";
import type { Roadblock, Status } from "@/types/roadblock";
import type { RecordSubscription } from "pocketbase";

interface UseRoadblocksOptions {
  statuses?: Status[];
  daysBack?: number | null;
}

interface UseRoadblocksReturn {
  roadblocks: Roadblock[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function buildFilter(statuses?: Status[], daysBack?: number | null): string {
  const filters: string[] = [];

  if (statuses && statuses.length > 0) {
    const statusFilter = statuses
      .map((s) => `status = "${pbEscape(s)}"`)
      .join(" || ");
    filters.push(`(${statusFilter})`);
  }

  if (daysBack) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysBack);
    filters.push(`created >= "${cutoff.toISOString()}"`);
  }

  return filters.join(" && ");
}

function applyRealtimeEvent(
  prev: Roadblock[],
  event: RecordSubscription,
): Roadblock[] {
  const record = toRecord<Roadblock>(event.record);

  switch (event.action) {
    case "create":
      return [record, ...prev];
    case "update":
      return prev.map((r) => (r.id === record.id ? record : r));
    case "delete":
      return prev.filter((r) => r.id !== record.id);
    default:
      return prev;
  }
}

export function useRoadblocks(
  options: UseRoadblocksOptions = {},
): UseRoadblocksReturn {
  const { statuses, daysBack } = options;
  const [roadblocks, setRoadblocks] = useState<Roadblock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadblocks = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const filter = buildFilter(statuses, daysBack);
      const records = await pb.collection("roadblocks").getFullList({
        sort: "-created",
        filter: filter || undefined,
        requestKey: null,
      });

      setRoadblocks(records.map(toRecord<Roadblock>));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch roadblocks";
      setError(message);
      logger.error("Failed to fetch roadblocks", { error: message });
    } finally {
      setIsLoading(false);
    }
  }, [statuses, daysBack]);

  useEffect(() => {
    fetchRoadblocks();
  }, [fetchRoadblocks]);

  // Real-time subscription for live updates
  useEffect(() => {
    const unsubscribePromise = pb
      .collection("roadblocks")
      .subscribe("*", (event: RecordSubscription) => {
        setRoadblocks((prev) => applyRealtimeEvent(prev, event));
      });

    return () => {
      unsubscribePromise.then(() => {
        pb.collection("roadblocks").unsubscribe("*");
      });
    };
  }, []);

  return { roadblocks, isLoading, error, refetch: fetchRoadblocks };
}
