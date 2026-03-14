"use client";

import { useCallback, useEffect, useState } from "react";
import pb, { pbEscape } from "@/lib/pocketbase";
import { logger } from "@/lib/logger";
import { useAuth } from "./useAuth";

interface UseSubscriptionReturn {
  isFollowing: boolean;
  isLoading: boolean;
  toggle: () => Promise<void>;
}

export function useSubscription(roadblockId: string): UseSubscriptionReturn {
  const { user } = useAuth();
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !roadblockId) {
      setIsLoading(false);
      return;
    }

    async function checkSubscription(): Promise<void> {
      try {
        const records = await pb.collection("subscriptions").getFullList({
          filter: `user_id = "${pbEscape(user!.id)}" && roadblock_id = "${pbEscape(roadblockId)}"`,
        });
        setSubscriptionId(records.length > 0 ? records[0].id : null);
      } catch (err) {
        logger.error("Failed to check subscription", {
          error: err instanceof Error ? err.message : String(err),
        });
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, [user, roadblockId]);

  const toggle = useCallback(async (): Promise<void> => {
    if (!user) return;

    try {
      if (subscriptionId) {
        await pb.collection("subscriptions").delete(subscriptionId);
        setSubscriptionId(null);
      } else {
        const record = await pb.collection("subscriptions").create({
          user_id: user.id,
          roadblock_id: roadblockId,
        });
        setSubscriptionId(record.id);
      }
    } catch (err) {
      logger.error("Failed to toggle subscription", {
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }, [user, roadblockId, subscriptionId]);

  return {
    isFollowing: subscriptionId !== null,
    isLoading,
    toggle,
  };
}
