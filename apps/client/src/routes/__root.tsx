import type { AuthContextType } from "@/features/auth/hooks/use-auth";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<AuthContextType>()({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
