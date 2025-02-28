import { authClient } from "@/main";
import { useEffect, useState } from "react";
import io from "socket.io-client";

export function NotificationList() {
  const session = authClient.useSession();
  const [messages, setMessages] = useState<any[]>([]);

  const sendNotification = (data: any) => {
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
    const socket = io("http://localhost:7506", {
      auth: {
        userId: session.data?.user?.id,
      },
    })
      .on("connect", () => {
        console.log("connected");
      })
      .on("message", (data) => {
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
          <li key={message}>{message}</li>
        ))}
      </ul>
      <button onClick={() => sendNotification("Hello from React!")}>
        Send notification
      </button>
    </div>
  );
}
