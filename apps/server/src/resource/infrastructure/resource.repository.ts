import {
  type DatabaseHandler,
  resourceTable,
  resourceTagPairsTable,
  resourceTagsTable,
  users,
} from "@repo/database";
import { eq, sql } from "drizzle-orm";
import type {
  ResourceGet,
  ResourceCreate,
  ResourceUpdate,
} from "../domain/resource.type";

export interface ResourceRepository {
  getAll(): Promise<ResourceGet[]>;
  getById(id: string): Promise<ResourceGet | null>;
  create(resource: ResourceCreate): Promise<ResourceGet>;
  update(resource: ResourceUpdate): Promise<ResourceGet>;
  delete(id: string): Promise<void>;
}

export class ResourcePostgresImpl implements ResourceRepository {
  db: DatabaseHandler;

  constructor(db: DatabaseHandler) {
    this.db = db;
  }

  async getAll(): Promise<ResourceGet[]> {
    const resources = await this.db
      .select({
        id: resourceTable.id,
        title: resourceTable.title,
        description: resourceTable.description,
        tags: sql<
          { id: string; name: string }[]
        >`COALESCE(json_agg(json_build_object('id', ${resourceTagsTable.id}, 'name', ${resourceTagsTable.tag})), '[]')`.as(
          "tags",
        ),
      })
      .from(resourceTable)
      .leftJoin(
        resourceTagPairsTable,
        eq(resourceTable.id, resourceTagPairsTable.resourceId),
      )
      .leftJoin(
        resourceTagsTable,
        eq(resourceTagPairsTable.tagId, resourceTagsTable.id),
      )
      .groupBy(resourceTable.id)
      .orderBy(resourceTable.title);

    return resources.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      tags: r.tags ?? [], // Ensure it's an array
    }));
  }

  async getById(id: string): Promise<ResourceGet | null> {
    const [result] = await this.db
      .select({
        id: resourceTable.id,
        title: resourceTable.title,
        description: resourceTable.description,
        tags: sql<
          { id: string; name: string }[]
        >`COALESCE(json_agg(json_build_object('id', ${resourceTagsTable.id}, 'name', ${resourceTagsTable.tag})), '[]')`.as(
          "tags",
        ),
      })
      .from(resourceTable)
      .leftJoin(
        resourceTagPairsTable,
        eq(resourceTable.id, resourceTagPairsTable.resourceId),
      )
      .leftJoin(
        resourceTagsTable,
        eq(resourceTagPairsTable.tagId, resourceTagsTable.id),
      )
      .where(eq(resourceTable.id, id))
      .limit(1);

    if (!result) return null;

    return {
      id: result.id,
      title: result.title,
      description: result.description,
      tags: result.tags ?? [], // Ensure it's an array
    };
  }

  async create(resource: ResourceCreate): Promise<ResourceGet> {
    const [result] = await this.db
      .insert(resourceTable)
      .values({
        title: resource.title,
        description: resource.description,
      })
      .returning();
    if (!result) throw new Error("Failed to create resource");

    const existingTags = resource.tags.filter((tag) => typeof tag !== "string");
    for (const tag of existingTags) {
      await this.db.insert(resourceTagPairsTable).values({
        resourceId: result.id,
        tagId: tag.id,
      });
    }

    const newTagsWithIds: { id: string; name: string }[] = [];
    const newTags = resource.tags.filter((tag) => typeof tag === "string");
    for (const tag of newTags) {
      const [tagResult] = await this.db
        .insert(resourceTagsTable)
        .values({
          tag: tag,
        })
        .returning();
      if (!tagResult) throw new Error("Failed to create tag");

      await this.db.insert(resourceTagPairsTable).values({
        resourceId: result.id,
        tagId: tagResult.id,
      });
      newTagsWithIds.push({
        id: tagResult.id,
        name: tag,
      });
    }

    return {
      ...result,
      tags: newTagsWithIds,
    };
  }

  update(resource: ResourceUpdate): Promise<ResourceGet> {
    console.log("update", resource);
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<void> {
    console.log("delete", id);
    throw new Error("Method not implemented.");
  }
}
