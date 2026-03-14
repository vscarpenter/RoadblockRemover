"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirects /roadblocks/:id → /roadblocks/?id=:id
 * Provides backward compatibility if anyone bookmarks a direct ID URL.
 */
export function RoadblockRedirectClient({ id }: { id: string }): null {
  const router = useRouter();

  useEffect(() => {
    if (id && id !== "_") {
      router.replace(`/roadblocks/?id=${id}`);
    }
  }, [id, router]);

  return null;
}
