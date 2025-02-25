import {
  type DatabaseHandler,
  teamMembers,
  teams,
  users,
} from "@repo/database";
import type {
  TeamCreate,
  TeamGet,
  TeamQueryGetAll,
  TeamUpdate,
} from "@repo/types";
import { eq, sql } from "drizzle-orm";
import { organization } from "better-auth/plugins";

export interface TeamRepository {
  getAll(params: TeamQueryGetAll): Promise<TeamGet[]>;
  getById(id: string): Promise<TeamGet | null>;
  create(team: TeamCreate): Promise<TeamGet>;
  update(team: TeamUpdate): Promise<TeamGet>;
  delete(id: string): Promise<void>;
}

export class TeamPostgresImpl implements TeamRepository {
  db: DatabaseHandler;

  constructor(db: DatabaseHandler) {
    this.db = db;
  }

  async getAll(params: TeamQueryGetAll): Promise<TeamGet[]> {
    const query = this.db
      .select({
        id: teams.id,
        name: teams.name,
        description: teams.description,
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
            };
          }[]
        >`COALESCE(json_agg(json_build_object('id', ${teamMembers.id}, 'member', json_build_object('id', ${teamMembers.userId}, 'name', ${users.name}))), '[]')`.as(
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
      );

    const results = await query.execute();
    return results.map((result) => ({
      id: result.id,
      name: result.name,
      description: result.description,
      organizationId: result.organizationId,
      visibility: result.isPublic ? "public" : "private",
      createdBy: result.createdBy,
      members: result.members.map((member) => ({
        id: member.id,
        user: {
          id: member.member.id,
          name: member.member.name,
        },
      })),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    }));
  }

  async getById(id: string): Promise<TeamGet | null> {
    const [result] = await this.db
      .select({
        id: teams.id,
        name: teams.name,
        description: teams.description,
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
            };
          }[]
        >`COALESCE(json_agg(json_build_object('id', ${teamMembers.id}, 'member', json_build_object('id', ${teamMembers.userId}, 'name', ${users.name}))), '[]')`.as(
          "members",
        ),
      })
      .from(teams)
      .leftJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teams.id, id))
      .limit(1);

    if (!result) return null;

    return {
      id: result.id,
      name: result.name,
      description: result.description,
      organizationId: result.organizationId,
      visibility: result.isPublic ? "public" : "private",
      createdBy: result.createdBy,
      members: result.members.map((member) => ({
        id: member.id,
        user: {
          id: member.member.id,
          name: member.member.name,
        },
      })),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  async create(team: TeamCreate): Promise<TeamGet> {
    const [result] = await this.db
      .insert(teams)
      .values({
        name: team.name,
        description: team.description,
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
      })
      .returning();

    if (!memberResult || !memberResult.id)
      throw new Error("Failed to create team member");

    return {
      id: result.id,
      name: result.name,
      description: result.description,
      organizationId: result.organizationId,
      visibility: result.isPublic ? "public" : "private",
      createdBy: result.createdBy,
      members: [
        {
          id: memberResult.id,
          user: {
            id: memberResult.userId,
            name: "",
          },
        },
      ],
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.updatedAt.toISOString(),
    };
  }

  async update(team: TeamUpdate): Promise<TeamGet> {
    console.log("update", team);
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    console.log("delete", id);
    throw new Error("Method not implemented.");
  }
}
