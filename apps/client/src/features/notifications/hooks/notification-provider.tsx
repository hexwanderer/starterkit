import { authClient } from "@/main";
import type {
  ClientToServerEvents,
  NotificationSchemaGet,
  ServerToClientEvents,
} from "@repo/types";
import { createContext, useContext, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

interface NotificationContextType {
  notifications: NotificationSchemaGet[];
  unreadCount: number | undefined;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: undefined,
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
  const [unreadCount, setUnreadCount] = useState<number | undefined>(undefined);
  const session = authClient.useSession();

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      "http://localhost:7506",
      {
        auth: {
          userId: session.data?.user?.id,
        },
      },
    );
    socket
      .on("connect", () => {
        console.log("connected");
      })
      .on("loadNotifications", (data) => {
        console.log("loadNotifications", data);
        setNotifications((prev) => [...prev, ...data]);
        setUnreadCount(data.filter((n) => n.readAt === null).length);
      })
      .on("notification", (data) => {
        setNotifications((prev) => [...prev, data]);
        setUnreadCount((prev) => (prev ? prev + 1 : 1));
      })
      .on("disconnect", () => {
        console.log("disconnected");
      });

    return () => {
      socket.close();
    };
  }, [session]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
