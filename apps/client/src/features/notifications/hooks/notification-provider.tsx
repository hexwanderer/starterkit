import { authClient } from "@/main";
import type {
  ClientToServerEvents,
  NotificationSchemaGet,
  ServerToClientEvents,
} from "@repo/types";
import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface NotificationContextType {
  isLoading: boolean;
  notifications: NotificationSchemaGet[];
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType>({
  isLoading: true,
  notifications: [],
  unreadCount: 0,
});

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<NotificationSchemaGet[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const session = authClient.useSession();

  useEffect(() => {
    // Reset state when session changes
    setIsLoading(true);
    setNotifications([]);
    setUnreadCount(0);

    // Don't establish a socket connection if there's no user ID
    if (!session.data?.user?.id) return;

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      "http://localhost:7506",
      {
        auth: {
          userId: session.data.user.id,
        },
      },
    );

    socket
      .on("connect", () => {
        console.log("connected to notification service");
      })
      .on("loadNotifications", (data) => {
        console.log("loadNotifications received", data);
        setNotifications((prev) => [...prev, ...data]);
        setUnreadCount(data.filter((n) => n.readAt === null).length);
        setIsLoading(false);
      })
      .on("notification", (data) => {
        console.log("new notification received", data);
        setNotifications((prev) => [...prev, data]);
        setUnreadCount((prev) => prev + 1);
      })
      .on("disconnect", () => {
        console.log("disconnected from notification service");
        setIsLoading(false);
      });

    // Set a timeout to ensure loading state is cleared even if no notifications arrive
    const loadingTimeout = setTimeout(() => {
      if (setIsLoading) setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(loadingTimeout);
      socket.close();
    };
  }, [session.data?.user?.id]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
