import { createServer } from "node:http";
import type { Express } from "express";
import { Server, type DefaultEventsMap } from "socket.io";
import type Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

export class SocketServer {
  io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;

  async createSocketServer(app: Express, redis: Redis) {
    const server = createServer(app);

    const pubClient = redis.duplicate();
    const subClient = redis.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    const io = new Server(server, {
      cors: {
        origin: "*",
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
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  notifyUser(userId: string, data: any) {
    if (!this.io) {
      throw new Error("failed to initialize");
    }

    this.io.to(`user:${userId}`).emit("message", data);
  }
}
