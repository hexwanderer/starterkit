type Team = {
  id: string;
  name: string;
  description: string;
  visibility: "public" | "private";
  createdBy: string;
  members: {
    id: string;
    user: {
      id: string;
      name: string;
    };
  }[];
};

type Resource = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  createdBy: string;
  teamId: string;
  privacy: "public" | "private";
};

export type Role = "owner" | "admin" | "user";

type User = {
  roles: Role[];
  id: string;
  activeOrganizationId?: string;
};

type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean);

type RolesWithPermissions = {
  [R in Role]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>;
    }>;
  }>;
};

type Permissions = {
  team: {
    dataType: Team;
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
  user: {
    team: {
      view: (user, team) => {
        return (
          team.visibility === "public" ||
          team.members.some((member) => member.id === user.id)
        );
      },
      create: false,
      update: false,
      delete: false,
    },
    resource: {
      view: (user, resource) => {
        return user.activeOrganizationId === resource.teamId;
      },
      create: true,
      update: (user, resource) => resource.createdBy === user.id,
      delete: (user, resource) => resource.createdBy === user.id,
    },
  },
} as const satisfies RolesWithPermissions;

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"],
) {
  return user.roles.some((role) => {
    const permission = (ROLES as RolesWithPermissions)[role][resource]?.[
      action
    ];
    if (permission == null) return false;

    if (typeof permission === "boolean") return permission;
    return data != null && permission(user, data);
  });
}
