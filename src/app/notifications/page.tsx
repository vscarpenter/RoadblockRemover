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
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-gray-600">
                {unreadCount} unread
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

        <div className="rounded-lg bg-white shadow-sm">
          <NotificationList
            notifications={notifications}
            onMarkAsRead={markAsRead}
          />
        </div>
      </div>
    </AppShell>
  );
}
