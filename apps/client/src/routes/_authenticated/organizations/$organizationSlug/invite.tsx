import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/organizations/$organizationSlug/invite",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Hello "/_authenticated/organizations/$organizationSlug/invite"!</div>
  );
}
