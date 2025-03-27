import {
  type DatabaseHandler,
  type db,
  organizations,
  resources,
  resourceTagPairs,
  resourceTags,
  teamMembers,
  teams,
  users,
} from "@repo/database";
import { and, eq, sql } from "drizzle-orm";
import type { resourceOps } from "./resource.controller";
import type { z } from "zod";

type DrizzlePgTx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export interface ResourceRepository {
  getAll(
    params: z.infer<typeof resourceOps.list.input>,
  ): Promise<z.infer<typeof resourceOps.list.output>>;
  getById(
    params: z.infer<typeof resourceOps.getById.input>,
  ): Promise<z.infer<typeof resourceOps.getById.output>>;
  getBySlug(
    params: z.infer<typeof resourceOps.getBySlug.input>,
  ): Promise<z.infer<typeof resourceOps.getBySlug.output>>;
  create(
    resource: z.infer<typeof resourceOps.create.input>,
    transaction?: DrizzlePgTx,
  ): Promise<z.infer<typeof resourceOps.create.output>>;
  update(
    resource: z.infer<typeof resourceOps.update.input>,
    transaction?: DrizzlePgTx,
  ): Promise<z.infer<typeof resourceOps.update.output>>;
  delete(
    id: z.infer<typeof resourceOps.delete.input>,
    transaction?: DrizzlePgTx,
  ): Promise<z.infer<typeof resourceOps.delete.output>>;
}

export class ResourcePostgresImpl implements ResourceRepository {
  db: DatabaseHandler;

  constructor(db: DatabaseHandler) {
    this.db = db;
  }

  async getAll(
    params: z.infer<typeof resourceOps.list.input>,
  ): Promise<z.infer<typeof resourceOps.list.output>> {
    const result = await this.db
      .select({
        id: resources.id,
        title: resources.title,
        description: resources.description,
        teamId: resources.teamId,
        organizationId: resources.organizationId,
        tags: sql<
          { id: string; name: string }[]
        >`COALESCE(json_agg(json_build_object('id', ${resourceTags.id}, 'name', ${resourceTags.tag})), '[]')`.as(
          "tags",
        ),
        createdAt: resources.createdAt,
        updatedAt: resources.updatedAt,
      })
      .from(resources)
      .leftJoin(resourceTagPairs, eq(resources.id, resourceTagPairs.resourceId))
      .leftJoin(resourceTags, eq(resourceTagPairs.tagId, resourceTags.id))
      .leftJoin(teams, eq(resources.teamId, teams.id))
      .leftJoin(organizations, eq(resources.organizationId, organizations.id))
      .where(
        and(
          params.filter?.organizationId
            ? eq(organizations.id, params.filter.organizationId)
            : undefined,
          params.filter?.teamId
            ? eq(teams.id, params.filter.teamId)
            : undefined,
        ),
      )
      .execute();

    if (result.length === 0) return [];
    return result.map((row) => ({
      id: row.id,
      slug: "TODO",
      title: row.title,
      description: row.description,
      teamId: row.teamId,
      organizationId: row.organizationId,
      tagIds: row.tags.map((tag) => tag.id),
      tags: row.tags ?? [], // Ensure it's an array
      createdAt: row.createdAt.toISOString(),
      createdBy: "",
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  getBySlug(
    params: z.infer<typeof resourceOps.getBySlug.input>,
  ): Promise<z.infer<typeof resourceOps.getBySlug.output>> {
    throw new Error("Method not implemented.");
  }

  getTransaction<T>(callback: (tx: DrizzlePgTx) => Promise<T>): Promise<T> {
    return this.db.transaction(callback);
  }

  async getById(
    params: z.infer<typeof resourceOps.getById.input>,
  ): Promise<z.infer<typeof resourceOps.getById.output>> {
    const [result] = await this.db
      .select({
        id: resources.id,
        slug: resources.slug,
        title: resources.title,
        description: resources.description,
        teamId: resources.teamId,
        organizationId: resources.organizationId,
        tags: sql<
          { id: string; name: string }[]
        >`COALESCE(json_agg(json_build_object('id', ${resourceTags.id}, 'name', ${resourceTags.tag})), '[]')`.as(
          "tags",
        ),
        createdAt: resources.createdAt,
        createdBy: resources.createdBy,
        updatedAt: resources.updatedAt,
      })
      .from(resources)
      .leftJoin(resourceTagPairs, eq(resources.id, resourceTagPairs.resourceId))
      .leftJoin(resourceTags, eq(resourceTagPairs.tagId, resourceTags.id))
      .where(eq(resources.id, params))
      .limit(1);

    if (!result) return null;

    return {
      ...result,
      tagIds: result.tags.map((tag) => tag.id),
      createdAt: new Date(result.createdAt).toISOString(),
      updatedAt: new Date(result.updatedAt).toISOString(),
    };
  }

  async create(
    params: z.infer<typeof resourceOps.create.input>,
    transaction?: DrizzlePgTx,
  ): Promise<z.infer<typeof resourceOps.create.output>> {
    const createLogic = async (tx: DrizzlePgTx) => {
      const [result] = await tx
        .insert(resources)
        .values({
          slug: params.slug,
          title: params.title,
          description: params.description,
          teamId: params.teamId,
          organizationId: params.organizationId,
          createdBy: params.createdBy,
        })
        .returning();

      for (const tag of params.tagIds) {
        await tx.insert(resourceTagPairs).values({
          resourceId: result.id,
          tagId: tag,
        });
      }
      if (!result || !result.id) throw new Error("Failed to create resource");

      return {
        ...result,
        createdAt: new Date(result.createdAt).toISOString(),
        updatedAt: new Date(result.updatedAt).toISOString(),
        tagIds: params.tagIds,
      };
    };

    return transaction
      ? createLogic(transaction)
      : this.getTransaction(createLogic);
  }

  async update(
    params: z.infer<typeof resourceOps.update.input>,
    transaction?: DrizzlePgTx,
  ): Promise<z.infer<typeof resourceOps.update.output>> {
    throw new Error("Method not implemented.");
  }

  async delete(
    id: z.infer<typeof resourceOps.delete.input>,
    transaction?: DrizzlePgTx,
  ): Promise<z.infer<typeof resourceOps.delete.output>> {
    throw new Error("Method not implemented.");
  }
}
