/** Centralized environment configuration. All env vars read from one place. */
export const config = {
  /** PocketBase server URL for API and real-time connections */
  pocketbaseUrl:
    process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090",
} as const;
