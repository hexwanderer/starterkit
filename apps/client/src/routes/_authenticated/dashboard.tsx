import { authClient } from "@/main";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const activeOrg = authClient.useActiveOrganization();

  return (
    <>
      <div>{`Hello! Active organziation is ${activeOrg.data?.id ?? "unknown"}`}</div>
    </>
  );
}
