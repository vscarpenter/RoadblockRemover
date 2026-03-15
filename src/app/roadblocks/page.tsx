"use client";

import type { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RoadblockDetail } from "@/components/roadblocks/RoadblockDetail";
import { FollowButton } from "@/components/subscriptions/FollowButton";
import { useRoadblock } from "@/hooks/useRoadblock";
import { Spinner } from "@/components/ui/Spinner";

function RoadblockView(): ReactElement {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-sm text-amber-400">
          No roadblock ID provided. Return to the{" "}
          <a href="/dashboard/" className="text-[var(--color-accent-hover)] hover:underline">
            dashboard
          </a>
          .
        </p>
      </div>
    );
  }

  return <RoadblockContent id={id} />;
}

function RoadblockContent({ id }: { id: string }): ReactElement | null {
  const { roadblock, isLoading, error, updateRoadblock } = useRoadblock(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!roadblock) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <FollowButton roadblockId={roadblock.id} />
      </div>
      <RoadblockDetail roadblock={roadblock} onUpdate={updateRoadblock} />
    </div>
  );
}

export default function RoadblockPage(): ReactElement {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          }
        >
          <RoadblockView />
        </Suspense>
      </div>
    </AppShell>
  );
}
