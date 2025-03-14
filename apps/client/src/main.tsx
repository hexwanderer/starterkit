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
import * as Sentry from "@sentry/react";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { InputWithLabel } from "./components/form/input";
import { PasswordWithLabel } from "./components/form/password";
import { SubmitButton } from "./components/form/submit-button";
import { LongInputWithLabel } from "./components/form/long-input";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    authClient: undefined!,
  },
  pathParamsAllowedCharacters: [":"],
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    InputWithLabel,
    PasswordWithLabel,
    LongInputWithLabel,
  },
  formComponents: {
    SubmitButton,
  },
});

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

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost"],
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
