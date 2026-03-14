export interface AppNotification {
  id: string;
  roadblock_id: string;
  roadblock_title: string;
  event: "status_changed" | "resolution_added";
  message: string;
  timestamp: string;
  read: boolean;
}
