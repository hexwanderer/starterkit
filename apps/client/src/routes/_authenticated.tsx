import { AppSidebar } from "@/components/sidebar";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
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
  const { isMobile } = useSidebar();
  return (
    <div className="flex flex-grow h-screen w-full">
      {/* Sidebar */}
      <AppSidebar className="hidden lg:block w-64 bg-gray-800 text-white" />

      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full">
        {/* Sidebar Trigger */}
        <div className={`fixed bottom-4 left-4 ${isMobile ? "" : "hidden"}`}>
          <SidebarTrigger />
        </div>

        {/* Main Outlet Content */}
        <div className="flex-1 w-full overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>

      {/* TanStack Router DevTools */}
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </div>
  );
}
