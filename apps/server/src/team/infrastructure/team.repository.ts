import { type DatabaseHandler, teamMembers, teams } from "@repo/database";
import type { TeamCreate, TeamGet, TeamUpdate } from "../domain/team.type";

export interface TeamRepository {
  create(team: TeamCreate): Promise<TeamGet>;
  update(team: TeamUpdate): Promise<TeamGet>;
  delete(id: string): Promise<void>;
}

export class TeamPostgresImpl implements TeamRepository {
  db: DatabaseHandler;

  constructor(db: DatabaseHandler) {
    this.db = db;
  }

  async create(team: TeamCreate): Promise<TeamGet> {
    const [result] = await this.db
      .insert(teams)
      .values({
        name: team.name,
        description: team.description,
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
      visibility: result.isPublic ? "public" : "private",
      createdBy: result.createdBy,
      members: [
        {
          id: memberResult.id,
          name: team.createdBy,
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
