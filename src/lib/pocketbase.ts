import PocketBase from "pocketbase";
import type { RecordModel } from "pocketbase";
import { config } from "./config";

/** Singleton PocketBase client instance shared across the app */
const pb = new PocketBase(config.pocketbaseUrl);

/**
 * Cast a PocketBase RecordModel to a typed domain object.
 * PocketBase SDK returns generic RecordModel for all queries;
 * our collection schemas match our domain interfaces, so the
 * cast is safe at runtime but requires `as unknown as T` to
 * bridge the structural mismatch TypeScript sees.
 */
export function toRecord<T>(record: RecordModel): T {
  return record as unknown as T;
}

/**
 * Escape a value for safe interpolation into a PocketBase filter string.
 * PocketBase's JS SDK does not support parameterized filters, so we
 * must manually escape double-quotes to prevent filter injection.
 */
export function pbEscape(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export default pb;
