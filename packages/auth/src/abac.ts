import type { RequestorContext, Role, TeamQueryIdentifying } from "@repo/types";

type Resource = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdBy: string;
  teamId: string;
  privacy: "public" | "private";
};

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: RequestorContext, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

type Permissions = {
  team: {
    dataType: TeamQueryIdentifying;
    action: "view" | "create" | "update" | "delete";
  };
  resource: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: Resource;
    action: "view" | "create" | "update" | "delete";
  };
};

const ROLES = {
  owner: {
    team: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    resource: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  admin: {
    team: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
    resource: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  "team.delete": {
    team: {
      delete: true,
    },
  },
  "team.creator": {
    team: {
      view: (user, team) => {
        return team.createdBy === user.user.id;
      },
      create: (user, team) => {
        return team.createdBy === user.user.id;
      },
      update: (user, team) => {
        return team.createdBy === user.user.id;
      },
      delete: (user, team) => {
        return team.createdBy === user.user.id;
      },
    },
  },
  "resource.delete": {
    resource: {
      delete: true,
    },
  },
  user: {
    team: {
      view: (user, team) => {
        return (
          team.visibility === "public" ||
          team.members.some((member) => member.id === user.user.id)
        );
      },
      create: false,
      update: false,
      delete: false,
    },
    resource: {
      view: (user, resource) => {
        return user.teams.some((team) => team.id === resource.teamId);
      },
      create: true,
      update: (user, resource) => resource.createdBy === user.user.id,
      delete: (user, resource) => resource.createdBy === user.user.id,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: RequestorContext | undefined,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
) {
  if (!user) return false;
  return user.organization.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}
