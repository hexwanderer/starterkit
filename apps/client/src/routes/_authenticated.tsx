import { Header, TitleProvider } from "@/components/header";
import { AppSidebar } from "@/components/sidebar";
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
          {/* Sidebar */}
          <AppSidebar className="!block w-64 bg-gray-800 text-white" />
          <div className="flex flex-1 flex-col w-full">
            <Header />
            {/* Sidebar Trigger */}
            {/* <div className={`fixed bottom-4 left-4 ${isMobile ? "" : "hidden"}`}>
          <SidebarTrigger />
        </div> */}

            {/* Main Outlet Content */}
            <div className="flex-1 w-full overflow-y-auto p-4">
              <Outlet />
            </div>
          </div>
        </NotificationProvider>
      </TitleProvider>

      {/* TanStack Router DevTools */}
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}
