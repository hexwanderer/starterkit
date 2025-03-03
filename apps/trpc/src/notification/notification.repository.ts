import { notifications, type DatabaseHandler } from "@repo/database";
import type {
  AttachedResource,
  NotificationSchemaCreate,
  NotificationSchemaGet,
} from "@repo/types";
import { and, eq, isNull, sql } from "drizzle-orm";
import { v7 } from "uuid";

export interface NotificationRepository {
  getForUser(
    userId: string,
    organizationId: string,
  ): Promise<NotificationSchemaGet[]>;
  create(
    notification: NotificationSchemaCreate,
  ): Promise<NotificationSchemaGet>;
  markAsRead(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export class NotificationPostgresImpl implements NotificationRepository {
  db: DatabaseHandler;

  constructor(db: DatabaseHandler) {
    this.db = db;
  }

  async create(
    notification: NotificationSchemaCreate,
  ): Promise<NotificationSchemaGet> {
    const [notif] = await this.db
      .insert(notifications)
      .values({
        id: notification.id ?? v7(),
        destination: notification.destination,
        avatar: notification.avatar,
        title: notification.title,
        description: notification.description,
        attachedResource: notification.attachedResource,
      })
      .returning();

    return {
      ...notif,
      attachedResource: notif.attachedResource as AttachedResource,
    };
  }

  async markAsRead(id: string): Promise<void> {
    await this.db
      .update(notifications)
      .set({
        readAt: new Date(),
      })
      .where(eq(notifications.id, id));
    return;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(notifications).where(eq(notifications.id, id));
    return;
  }

  async getForUser(
    userId: string,
    organizationId: string,
  ): Promise<NotificationSchemaGet[]> {
    const results = await this.db
      .select({
        id: notifications.id,
        destination: notifications.destination,
        avatar: notifications.avatar,
        title: notifications.title,
        description: notifications.description,
        attachedResource: notifications.attachedResource,
        createdAt: notifications.createdAt,
        updatedAt: notifications.updatedAt,
        readAt: notifications.readAt,
      })
      .from(notifications)
      .where(and(eq(notifications.destination, userId)))
      .orderBy(notifications.createdAt);

    return results.map((n) => ({
      id: n.id,
      destination: n.destination,
      avatar: n.avatar,
      title: n.title,
      description: n.description,
      attachedResource: n.attachedResource as AttachedResource,
      createdAt: n.createdAt,
      updatedAt: n.updatedAt,
      readAt: n.readAt ?? null,
    }));
  }
}
