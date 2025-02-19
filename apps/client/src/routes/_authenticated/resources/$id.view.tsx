import { ResourceView } from "@/features/resource/components/resource-view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/resources/$id/view")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <ResourceView id={id} />;
}
