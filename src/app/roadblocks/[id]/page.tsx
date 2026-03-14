import { RoadblockRedirectClient } from "./RoadblockRedirectClient";

/**
 * Provides a single static param so the route builds with static export.
 * Actual roadblock detail is served at /roadblocks/?id=xxx
 */
export function generateStaticParams(): { id: string }[] {
  return [{ id: "_" }];
}

export default async function RoadblockRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoadblockRedirectClient id={id} />;
}
