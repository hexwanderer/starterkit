import { ResourceList } from "@/features/resource/components/resource-list";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const resourceListSearchSchema = z.object({
  teamId: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/resources/")({
  component: RouteComponent,
  validateSearch: resourceListSearchSchema,
});

function RouteComponent() {
  const { teamId } = Route.useSearch();
  return <ResourceList teamId={teamId} />;
}
