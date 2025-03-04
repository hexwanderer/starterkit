import { ResourceCreatePage } from "@/features/resource/components/resource-create";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/resources/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  if (id === ":new") {
    return <ResourceCreatePage />;
  }
  return <ResourceCreatePage id={id} />;
}
