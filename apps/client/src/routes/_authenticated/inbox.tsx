import { NotificationList } from "@/features/notifications/components/notification-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/inbox")({
  component: NotificationList,
});
