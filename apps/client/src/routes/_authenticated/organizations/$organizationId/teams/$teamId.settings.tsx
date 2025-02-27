import { TeamSettingsPage } from "@/features/settings/teams/components/page";
import { useTRPC } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authenticated/organizations/$organizationId/teams/$teamId/settings",
)({
  validateSearch: z.object({
    tab: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationId, teamId } = Route.useParams();
  const { tab } = Route.useSearch();
  const trpc = useTRPC();
  const teamQuery = useQuery(
    trpc.team.getById.queryOptions({
      id: teamId,
    }),
  );

  return (
    <TeamSettingsPage
      organization={{ id: organizationId }}
      team={{
        id: teamId,
        name: teamQuery.data?.name ?? "",
        slug: teamQuery.data?.slug ?? "",
      }}
      initialTab={tab}
    />
  );
}
