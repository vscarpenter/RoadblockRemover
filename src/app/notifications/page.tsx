"use client";

import type { ReactElement } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { NotificationList } from "@/components/subscriptions/NotificationList";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/Button";

export default function NotificationsPage(): ReactElement {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications();

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent-muted)] px-2 py-0.5 font-mono text-xs text-[var(--color-accent-hover)]">
                  {unreadCount}
                </span>
                <span className="ml-1.5">unread</span>
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] overflow-hidden">
          <NotificationList
            notifications={notifications}
            onMarkAsRead={markAsRead}
          />
        </div>
      </div>
    </AppShell>
  );
}
