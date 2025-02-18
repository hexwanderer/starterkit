import { OrganizationSelect } from "@/features/auth/components/organization-select";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/orgs")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const session = await context.authClient.getSession();
    if (!session || !session.data?.session) {
      toast.info("Please sign in or create an account to continue");
      throw redirect({
        to: "/",
      });
    }
  },
  shouldReload: false,
  gcTime: 0,
});

function RouteComponent() {
  return <OrganizationSelect />;
}
