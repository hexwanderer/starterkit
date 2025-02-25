import { SignState } from "@/features/auth/components/sign-state";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const session = await context.authClient.getSession();
    if (
      session.data &&
      session.data.session.expiresAt.getTime() > new Date().getTime()
    ) {
      throw redirect({
        to: "/auth/orgs",
      });
    }
  },
});

function RouteComponent() {
  return <SignState />;
}
