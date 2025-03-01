import type { Server as HttpServer } from "node:http";
import { Server, type DefaultEventsMap } from "socket.io";
import type Redis from "ioredis";
import { v7 } from "uuid";
import { createAdapter } from "@socket.io/redis-adapter";
import type { NotificationRepository } from "./notification/notification.repository";
import type {
  ClientToServerEvents,
  NotificationSchemaCreate,
  ServerToClientEvents,
  SocketData,
} from "@repo/types";

export class SocketServer {
  io?: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    DefaultEventsMap,
    SocketData
  >;

  async initializeSocketIO(
    httpServer: HttpServer,
    redis: Redis,
    notificationRepository: NotificationRepository,
  ) {
    const pubClient = redis.duplicate();
    const subClient = redis.duplicate();

    const io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      DefaultEventsMap,
      SocketData
    >(httpServer, {
      cors: {
        origin: "*", // Allow connections from any origin, or specify your React app URL
        methods: ["GET", "POST"],
        credentials: true,
      },
    })
      .adapter(createAdapter(pubClient, subClient))
      .use((socket, next) => {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
          return next(new Error("No userId"));
        }
        socket.data.userId = userId;
        next();
      })
      .on("connection", async (socket) => {
        console.log(`User ${socket.data.userId} connected`);
        socket.join(`user:${socket.data.userId}`);

        const notifications = await notificationRepository.getForUser(
          socket.data.userId,
          socket.data.organizationId,
        );
        socket.emit("loadNotifications", notifications);
        socket.on("disconnect", () => {
          console.log(`User ${socket.data.userId} disconnected`);
        });
      });

    this.io = io;
    console.log("Socket.IO initialized and attached to HTTP server");
  }

  notifyUser(userId: string, data: NotificationSchemaCreate) {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }
    this.io.to(`user:${userId}`).emit("notification", {
      id: v7(),
      title: "Test notification",
      description: "This is a test notification",
      destination: userId,
      avatar: null,
      attachedResource: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      readAt: null,
    });
  }
}
