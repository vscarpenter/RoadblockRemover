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
      <p className="py-8 text-center text-sm text-gray-500">
        No notifications yet. Follow roadblocks to get updates.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {notifications.map((notification) => (
        <li
          key={notification.id}
          className={`p-4 transition-colors ${
            notification.read ? "bg-white" : "bg-blue-50"
          }`}
        >
          <Link
            href={`/roadblocks/?id=${notification.roadblock_id}`}
            onClick={() => onMarkAsRead(notification.id)}
            className="block hover:text-blue-600"
          >
            <p className="text-sm font-medium text-gray-900">
              {notification.message}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleString()}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  notification.event === "status_changed"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
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
