import { TeamCreatePage } from "@/features/settings/organization/components/team-create";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/organizations/$organizationId/teams/create",
)({
  component: TeamCreatePage,
});
