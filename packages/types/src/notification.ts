import { z } from "zod";

export const NotificationQuery = {
  getForUser: z.object({
    userId: z.string(),
    organizationId: z.string(),
  }),
};

export const AttachedResourceSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
});

export const NotificationSchema = {
  get: z.object({
    id: z.string(),
    destination: z.string(),
    avatar: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    attachedResource: AttachedResourceSchema.nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    readAt: z.date().nullable(),
  }),
  create: z.object({
    id: z.string().optional(),
    destination: z.string(),
    avatar: z.string().nullable(),
    title: z.string(),
    description: z.string(),
    attachedResource: AttachedResourceSchema.nullable(),
  }),
};

export type NotificationQueryGetForUser = z.infer<
  typeof NotificationQuery.getForUser
>;

export type AttachedResource = z.infer<typeof AttachedResourceSchema>;

export type NotificationSchemaGet = z.infer<typeof NotificationSchema.get>;
export type NotificationSchemaCreate = z.infer<
  typeof NotificationSchema.create
>;

export interface ServerToClientEvents {
  notification: (data: NotificationSchemaGet) => void;
  loadNotifications: (data: NotificationSchemaGet[]) => void;
}

export type ClientToServerEvents = {
  ping: () => void;
};

export interface SocketData {
  userId: string;
  organizationId: string;
}
