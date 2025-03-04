/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from "./routes/__root"
import { Route as LandingImport } from "./routes/_landing"
import { Route as AuthenticatedImport } from "./routes/_authenticated"
import { Route as AuthIndexImport } from "./routes/auth/index"
import { Route as LandingIndexImport } from "./routes/_landing/index"
import { Route as AuthOrgsImport } from "./routes/auth/orgs"
import { Route as LandingFeaturesImport } from "./routes/_landing/features"
import { Route as LandingAboutImport } from "./routes/_landing/about"
import { Route as AuthenticatedPlaygroundImport } from "./routes/_authenticated/playground"
import { Route as AuthenticatedInboxImport } from "./routes/_authenticated/inbox"
import { Route as AuthenticatedDashboardImport } from "./routes/_authenticated/dashboard"
import { Route as AuthenticatedResourcesIndexImport } from "./routes/_authenticated/resources/index"
import { Route as AuthenticatedUserSettingsIndexImport } from "./routes/_authenticated/user/settings/index"
import { Route as AuthenticatedResourcesIdViewImport } from "./routes/_authenticated/resources/$id.view"
import { Route as AuthenticatedResourcesIdEditImport } from "./routes/_authenticated/resources/$id.edit"
import { Route as AuthenticatedOrganizationsOrganizationSlugSettingsImport } from "./routes/_authenticated/organizations/$organizationSlug/settings"
import { Route as AuthenticatedOrganizationsOrganizationSlugInviteImport } from "./routes/_authenticated/organizations/$organizationSlug/invite"
import { Route as AuthenticatedOrganizationsOrganizationSlugTeamsCreateImport } from "./routes/_authenticated/organizations/$organizationSlug/teams/create"
import { Route as AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsImport } from "./routes/_authenticated/organizations/$organizationSlug/teams/$teamSlug.settings"
import { Route as AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteImport } from "./routes/_authenticated/organizations/$organizationSlug/teams/$teamSlug.invite"

// Create/Update Routes

const LandingRoute = LandingImport.update({
  id: "/_landing",
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: "/_authenticated",
  getParentRoute: () => rootRoute,
} as any)

const AuthIndexRoute = AuthIndexImport.update({
  id: "/auth/",
  path: "/auth/",
  getParentRoute: () => rootRoute,
} as any)

const LandingIndexRoute = LandingIndexImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => LandingRoute,
} as any)

const AuthOrgsRoute = AuthOrgsImport.update({
  id: "/auth/orgs",
  path: "/auth/orgs",
  getParentRoute: () => rootRoute,
} as any)

const LandingFeaturesRoute = LandingFeaturesImport.update({
  id: "/features",
  path: "/features",
  getParentRoute: () => LandingRoute,
} as any)

const LandingAboutRoute = LandingAboutImport.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => LandingRoute,
} as any)

