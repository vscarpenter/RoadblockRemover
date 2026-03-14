"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/providers/ToastProvider";
import { Button } from "@/components/ui/Button";

interface FollowButtonProps {
  roadblockId: string;
}

export function FollowButton({ roadblockId }: FollowButtonProps): ReactElement | null {
  const { isFollowing, isLoading, toggle } = useSubscription(roadblockId);
  const { showToast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  async function handleToggle(): Promise<void> {
    setIsToggling(true);
    try {
      await toggle();
      showToast(
        isFollowing ? "Unfollowed roadblock" : "Following roadblock",
        "info",
      );
    } catch {
      showToast("Failed to update subscription", "error");
    } finally {
      setIsToggling(false);
    }
  }

  if (isLoading) return null;

  return (
    <Button
      variant={isFollowing ? "secondary" : "primary"}
      size="sm"
      isLoading={isToggling}
      onClick={handleToggle}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
