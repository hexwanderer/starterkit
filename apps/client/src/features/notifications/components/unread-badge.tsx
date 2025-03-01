import { Badge } from "@/components/ui/badge";
import { useNotifications } from "../hooks/notification-provider";
import { Skeleton } from "@/components/ui/skeleton";

export function UnreadBadge() {
  const { unreadCount } = useNotifications();

  return unreadCount ? (
    <Badge>{unreadCount}</Badge>
  ) : (
    <Skeleton className="w-4 h-4" />
  );
}
