type Comment = {
  id: string;
  body: string;
  authorId: string;
  createdAt: Date;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  created_by: string;
  organizational_unit_id: string;
  privacy: "public" | "private";
};

type Role = "owner" | "admin" | "user";
type User = {
  roles: Role[];
  id: string;
  active_organization_id?: string;
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
  comments: {
    dataType: Comment;
    action: "view" | "create" | "update";
  };
  resource: {
    // Can do something like Pick<Todo, "userId"> to get just the rows you use
    dataType: Resource;
    action: "view" | "create" | "update" | "delete";
  };
};

const ROLES = {
  owner: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    resource: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  admin: {
    comments: {
      view: true,
      create: true,
      update: true,
    },
    resource: {
      view: true,
      create: true,
      update: true,
      delete: true,
    },
  },
  user: {
    comments: {
      view: false,
      create: true,
      update: false,
    },
    resource: {
      view: (user, resource) => {
        return user.active_organization_id === resource.organizational_unit_id;
      },
      create: true,
      update: (user, resource) => resource.created_by === user.id,
      delete: (user, resource) => resource.created_by === user.id,
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
