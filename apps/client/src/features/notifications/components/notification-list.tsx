import { useNotifications } from "../hooks/notification-provider";

export function NotificationList() {
  const { notifications, unreadCount } = useNotifications();

  return (
    <div className="flex flex-col gap-4">
      <h2>{`You have ${unreadCount} unread notifications`}</h2>
      {notifications.map((notification) => (
        <div key={notification.id} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <div className="text-sm font-medium">{notification.title}</div>
              <div className="text-xs text-gray-500">
                {notification.description}
              </div>
            </div>
            {notification.attachedResource && (
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500">
                  {notification.attachedResource.title}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
