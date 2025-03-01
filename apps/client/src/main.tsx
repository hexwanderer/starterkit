import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import "./theme.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { buildProvidersTree } from "@/lib/providers-tree";
import { treaty } from "@elysiajs/eden";
import { ac, admin, member, owner } from "@repo/auth";
import type { App } from "@repo/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { Toaster } from "sonner";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { AppRouter } from "@repo/trpc";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { PosthogInit } from "./lib/posthog";
import { PostHogProvider } from "posthog-js/react";
import { Cookies } from "./components/cookies";
import posthog from "posthog-js";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    authClient: undefined!,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();
export const authClient = createAuthClient({
  baseURL: "",
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner,
        admin,
        member,
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 10,
    },
  },
});

export const serverClient = treaty<App>("http://localhost:7505", {
  onRequest: async (_path, options) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    return {
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  },
});

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:7506/api",
      headers() {
        const token = localStorage.getItem("authToken");
        return {
          Authorization: token ? `Bearer ${token}` : undefined,
        };
      },
    }),
  ],
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No root element found");

const ProviderTree = buildProvidersTree([
  [QueryClientProvider, { client: queryClient }],
  [
    TRPCProvider,
    {
      trpcClient: trpcClient,
      queryClient: queryClient,
    },
  ],
  [SidebarProvider, {}],
  [ThemeProvider, {}],
]);

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <ProviderTree>
        <PostHogProvider client={posthog}>
          <RouterProvider router={router} context={{ authClient }} />
          <Toaster />
          <PosthogInit />
          <Cookies />
        </PostHogProvider>
      </ProviderTree>
    </StrictMode>,
  );
}
