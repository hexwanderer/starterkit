import { Header, TitleProvider } from "@/components/header";
import { AppSidebar } from "@/components/sidebar";
import * as Sentry from "@sentry/react";
import { CommandDialog } from "@/features/command/components/command-dialog";
import { KeyboardShortcutHandler } from "@/features/command/components/keyboard-shortcut-handler";
import { CommandProvider } from "@/features/command/hooks/command-provider";
import type { CommandAction } from "@/features/command/stores/command-store";
import { NotificationProvider } from "@/features/notifications/hooks/notification-provider";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { useMemo } from "react";
import { toast } from "sonner";
import { ErrorFallback } from "@/components/error-fallback";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const session = await context.authClient.getSession();
    if (!session || !session.data?.session) {
      toast.info("Please sign in or create an account to continue");
      throw redirect({
        to: "/",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const commands = useMemo<CommandAction[]>(
    () => [
      {
        id: "nav-dashboard",
        name: "Go to Dashboard",
        description: "Navigate to the dashboard",
        shortcut: ["D"],
        callback: () =>
          navigate({
            to: "/dashboard",
          }),
      },
      {
        id: "nav-create-new-resource",
        name: "Create New Resource",
        description: "Create a new resource",
        shortcut: ["C"],
        callback: () =>
          navigate({
            to: "/resources/$id/edit",
            params: { id: String.raw`:new` },
          }),
      },
    ],
    [navigate],
  );

  return (
    <div className="flex flex-grow h-screen w-full">
      {/* Main Content */}
      <TitleProvider>
        <NotificationProvider>
          <CommandProvider globalActions={commands}>
            {/* Sidebar */}
            <Sentry.ErrorBoundary>
              <AppSidebar className="!block w-64 bg-gray-800 text-white" />
            </Sentry.ErrorBoundary>
            <div className="flex flex-1 flex-col w-full">
              <Header />

              {/* Main Outlet Content */}
              <Sentry.ErrorBoundary fallback={ErrorFallback}>
                <div className="flex-1 w-full overflow-y-auto p-4">
                  <Outlet />
                  <CommandDialog />
                  <KeyboardShortcutHandler />
                </div>
              </Sentry.ErrorBoundary>
            </div>
          </CommandProvider>
        </NotificationProvider>
      </TitleProvider>

      {/* TanStack Router DevTools */}
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}
