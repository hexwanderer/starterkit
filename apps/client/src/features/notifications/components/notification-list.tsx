import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Title } from "@/components/header";
import { useNotifications } from "../hooks/notification-provider";
import { BugIcon, ListChecksIcon, MailboxIcon, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiSettings3Line } from "@remixicon/react";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/main";

export function NotificationList() {
  const { notifications } = useNotifications();

  const session = authClient.useSession();
  const sendTestNotification = useMutation({
    mutationKey: ["notification", "sendTestNotification"],
    mutationFn: () => {
      return fetch("http://localhost:7506/debug/notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "test",
          data: {
            destination: session.data?.user?.id ?? "",
            title: "Test notification",
            description: "This is a test notification",
            avatar: null,
            attachedResource: null,
          },
        }),
      });
    },
  });

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Title>Inbox</Title>
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <ListChecksIcon />
            <span>Mark all as read</span>
          </Button>
          <Button variant="secondary">
            <RiSettings3Line />
            <span>Settings</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => sendTestNotification.mutate()}
          >
            <MailboxIcon />
            <span>Send Test Notification</span>
          </Button>
          <Button variant="secondary">
            <BugIcon />
            <span>Debug</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`overflow-hidden transition-all duration-150 hover:ring-1 hover:ring-blue-500 ${notification.readAt ? "opacity-70" : "border-l-4 border-l-blue-500"}`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {notification.avatar ? (
                  <Avatar className="h-8 w-8 rounded-full">
                    <img src={notification.avatar} alt="Avatar" />
                  </Avatar>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Shield size={16} className="text-gray-500" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="font-medium text-sm">
                      {notification.title}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      {notification.destination === "SHIELDv1" && (
                        <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {notification.destination}
                        </Badge>
                      )}
                      <span>
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {notification.description}
                  </div>
                </div>
              </div>

              {notification.attachedResource && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <a
                    href={notification.attachedResource.url}
                    className="block p-3 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-sm mb-1">
                      {notification.attachedResource.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {notification.attachedResource.description}
                    </div>
                  </a>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
