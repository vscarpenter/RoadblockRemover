"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import type { AppNotification } from "@/types/notification";

interface NotificationListProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
}: NotificationListProps): ReactElement {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg className="mb-3 h-8 w-8 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 005.714 0m-5.714 0A24.248 24.248 0 013.764 16M9.143 17.082c.063-.33.172-.644.317-.935M14.857 17.082c-.063-.33-.172-.644-.317-.935m0 0A5.984 5.984 0 0112 15c-.898 0-1.756.197-2.54.547M14.54 16.147A5.984 5.984 0 0012 15c.898 0 1.756.197 2.54.547M12 12V9m0 0a3 3 0 10-3-3m3 3a3 3 0 013-3" />
        </svg>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          No notifications yet. Follow roadblocks to get updates.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[var(--color-border-subtle)]">
      {notifications.map((notification) => (
        <li
          key={notification.id}
          className={`transition-colors ${
            notification.read
              ? "bg-transparent"
              : "border-l-2 border-l-[var(--color-accent)] bg-[var(--color-accent-muted)]"
          }`}
        >
          <Link
            href={`/roadblocks/?id=${notification.roadblock_id}`}
            onClick={() => onMarkAsRead(notification.id)}
            className="block p-4 transition-colors hover:bg-[var(--color-surface-raised)]"
          >
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {notification.message}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="font-mono text-[10px] text-[var(--color-text-tertiary)]">
                {new Date(notification.timestamp).toLocaleString()}
              </span>
              <span
                className={`rounded-full border border-current/15 px-2 py-0.5 text-[10px] font-medium ${
                  notification.event === "status_changed"
                    ? "bg-amber-400/10 text-amber-400"
                    : "bg-emerald-400/10 text-emerald-400"
                }`}
              >
                {notification.event === "status_changed"
                  ? "Status Changed"
                  : "Resolution Added"}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
