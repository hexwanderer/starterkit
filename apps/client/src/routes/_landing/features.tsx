import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/features")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_landing/features"!</div>;
}
