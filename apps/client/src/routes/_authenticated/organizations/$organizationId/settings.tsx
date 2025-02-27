import { OrganizationSettingsPage } from "@/features/settings/organization/components/page";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authenticated/organizations/$organizationId/settings",
)({
  loader: async ({ params, context }) => {
    if (!params.organizationId) throw new Error("No organization id provided");
    const { data, error } =
      await context.authClient.organization.getFullOrganization({
        query: {
          organizationId: params.organizationId,
        },
      });

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
    };
  },
  validateSearch: z.object({
    tab: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const { tab } = Route.useSearch();

  return <OrganizationSettingsPage organization={data} initialTab={tab} />;
}
