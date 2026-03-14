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
      <div className="rounded-md bg-yellow-50 p-4">
        <p className="text-sm text-yellow-800">
          No roadblock ID provided. Return to the{" "}
          <a href="/dashboard/" className="text-blue-600 hover:underline">
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
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-800">{error}</p>
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
