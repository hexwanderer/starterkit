import { TeamSettingsPage } from "@/features/settings/teams/components/page";
import { useTRPC } from "@/main";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authenticated/organizations/$organizationSlug/teams/$teamSlug/settings",
)({
  validateSearch: z.object({
    tab: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { organizationSlug, teamSlug } = Route.useParams();
  const { tab } = Route.useSearch();
  const trpc = useTRPC();
  const teamQuery = useQuery(
    trpc.team.getBySlug.queryOptions({
      slug: teamSlug,
      organizationSlug: organizationSlug,
    }),
  );

  return (
    <TeamSettingsPage
      organization={{ slug: organizationSlug }}
      team={{
        id: teamQuery.data?.id ?? "",
        name: teamQuery.data?.name ?? "",
        slug: teamSlug,
      }}
      initialTab={tab}
    />
  );
}
