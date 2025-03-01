import { authClient } from "@/main";
import type {
  ClientToServerEvents,
  NotificationSchemaCreate,
  NotificationSchemaGet,
  ServerToClientEvents,
} from "@repo/types";
import { useEffect, useState } from "react";
import io, { type Socket } from "socket.io-client";

export function NotificationList() {
  const session = authClient.useSession();
  const [messages, setMessages] = useState<NotificationSchemaGet[]>([]);

  const sendNotification = (data: NotificationSchemaCreate) => {
    fetch("http://localhost:7506/test-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session.data?.user?.id,
        data,
      }),
    });
  };

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
        setMessages((prev) => [...prev, ...data]);
      })
      .on("notification", (data) => {
        setMessages((prev) => [...prev, data]);
      })
      .on("disconnect", () => {
        console.log("disconnected");
      });

    return () => {
      socket.close();
    };
  }, [session]);

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.title}</li>
        ))}
      </ul>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={() =>
          sendNotification({
            destination: session.data?.user?.id ?? "",
            title: "Hello from React!",
            description: "This is a test notification",
            avatar: null,
            attachedResource: null,
          })
        }
      >
        Send notification
      </button>
    </div>
  );
}
