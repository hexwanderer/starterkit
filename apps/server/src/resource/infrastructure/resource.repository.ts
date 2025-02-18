import {
  type DatabaseHandler,
  resourceTable,
  resourceTagPairsTable,
  resourceTagsTable,
  users,
} from "@repo/database";
import { eq, sql } from "drizzle-orm";
import type { Resource } from "../domain/resource.type";

export interface ResourceRepository {
  getAll(): Promise<Resource[]>;
  getById(id: string): Promise<Resource | null>;
  create(resource: Resource): Promise<Resource>;
  update(resource: Resource): Promise<Resource>;
  delete(id: string): Promise<void>;
}

export class ResourcePostgresImpl implements ResourceRepository {
  db: DatabaseHandler;

  constructor(db: DatabaseHandler) {
    this.db = db;
  }

  async getAll(): Promise<Resource[]> {
    const resources = await this.db
      .select({
        id: resourceTable.id,
        title: resourceTable.title,
        description: resourceTable.description,
        tags: sql<
          string[]
        >`COALESCE(array_agg(${resourceTagsTable.tag}), '{}')`.as("tags"),
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

  async getById(id: string): Promise<Resource | null> {
    const [result] = await this.db
      .select({
        id: resourceTable.id,
        title: resourceTable.title,
        description: resourceTable.description,
        tags: sql<
          string[]
        >`COALESCE(array_agg(${resourceTagsTable.tag}), '{}')`.as("tags"),
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

  async create(resource: Resource): Promise<Resource> {
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
      ...resource,
      tags: newTagsWithIds,
    };
  }

  update(resource: Resource): Promise<Resource> {
    console.log("update", resource);
    throw new Error("Method not implemented.");
  }

  delete(id: string): Promise<void> {
    console.log("delete", id);
    throw new Error("Method not implemented.");
  }
}
