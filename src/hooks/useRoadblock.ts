"use client";

import { useCallback, useEffect, useState } from "react";
import pb, { toRecord } from "@/lib/pocketbase";
import { logger } from "@/lib/logger";
import type { Roadblock, RoadblockUpdatePayload } from "@/types/roadblock";

interface UseRoadblockReturn {
  roadblock: Roadblock | null;
  isLoading: boolean;
  error: string | null;
  updateRoadblock: (data: RoadblockUpdatePayload) => Promise<void>;
}

export function useRoadblock(id: string): UseRoadblockReturn {
  const [roadblock, setRoadblock] = useState<Roadblock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchRoadblock(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);
        const record = await pb.collection("roadblocks").getOne(id, { requestKey: null });
        setRoadblock(toRecord<Roadblock>(record));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch roadblock";
        setError(message);
        logger.error("Failed to fetch roadblock", { id, error: message });
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoadblock();

    // Subscribe to real-time updates for this specific record
    pb.collection("roadblocks").subscribe(id, (event) => {
      if (event.action === "update") {
        setRoadblock(toRecord<Roadblock>(event.record));
      } else if (event.action === "delete") {
        setRoadblock(null);
        setError("This roadblock has been deleted.");
      }
    });

    return () => {
      pb.collection("roadblocks").unsubscribe(id);
    };
  }, [id]);

  const updateRoadblock = useCallback(
    async (data: RoadblockUpdatePayload): Promise<void> => {
      const record = await pb.collection("roadblocks").update(id, data);
      setRoadblock(toRecord<Roadblock>(record));
    },
    [id],
  );

  return { roadblock, isLoading, error, updateRoadblock };
}
