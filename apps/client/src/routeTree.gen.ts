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
import { Route as AuthenticatedDashboardImport } from "./routes/_authenticated/dashboard"
import { Route as AuthenticatedResourcesIndexImport } from "./routes/_authenticated/resources/index"
import { Route as AuthenticatedUserSettingsIndexImport } from "./routes/_authenticated/user/settings/index"
import { Route as AuthenticatedResourcesIdViewImport } from "./routes/_authenticated/resources/$id.view"
import { Route as AuthenticatedResourcesIdEditImport } from "./routes/_authenticated/resources/$id.edit"
import { Route as AuthenticatedOrganizationsOrganizationIdSettingsImport } from "./routes/_authenticated/organizations/$organizationId/settings"
import { Route as AuthenticatedOrganizationsOrganizationIdTeamsCreateImport } from "./routes/_authenticated/organizations/$organizationId/teams/create"

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

const AuthenticatedOrganizationsOrganizationIdSettingsRoute =
  AuthenticatedOrganizationsOrganizationIdSettingsImport.update({
    id: "/organizations/$organizationId/settings",
    path: "/organizations/$organizationId/settings",
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedOrganizationsOrganizationIdTeamsCreateRoute =
  AuthenticatedOrganizationsOrganizationIdTeamsCreateImport.update({
    id: "/organizations/$organizationId/teams/create",
    path: "/organizations/$organizationId/teams/create",
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
    "/_authenticated/organizations/$organizationId/settings": {
      id: "/_authenticated/organizations/$organizationId/settings"
      path: "/organizations/$organizationId/settings"
      fullPath: "/organizations/$organizationId/settings"
      preLoaderRoute: typeof AuthenticatedOrganizationsOrganizationIdSettingsImport
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
    "/_authenticated/organizations/$organizationId/teams/create": {
      id: "/_authenticated/organizations/$organizationId/teams/create"
      path: "/organizations/$organizationId/teams/create"
      fullPath: "/organizations/$organizationId/teams/create"
      preLoaderRoute: typeof AuthenticatedOrganizationsOrganizationIdTeamsCreateImport
      parentRoute: typeof AuthenticatedImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedRouteChildren {
  AuthenticatedDashboardRoute: typeof AuthenticatedDashboardRoute
  AuthenticatedResourcesIndexRoute: typeof AuthenticatedResourcesIndexRoute
  AuthenticatedOrganizationsOrganizationIdSettingsRoute: typeof AuthenticatedOrganizationsOrganizationIdSettingsRoute
  AuthenticatedResourcesIdEditRoute: typeof AuthenticatedResourcesIdEditRoute
  AuthenticatedResourcesIdViewRoute: typeof AuthenticatedResourcesIdViewRoute
  AuthenticatedUserSettingsIndexRoute: typeof AuthenticatedUserSettingsIndexRoute
  AuthenticatedOrganizationsOrganizationIdTeamsCreateRoute: typeof AuthenticatedOrganizationsOrganizationIdTeamsCreateRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedDashboardRoute: AuthenticatedDashboardRoute,
  AuthenticatedResourcesIndexRoute: AuthenticatedResourcesIndexRoute,
  AuthenticatedOrganizationsOrganizationIdSettingsRoute:
    AuthenticatedOrganizationsOrganizationIdSettingsRoute,
  AuthenticatedResourcesIdEditRoute: AuthenticatedResourcesIdEditRoute,
  AuthenticatedResourcesIdViewRoute: AuthenticatedResourcesIdViewRoute,
  AuthenticatedUserSettingsIndexRoute: AuthenticatedUserSettingsIndexRoute,
  AuthenticatedOrganizationsOrganizationIdTeamsCreateRoute:
    AuthenticatedOrganizationsOrganizationIdTeamsCreateRoute,
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
  "/about": typeof LandingAboutRoute
  "/features": typeof LandingFeaturesRoute
  "/auth/orgs": typeof AuthOrgsRoute
  "/": typeof LandingIndexRoute
  "/auth": typeof AuthIndexRoute
  "/resources": typeof AuthenticatedResourcesIndexRoute
  "/organizations/$organizationId/settings": typeof AuthenticatedOrganizationsOrganizationIdSettingsRoute
  "/resources/$id/edit": typeof AuthenticatedResourcesIdEditRoute
  "/resources/$id/view": typeof AuthenticatedResourcesIdViewRoute
  "/user/settings": typeof AuthenticatedUserSettingsIndexRoute
  "/organizations/$organizationId/teams/create": typeof AuthenticatedOrganizationsOrganizationIdTeamsCreateRoute
}

export interface FileRoutesByTo {
  "": typeof AuthenticatedRouteWithChildren
  "/dashboard": typeof AuthenticatedDashboardRoute
  "/about": typeof LandingAboutRoute
  "/features": typeof LandingFeaturesRoute
  "/auth/orgs": typeof AuthOrgsRoute
  "/": typeof LandingIndexRoute
  "/auth": typeof AuthIndexRoute
  "/resources": typeof AuthenticatedResourcesIndexRoute
  "/organizations/$organizationId/settings": typeof AuthenticatedOrganizationsOrganizationIdSettingsRoute
  "/resources/$id/edit": typeof AuthenticatedResourcesIdEditRoute
  "/resources/$id/view": typeof AuthenticatedResourcesIdViewRoute
  "/user/settings": typeof AuthenticatedUserSettingsIndexRoute
  "/organizations/$organizationId/teams/create": typeof AuthenticatedOrganizationsOrganizationIdTeamsCreateRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  "/_authenticated": typeof AuthenticatedRouteWithChildren
  "/_landing": typeof LandingRouteWithChildren
  "/_authenticated/dashboard": typeof AuthenticatedDashboardRoute
  "/_landing/about": typeof LandingAboutRoute
  "/_landing/features": typeof LandingFeaturesRoute
  "/auth/orgs": typeof AuthOrgsRoute
  "/_landing/": typeof LandingIndexRoute
  "/auth/": typeof AuthIndexRoute
  "/_authenticated/resources/": typeof AuthenticatedResourcesIndexRoute
  "/_authenticated/organizations/$organizationId/settings": typeof AuthenticatedOrganizationsOrganizationIdSettingsRoute
  "/_authenticated/resources/$id/edit": typeof AuthenticatedResourcesIdEditRoute
  "/_authenticated/resources/$id/view": typeof AuthenticatedResourcesIdViewRoute
  "/_authenticated/user/settings/": typeof AuthenticatedUserSettingsIndexRoute
  "/_authenticated/organizations/$organizationId/teams/create": typeof AuthenticatedOrganizationsOrganizationIdTeamsCreateRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ""
    | "/dashboard"
    | "/about"
    | "/features"
    | "/auth/orgs"
    | "/"
    | "/auth"
    | "/resources"
    | "/organizations/$organizationId/settings"
    | "/resources/$id/edit"
    | "/resources/$id/view"
    | "/user/settings"
    | "/organizations/$organizationId/teams/create"
  fileRoutesByTo: FileRoutesByTo
  to:
    | ""
    | "/dashboard"
    | "/about"
    | "/features"
    | "/auth/orgs"
    | "/"
    | "/auth"
    | "/resources"
    | "/organizations/$organizationId/settings"
    | "/resources/$id/edit"
    | "/resources/$id/view"
    | "/user/settings"
    | "/organizations/$organizationId/teams/create"
  id:
    | "__root__"
    | "/_authenticated"
    | "/_landing"
    | "/_authenticated/dashboard"
    | "/_landing/about"
    | "/_landing/features"
    | "/auth/orgs"
    | "/_landing/"
    | "/auth/"
    | "/_authenticated/resources/"
    | "/_authenticated/organizations/$organizationId/settings"
    | "/_authenticated/resources/$id/edit"
    | "/_authenticated/resources/$id/view"
    | "/_authenticated/user/settings/"
    | "/_authenticated/organizations/$organizationId/teams/create"
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
        "/_authenticated/resources/",
        "/_authenticated/organizations/$organizationId/settings",
        "/_authenticated/resources/$id/edit",
        "/_authenticated/resources/$id/view",
        "/_authenticated/user/settings/",
        "/_authenticated/organizations/$organizationId/teams/create"
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
    "/_authenticated/organizations/$organizationId/settings": {
      "filePath": "_authenticated/organizations/$organizationId/settings.tsx",
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
    "/_authenticated/organizations/$organizationId/teams/create": {
      "filePath": "_authenticated/organizations/$organizationId/teams/create.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