const AuthenticatedPlaygroundRoute = AuthenticatedPlaygroundImport.update({
  id: "/playground",
  path: "/playground",
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedInboxRoute = AuthenticatedInboxImport.update({
  id: "/inbox",
  path: "/inbox",
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedDashboardRoute = AuthenticatedDashboardImport.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedResourcesIndexRoute =
  AuthenticatedResourcesIndexImport.update({
    id: "/resources/",
    path: "/resources/",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedUserSettingsIndexRoute =
  AuthenticatedUserSettingsIndexImport.update({
    id: "/user/settings/",
    path: "/user/settings/",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedResourcesIdViewRoute =
  AuthenticatedResourcesIdViewImport.update({
    id: "/resources/$id/view",
    path: "/resources/$id/view",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedResourcesIdEditRoute =
  AuthenticatedResourcesIdEditImport.update({
    id: "/resources/$id/edit",
    path: "/resources/$id/edit",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedOrganizationsOrganizationSlugSettingsRoute =
  AuthenticatedOrganizationsOrganizationSlugSettingsImport.update({
    id: "/organizations/$organizationSlug/settings",
    path: "/organizations/$organizationSlug/settings",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedOrganizationsOrganizationSlugInviteRoute =
  AuthenticatedOrganizationsOrganizationSlugInviteImport.update({
    id: "/organizations/$organizationSlug/invite",
    path: "/organizations/$organizationSlug/invite",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedOrganizationsOrganizationSlugTeamsCreateRoute =
  AuthenticatedOrganizationsOrganizationSlugTeamsCreateImport.update({
    id: "/organizations/$organizationSlug/teams/create",
    path: "/organizations/$organizationSlug/teams/create",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsRoute =
  AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsImport.update({
    id: "/organizations/$organizationSlug/teams/$teamSlug/settings",
    path: "/organizations/$organizationSlug/teams/$teamSlug/settings",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteRoute =
  AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteImport.update({
    id: "/organizations/$organizationSlug/teams/$teamSlug/invite",
    path: "/organizations/$organizationSlug/teams/$teamSlug/invite",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/_authenticated": {
      id: "/_authenticated"
      path: ""
      fullPath: ""
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    "/_landing": {
      id: "/_landing"
      path: ""
      fullPath: ""
      preLoaderRoute: typeof LandingImport
      parentRoute: typeof rootRoute
    }
    "/_authenticated/dashboard": {
      id: "/_authenticated/dashboard"
      path: "/dashboard"
      fullPath: "/dashboard"
      preLoaderRoute: typeof AuthenticatedDashboardImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/inbox": {
      id: "/_authenticated/inbox"
      path: "/inbox"
      fullPath: "/inbox"
      preLoaderRoute: typeof AuthenticatedInboxImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/playground": {
      id: "/_authenticated/playground"
      path: "/playground"
      fullPath: "/playground"
      preLoaderRoute: typeof AuthenticatedPlaygroundImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_landing/about": {
      id: "/_landing/about"
      path: "/about"
      fullPath: "/about"
      preLoaderRoute: typeof LandingAboutImport
      parentRoute: typeof LandingImport
    }
    "/_landing/features": {
      id: "/_landing/features"
      path: "/features"
      fullPath: "/features"
      preLoaderRoute: typeof LandingFeaturesImport
      parentRoute: typeof LandingImport
    }
    "/auth/orgs": {
      id: "/auth/orgs"
      path: "/auth/orgs"
      fullPath: "/auth/orgs"
      preLoaderRoute: typeof AuthOrgsImport
      parentRoute: typeof rootRoute
    }
    "/_landing/": {
      id: "/_landing/"
      path: "/"
      fullPath: "/"
      preLoaderRoute: typeof LandingIndexImport
      parentRoute: typeof LandingImport
    }
    "/auth/": {
      id: "/auth/"
      path: "/auth"
      fullPath: "/auth"
      preLoaderRoute: typeof AuthIndexImport
      parentRoute: typeof rootRoute
    }
    "/_authenticated/resources/": {
      id: "/_authenticated/resources/"
      path: "/resources"
      fullPath: "/resources"
      preLoaderRoute: typeof AuthenticatedResourcesIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/organizations/$organizationSlug/invite": {
      id: "/_authenticated/organizations/$organizationSlug/invite"
      path: "/organizations/$organizationSlug/invite"
      fullPath: "/organizations/$organizationSlug/invite"
      preLoaderRoute: typeof AuthenticatedOrganizationsOrganizationSlugInviteImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/organizations/$organizationSlug/settings": {
      id: "/_authenticated/organizations/$organizationSlug/settings"
      path: "/organizations/$organizationSlug/settings"
      fullPath: "/organizations/$organizationSlug/settings"
      preLoaderRoute: typeof AuthenticatedOrganizationsOrganizationSlugSettingsImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/resources/$id/edit": {
      id: "/_authenticated/resources/$id/edit"
      path: "/resources/$id/edit"
      fullPath: "/resources/$id/edit"
      preLoaderRoute: typeof AuthenticatedResourcesIdEditImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/resources/$id/view": {
      id: "/_authenticated/resources/$id/view"
      path: "/resources/$id/view"
      fullPath: "/resources/$id/view"
      preLoaderRoute: typeof AuthenticatedResourcesIdViewImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/user/settings/": {
      id: "/_authenticated/user/settings/"
      path: "/user/settings"
      fullPath: "/user/settings"
      preLoaderRoute: typeof AuthenticatedUserSettingsIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/organizations/$organizationSlug/teams/create": {
      id: "/_authenticated/organizations/$organizationSlug/teams/create"
      path: "/organizations/$organizationSlug/teams/create"
      fullPath: "/organizations/$organizationSlug/teams/create"
      preLoaderRoute: typeof AuthenticatedOrganizationsOrganizationSlugTeamsCreateImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/invite": {
      id: "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/invite"
      path: "/organizations/$organizationSlug/teams/$teamSlug/invite"
      fullPath: "/organizations/$organizationSlug/teams/$teamSlug/invite"
      preLoaderRoute: typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteImport
      parentRoute: typeof AuthenticatedImport
    }
    "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/settings": {
      id: "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/settings"
      path: "/organizations/$organizationSlug/teams/$teamSlug/settings"
      fullPath: "/organizations/$organizationSlug/teams/$teamSlug/settings"
      preLoaderRoute: typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedRouteChildren {
  AuthenticatedDashboardRoute: typeof AuthenticatedDashboardRoute
  AuthenticatedInboxRoute: typeof AuthenticatedInboxRoute
  AuthenticatedPlaygroundRoute: typeof AuthenticatedPlaygroundRoute
  AuthenticatedResourcesIndexRoute: typeof AuthenticatedResourcesIndexRoute
  AuthenticatedOrganizationsOrganizationSlugInviteRoute: typeof AuthenticatedOrganizationsOrganizationSlugInviteRoute
  AuthenticatedOrganizationsOrganizationSlugSettingsRoute: typeof AuthenticatedOrganizationsOrganizationSlugSettingsRoute
  AuthenticatedResourcesIdEditRoute: typeof AuthenticatedResourcesIdEditRoute
  AuthenticatedResourcesIdViewRoute: typeof AuthenticatedResourcesIdViewRoute
  AuthenticatedUserSettingsIndexRoute: typeof AuthenticatedUserSettingsIndexRoute
  AuthenticatedOrganizationsOrganizationSlugTeamsCreateRoute: typeof AuthenticatedOrganizationsOrganizationSlugTeamsCreateRoute
  AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteRoute: typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteRoute
  AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsRoute: typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedDashboardRoute: AuthenticatedDashboardRoute,
  AuthenticatedInboxRoute: AuthenticatedInboxRoute,
  AuthenticatedPlaygroundRoute: AuthenticatedPlaygroundRoute,
  AuthenticatedResourcesIndexRoute: AuthenticatedResourcesIndexRoute,
  AuthenticatedOrganizationsOrganizationSlugInviteRoute:
    AuthenticatedOrganizationsOrganizationSlugInviteRoute,
  AuthenticatedOrganizationsOrganizationSlugSettingsRoute:
    AuthenticatedOrganizationsOrganizationSlugSettingsRoute,
  AuthenticatedResourcesIdEditRoute: AuthenticatedResourcesIdEditRoute,
  AuthenticatedResourcesIdViewRoute: AuthenticatedResourcesIdViewRoute,
  AuthenticatedUserSettingsIndexRoute: AuthenticatedUserSettingsIndexRoute,
  AuthenticatedOrganizationsOrganizationSlugTeamsCreateRoute:
    AuthenticatedOrganizationsOrganizationSlugTeamsCreateRoute,
  AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteRoute:
    AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteRoute,
  AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsRoute:
    AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

interface LandingRouteChildren {
  LandingAboutRoute: typeof LandingAboutRoute
  LandingFeaturesRoute: typeof LandingFeaturesRoute
  LandingIndexRoute: typeof LandingIndexRoute
}

const LandingRouteChildren: LandingRouteChildren = {
  LandingAboutRoute: LandingAboutRoute,
  LandingFeaturesRoute: LandingFeaturesRoute,
  LandingIndexRoute: LandingIndexRoute,
}

const LandingRouteWithChildren =
  LandingRoute._addFileChildren(LandingRouteChildren)

export interface FileRoutesByFullPath {
  "": typeof LandingRouteWithChildren
  "/dashboard": typeof AuthenticatedDashboardRoute
  "/inbox": typeof AuthenticatedInboxRoute
  "/playground": typeof AuthenticatedPlaygroundRoute
  "/about": typeof LandingAboutRoute
  "/features": typeof LandingFeaturesRoute
  "/auth/orgs": typeof AuthOrgsRoute
  "/": typeof LandingIndexRoute
  "/auth": typeof AuthIndexRoute
  "/resources": typeof AuthenticatedResourcesIndexRoute
  "/organizations/$organizationSlug/invite": typeof AuthenticatedOrganizationsOrganizationSlugInviteRoute
  "/organizations/$organizationSlug/settings": typeof AuthenticatedOrganizationsOrganizationSlugSettingsRoute
  "/resources/$id/edit": typeof AuthenticatedResourcesIdEditRoute
  "/resources/$id/view": typeof AuthenticatedResourcesIdViewRoute
  "/user/settings": typeof AuthenticatedUserSettingsIndexRoute
  "/organizations/$organizationSlug/teams/create": typeof AuthenticatedOrganizationsOrganizationSlugTeamsCreateRoute
  "/organizations/$organizationSlug/teams/$teamSlug/invite": typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteRoute
  "/organizations/$organizationSlug/teams/$teamSlug/settings": typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsRoute
}

export interface FileRoutesByTo {
  "": typeof AuthenticatedRouteWithChildren
  "/dashboard": typeof AuthenticatedDashboardRoute
  "/inbox": typeof AuthenticatedInboxRoute
  "/playground": typeof AuthenticatedPlaygroundRoute
  "/about": typeof LandingAboutRoute
  "/features": typeof LandingFeaturesRoute
  "/auth/orgs": typeof AuthOrgsRoute
  "/": typeof LandingIndexRoute
  "/auth": typeof AuthIndexRoute
  "/resources": typeof AuthenticatedResourcesIndexRoute
  "/organizations/$organizationSlug/invite": typeof AuthenticatedOrganizationsOrganizationSlugInviteRoute
  "/organizations/$organizationSlug/settings": typeof AuthenticatedOrganizationsOrganizationSlugSettingsRoute
  "/resources/$id/edit": typeof AuthenticatedResourcesIdEditRoute
  "/resources/$id/view": typeof AuthenticatedResourcesIdViewRoute
  "/user/settings": typeof AuthenticatedUserSettingsIndexRoute
  "/organizations/$organizationSlug/teams/create": typeof AuthenticatedOrganizationsOrganizationSlugTeamsCreateRoute
  "/organizations/$organizationSlug/teams/$teamSlug/invite": typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteRoute
  "/organizations/$organizationSlug/teams/$teamSlug/settings": typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  "/_authenticated": typeof AuthenticatedRouteWithChildren
  "/_landing": typeof LandingRouteWithChildren
  "/_authenticated/dashboard": typeof AuthenticatedDashboardRoute
  "/_authenticated/inbox": typeof AuthenticatedInboxRoute
  "/_authenticated/playground": typeof AuthenticatedPlaygroundRoute
  "/_landing/about": typeof LandingAboutRoute
  "/_landing/features": typeof LandingFeaturesRoute
  "/auth/orgs": typeof AuthOrgsRoute
  "/_landing/": typeof LandingIndexRoute
  "/auth/": typeof AuthIndexRoute
  "/_authenticated/resources/": typeof AuthenticatedResourcesIndexRoute
  "/_authenticated/organizations/$organizationSlug/invite": typeof AuthenticatedOrganizationsOrganizationSlugInviteRoute
  "/_authenticated/organizations/$organizationSlug/settings": typeof AuthenticatedOrganizationsOrganizationSlugSettingsRoute
  "/_authenticated/resources/$id/edit": typeof AuthenticatedResourcesIdEditRoute
  "/_authenticated/resources/$id/view": typeof AuthenticatedResourcesIdViewRoute
  "/_authenticated/user/settings/": typeof AuthenticatedUserSettingsIndexRoute
  "/_authenticated/organizations/$organizationSlug/teams/create": typeof AuthenticatedOrganizationsOrganizationSlugTeamsCreateRoute
  "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/invite": typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugInviteRoute
  "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/settings": typeof AuthenticatedOrganizationsOrganizationSlugTeamsTeamSlugSettingsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ""
    | "/dashboard"
    | "/inbox"
    | "/playground"
    | "/about"
    | "/features"
    | "/auth/orgs"
    | "/"
    | "/auth"
    | "/resources"
    | "/organizations/$organizationSlug/invite"
    | "/organizations/$organizationSlug/settings"
    | "/resources/$id/edit"
    | "/resources/$id/view"
    | "/user/settings"
    | "/organizations/$organizationSlug/teams/create"
    | "/organizations/$organizationSlug/teams/$teamSlug/invite"
    | "/organizations/$organizationSlug/teams/$teamSlug/settings"
  fileRoutesByTo: FileRoutesByTo
  to:
    | ""
    | "/dashboard"
    | "/inbox"
    | "/playground"
    | "/about"
    | "/features"
    | "/auth/orgs"
    | "/"
    | "/auth"
    | "/resources"
    | "/organizations/$organizationSlug/invite"
    | "/organizations/$organizationSlug/settings"
    | "/resources/$id/edit"
    | "/resources/$id/view"
    | "/user/settings"
    | "/organizations/$organizationSlug/teams/create"
    | "/organizations/$organizationSlug/teams/$teamSlug/invite"
    | "/organizations/$organizationSlug/teams/$teamSlug/settings"
  id:
    | "__root__"
    | "/_authenticated"
    | "/_landing"
    | "/_authenticated/dashboard"
    | "/_authenticated/inbox"
    | "/_authenticated/playground"
    | "/_landing/about"
    | "/_landing/features"
    | "/auth/orgs"
    | "/_landing/"
    | "/auth/"
    | "/_authenticated/resources/"
    | "/_authenticated/organizations/$organizationSlug/invite"
    | "/_authenticated/organizations/$organizationSlug/settings"
    | "/_authenticated/resources/$id/edit"
    | "/_authenticated/resources/$id/view"
    | "/_authenticated/user/settings/"
    | "/_authenticated/organizations/$organizationSlug/teams/create"
    | "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/invite"
    | "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/settings"
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  LandingRoute: typeof LandingRouteWithChildren
  AuthOrgsRoute: typeof AuthOrgsRoute
  AuthIndexRoute: typeof AuthIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LandingRoute: LandingRouteWithChildren,
  AuthOrgsRoute: AuthOrgsRoute,
  AuthIndexRoute: AuthIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/_landing",
        "/auth/orgs",
        "/auth/"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/dashboard",
        "/_authenticated/inbox",
        "/_authenticated/playground",
        "/_authenticated/resources/",
        "/_authenticated/organizations/$organizationSlug/invite",
        "/_authenticated/organizations/$organizationSlug/settings",
        "/_authenticated/resources/$id/edit",
        "/_authenticated/resources/$id/view",
        "/_authenticated/user/settings/",
        "/_authenticated/organizations/$organizationSlug/teams/create",
        "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/invite",
        "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/settings"
      ]
    },
    "/_landing": {
      "filePath": "_landing.tsx",
      "children": [
        "/_landing/about",
        "/_landing/features",
        "/_landing/"
      ]
    },
    "/_authenticated/dashboard": {
      "filePath": "_authenticated/dashboard.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/inbox": {
      "filePath": "_authenticated/inbox.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/playground": {
      "filePath": "_authenticated/playground.tsx",
      "parent": "/_authenticated"
    },
    "/_landing/about": {
      "filePath": "_landing/about.tsx",
      "parent": "/_landing"
    },
    "/_landing/features": {
      "filePath": "_landing/features.tsx",
      "parent": "/_landing"
    },
    "/auth/orgs": {
      "filePath": "auth/orgs.tsx"
    },
    "/_landing/": {
      "filePath": "_landing/index.tsx",
      "parent": "/_landing"
    },
    "/auth/": {
      "filePath": "auth/index.tsx"
    },
    "/_authenticated/resources/": {
      "filePath": "_authenticated/resources/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/organizations/$organizationSlug/invite": {
      "filePath": "_authenticated/organizations/$organizationSlug/invite.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/organizations/$organizationSlug/settings": {
      "filePath": "_authenticated/organizations/$organizationSlug/settings.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/resources/$id/edit": {
      "filePath": "_authenticated/resources/$id.edit.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/resources/$id/view": {
      "filePath": "_authenticated/resources/$id.view.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/user/settings/": {
      "filePath": "_authenticated/user/settings/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/organizations/$organizationSlug/teams/create": {
      "filePath": "_authenticated/organizations/$organizationSlug/teams/create.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/invite": {
      "filePath": "_authenticated/organizations/$organizationSlug/teams/$teamSlug.invite.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/settings": {
      "filePath": "_authenticated/organizations/$organizationSlug/teams/$teamSlug.settings.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
