"use client";

import { useCallback, useEffect, useState } from "react";
import pb, { pbEscape, toRecord } from "@/lib/pocketbase";
import { logger } from "@/lib/logger";
import { useAuth } from "./useAuth";
import type { AppNotification } from "@/types/notification";
import type { Roadblock } from "@/types/roadblock";

const STORAGE_KEY_PREFIX = "rr_notifications_";

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function loadNotifications(userId: string): AppNotification[] {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    logger.warn("Failed to parse stored notifications, resetting", {
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

function saveNotifications(
  userId: string,
  notifications: AppNotification[],
): void {
  localStorage.setItem(
    getStorageKey(userId),
    JSON.stringify(notifications),
  );
}

function buildNotification(record: Roadblock): AppNotification {
  return {
    id: crypto.randomUUID(),
    roadblock_id: record.id,
    roadblock_title: record.title,
    event: record.resolution_note ? "resolution_added" : "status_changed",
    message: record.resolution_note
      ? `Resolution note added to "${record.title}"`
      : `"${record.title}" moved to ${record.status}`,
    timestamp: new Date().toISOString(),
    read: false,
  };
}

interface UseNotificationsReturn {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    setNotifications(loadNotifications(user.id));
  }, [user]);

  useEffect(() => {
    if (!user) return;

    async function fetchFollowed(): Promise<void> {
      try {
        const subs = await pb.collection("subscriptions").getFullList({
          filter: `user_id = "${pbEscape(user!.id)}"`,
        });
        setFollowedIds(new Set(subs.map((s) => s.roadblock_id)));
      } catch (err) {
        logger.error("Failed to fetch subscriptions for notifications", {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    fetchFollowed();
  }, [user]);

  useEffect(() => {
    if (!user || followedIds.size === 0) return;

    pb.collection("roadblocks").subscribe("*", (event) => {
      if (event.action !== "update") return;

      const record = toRecord<Roadblock>(event.record);
      if (!followedIds.has(record.id)) return;

      const notification = buildNotification(record);

      setNotifications((prev) => {
        const updated = [notification, ...prev];
        saveNotifications(user.id, updated);
        return updated;
      });
    });

    return () => {
      pb.collection("roadblocks").unsubscribe("*");
    };
  }, [user, followedIds]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(
    (notificationId: string): void => {
      if (!user) return;
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n,
        );
        saveNotifications(user.id, updated);
        return updated;
      });
    },
    [user],
  );

  const markAllAsRead = useCallback((): void => {
    if (!user) return;
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(user.id, updated);
      return updated;
    });
  }, [user]);

  const clearAll = useCallback((): void => {
    if (!user) return;
    setNotifications([]);
    saveNotifications(user.id, []);
  }, [user]);

  return { notifications, unreadCount, markAsRead, markAllAsRead, clearAll };
}
