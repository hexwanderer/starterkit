import {
  type DatabaseHandler,
  organizations,
  teamMembers,
  teams,
  users,
} from "@repo/database";
import { and, eq, sql } from "drizzle-orm";
import {
  listSchema,
  inferSchema,
  teamSchema,
  teamMemberSchema,
} from "@repo/types";
import { z } from "zod";

export const teamOps = {
  list: inferSchema(
    listSchema(
      teamSchema.pick({
        organizationId: true,
        visibility: true,
      }),
      ["name", "createdAt"],
    ),
    z.array(teamSchema),
  ),

  getById: inferSchema(
    z.string(),
    teamSchema
      .merge(
        z.object({
          members: z.array(
            teamMemberSchema.omit({
              team: true,
              teamId: true,
            }),
          ),
        }),
      )
      .nullable(),
  ),
  getBySlug: inferSchema(
    z.object({
      slug: z.string(),
      organizationSlug: z.string(),
    }),
    teamSchema
      .merge(
        z.object({
          members: z.array(
            teamMemberSchema.omit({
              team: true,
              teamId: true,
            }),
          ),
        }),
      )
      .nullable(),
  ),

  create: inferSchema(
    teamSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    teamSchema.merge(
      z.object({
        members: z.array(
          teamMemberSchema.pick({ id: true, userId: true, role: true }),
        ),
      }),
    ),
  ),

  update: inferSchema(
    teamSchema
      .pick({ id: true, name: true, visibility: true })
      .partial({ name: true, visibility: true }),
    teamSchema,
  ),

  delete: inferSchema(z.string(), z.void()),
};

export interface TeamRepository {
  getAll(
    params: z.infer<typeof teamOps.list.input>,
  ): Promise<z.infer<typeof teamOps.list.output>>;

  getById(
    params: z.infer<typeof teamOps.getById.input>,
  ): Promise<z.infer<typeof teamOps.getById.output>>;

  getBySlug(
    params: z.infer<typeof teamOps.getBySlug.input>,
  ): Promise<z.infer<typeof teamOps.getBySlug.output>>;

  create(
    team: z.infer<typeof teamOps.create.input>,
  ): Promise<z.infer<typeof teamOps.create.output>>;

  update(
    team: z.infer<typeof teamOps.update.input>,
  ): Promise<z.infer<typeof teamOps.update.output>>;

  delete(
    id: z.infer<typeof teamOps.delete.input>,
  ): Promise<z.infer<typeof teamOps.delete.output>>;

  addMember(teamId: string, userId: string): Promise<void>;
}

export class TeamPostgresImpl implements TeamRepository {
  db: DatabaseHandler;

  constructor(db: DatabaseHandler) {
    this.db = db;
  }

  async getAll(
    params: z.infer<typeof teamOps.list.input>,
  ): Promise<z.infer<typeof teamOps.list.output>> {
    const query = this.db
      .select({
        id: teams.id,
        name: teams.name,
        description: teams.description,
        slug: teams.slug,
        organizationId: teams.organizationId,
        isPublic: teams.isPublic,
        createdBy: teams.createdBy,
        createdAt: teams.createdAt,
        updatedAt: teams.updatedAt,
        members: sql<
          {
            id: string;
            member: {
              id: string;
              name: string;
              email: string;
            };
            role: string;
          }[]
        >`COALESCE(json_agg(json_build_object('id', ${teamMembers.id}, 'member', json_build_object('id', ${teamMembers.userId}, 'name', ${users.name}, 'email', ${users.email}), 'role', ${teamMembers.role})), '[]')`.as(
          "members",
        ),
      })
      .from(teams)
      .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .where(
        params?.filter?.organizationId
          ? eq(teams.organizationId, params?.filter?.organizationId)
          : undefined,
      )
      .groupBy(
        teams.id,
        teams.name,
        teams.description,
        teams.organizationId,
        teams.slug,
        teams.isPublic,
        teams.createdBy,
        teams.createdAt,
        teams.updatedAt,
      );

    const results = await query.execute();
    return results.map((result) => ({
      id: result.id,
      name: result.name,
      description: result.description,
      slug: result.slug,
      organizationId: result.organizationId,
      visibility: result.isPublic ? "public" : "private",
      createdBy: result.createdBy,
      members: result.members.map((member) => ({
        id: member.id,
        user: {
          id: member.member.id,
          name: member.member.name,
          email: member.member.email,
        },
        role: member.role,
      })),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    }));
  }

