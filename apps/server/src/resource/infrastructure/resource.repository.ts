import {
  type DatabaseHandler,
  resources,
  resourceTagPairs,
  resourceTags,
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
    const resourcesList = await this.db
      .select({
        id: resources.id,
        title: resources.title,
        description: resources.description,
        tags: sql<
          { id: string; name: string }[]
        >`COALESCE(json_agg(json_build_object('id', ${resourceTags.id}, 'name', ${resourceTags.tag})), '[]')`.as(
          "tags",
        ),
      })
      .from(resources)
      .leftJoin(resourceTagPairs, eq(resources.id, resourceTagPairs.resourceId))
      .leftJoin(resourceTags, eq(resourceTagPairs.tagId, resourceTags.id))
      .groupBy(resources.id)
      .orderBy(resources.title);

    return resourcesList.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      tags: r.tags ?? [], // Ensure it's an array
    }));
  }

  async getById(id: string): Promise<ResourceGet | null> {
    const [result] = await this.db
      .select({
        id: resources.id,
        title: resources.title,
        description: resources.description,
        tags: sql<
          { id: string; name: string }[]
        >`COALESCE(json_agg(json_build_object('id', ${resourceTags.id}, 'name', ${resourceTags.tag})), '[]')`.as(
          "tags",
        ),
      })
      .from(resources)
      .leftJoin(resourceTagPairs, eq(resources.id, resourceTagPairs.resourceId))
      .leftJoin(resourceTags, eq(resourceTagPairs.tagId, resourceTags.id))
      .where(eq(resources.id, id))
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
      .insert(resources)
      .values({
        title: resource.title,
        description: resource.description,
      })
      .returning();
    if (!result) throw new Error("Failed to create resource");

    const existingTags = resource.tags.filter((tag) => typeof tag !== "string");
    for (const tag of existingTags) {
      await this.db.insert(resourceTagPairs).values({
        resourceId: result.id,
        tagId: tag.id,
      });
    }

    const newTagsWithIds: { id: string; name: string }[] = [];
    const newTags = resource.tags.filter((tag) => typeof tag === "string");
    for (const tag of newTags) {
      const [tagResult] = await this.db
        .insert(resourceTags)
        .values({
          tag: tag,
        })
        .returning();
      if (!tagResult) throw new Error("Failed to create tag");

      await this.db.insert(resourceTagPairs).values({
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
