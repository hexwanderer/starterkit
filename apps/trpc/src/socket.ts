import type { Server as HttpServer } from "node:http";
import { Server, type DefaultEventsMap } from "socket.io";
import type Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

export class SocketServer {
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;

  async initializeSocketIO(httpServer: HttpServer, redis: Redis) {
    const pubClient = redis.duplicate();
    const subClient = redis.duplicate();

    const io = new Server(httpServer, {
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
      .on("connection", (socket) => {
        console.log(`User ${socket.data.userId} connected`);
        socket.join(`user:${socket.data.userId}`);
        socket.on("disconnect", () => {
          console.log(`User ${socket.data.userId} disconnected`);
        });
      });

    this.io = io;
    console.log("Socket.IO initialized and attached to HTTP server");
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  notifyUser(userId: string, data: any) {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }
    this.io.to(`user:${userId}`).emit("message", data);
  }
}
