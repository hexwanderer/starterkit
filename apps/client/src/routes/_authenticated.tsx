import { Header, TitleProvider } from "@/components/header";
import { AppSidebar } from "@/components/sidebar";
import { CommandDialog } from "@/features/command/components/command-dialog";
import { KeyboardShortcutHandler } from "@/features/command/components/keyboard-shortcut-handler";
import { CommandProvider } from "@/features/command/hooks/command-provider";
import { NotificationProvider } from "@/features/notifications/hooks/notification-provider";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { toast } from "sonner";

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
  return (
    <div className="flex flex-grow h-screen w-full">
      {/* Main Content */}
      <TitleProvider>
        <NotificationProvider>
          <CommandProvider>
            {/* Sidebar */}
            <AppSidebar className="!block w-64 bg-gray-800 text-white" />
            <div className="flex flex-1 flex-col w-full">
              <Header />

              {/* Main Outlet Content */}
              <div className="flex-1 w-full overflow-y-auto p-4">
                <Outlet />
                <CommandDialog />
                <KeyboardShortcutHandler />
              </div>
            </div>
          </CommandProvider>
        </NotificationProvider>
      </TitleProvider>

      {/* TanStack Router DevTools */}
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}