  async getBySlug(
    params: z.infer<typeof teamOps.getBySlug.input>,
  ): Promise<z.infer<typeof teamOps.getBySlug.output>> {
    const results = await this.db
      .select({
        id: teams.id,
        name: teams.name,
        slug: teams.slug,
        description: teams.description,
        organizationId: teams.organizationId,
        createdAt: teams.createdAt,
        updatedAt: teams.updatedAt,
        createdBy: teams.createdBy,
        isPublic: teams.isPublic,
        members: sql<
          {
            id: string;
            member: { id: string; name: string; email: string };
            role: string;
          }[]
        >`COALESCE(json_agg(json_build_object('id', ${teamMembers.id}, 'member', json_build_object('id', ${teamMembers.userId}, 'name', ${users.name}, 'email', ${users.email}), 'role', ${teamMembers.role})), '[]')`.as(
          "members",
        ),
      })
      .from(teams)
      .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .leftJoin(organizations, eq(teams.organizationId, organizations.id))
      .where(
        and(
          eq(teams.slug, params.slug),
          eq(organizations.slug, params.organizationSlug),
        ),
      )
      .groupBy(
        teams.id,
        teams.name,
        teams.description,
        teams.organizationId,
        teams.slug,
        teams.isPublic,
        teams.createdBy,
        teams.createdAt,
        teams.updatedAt,
      )
      .limit(1)
      .execute();

    if (results.length === 0) return null;
    const result = results[0];
    return {
      id: result.id,
      name: result.name,
      description: result.description,
      slug: result.slug,
      organizationId: result.organizationId,
      visibility: result.isPublic ? "public" : "private",
      createdBy: result.createdBy,
      members: result.members.map((member) => ({
        id: member.id,
        userId: member.member.id,
        user: {
          name: member.member.name,
          email: member.member.email,
        },
        role: member.role as "owner" | "admin" | "member",
      })),
      createdAt: new Date(result.createdAt).toISOString(),
      updatedAt: new Date(result.updatedAt).toISOString(),
    };
  }

  async getById(
    params: z.infer<typeof teamOps.getById.input>,
  ): Promise<z.infer<typeof teamOps.getById.output>> {
    const results = await this.db
      .select({
        id: teams.id,
        name: teams.name,
        slug: teams.slug,
        description: teams.description,
        organizationId: teams.organizationId,
        createdAt: teams.createdAt,
        updatedAt: teams.updatedAt,
        createdBy: teams.createdBy,
        isPublic: teams.isPublic,
        members: sql<
          {
            id: string;
            member: { id: string; name: string; email: string };
            role: string;
          }[]
        >`COALESCE(json_agg(json_build_object('id', ${teamMembers.id}, 'member', json_build_object('id', ${teamMembers.userId}, 'name', ${users.name}, 'email', ${users.email}), 'role', ${teamMembers.role})), '[]')`.as(
          "members",
        ),
      })
      .from(teams)
      .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .leftJoin(organizations, eq(teams.organizationId, organizations.id))
      .where(eq(teams.id, params))
      .groupBy(
        teams.id,
        teams.name,
        teams.description,
        teams.organizationId,
        teams.slug,
        teams.isPublic,
        teams.createdBy,
        teams.createdAt,
        teams.updatedAt,
      )
      .limit(1)
      .execute();

    if (results.length === 0) return null;
    const result = results[0];
    return {
      id: result.id,
      name: result.name,
      description: result.description,
      slug: result.slug,
      organizationId: result.organizationId,
      visibility: result.isPublic ? "public" : "private",
      createdBy: result.createdBy,
      members: result.members.map((member) => ({
        id: member.id,
        userId: member.member.id,
        user: {
          name: member.member.name,
          email: member.member.email,
        },
        role: member.role as "owner" | "admin" | "member",
      })),
      createdAt: new Date(result.createdAt).toISOString(),
      updatedAt: new Date(result.updatedAt).toISOString(),
    };
  }

  async create(
    team: z.infer<typeof teamOps.create.input>,
  ): Promise<z.infer<typeof teamOps.create.output>> {
    const [result] = await this.db
      .insert(teams)
      .values({
        name: team.name,
        description: team.description,
        slug: team.slug,
        organizationId: team.organizationId,
        createdBy: team.createdBy,
        isPublic: team.visibility === "public",
      })
      .returning();
    if (!result || !result.id) throw new Error("Failed to create team");

    const [memberResult] = await this.db
      .insert(teamMembers)
      .values({
        teamId: result.id,
        userId: team.createdBy,
        role: "owner",
      })
      .returning();

    if (!memberResult || !memberResult.id)
      throw new Error("Failed to create team member");

    return {
      id: result.id,
      name: result.name,
      description: result.description,
      slug: result.slug,
      organizationId: result.organizationId,
      visibility: result.isPublic ? "public" : "private",
      createdBy: result.createdBy,
      members: [
        {
          id: memberResult.id,
          userId: memberResult.userId,
          role: memberResult.role as "owner" | "admin" | "member",
        },
      ],
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  async update(
    team: z.infer<typeof teamOps.update.input>,
  ): Promise<z.infer<typeof teamOps.update.output>> {
    throw new Error("Method not implemented.");
  }

  async delete(
    id: z.infer<typeof teamOps.delete.input>,
  ): Promise<z.infer<typeof teamOps.delete.output>> {
    throw new Error("Method not implemented.");
  }

  addMember(teamId: string, userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
