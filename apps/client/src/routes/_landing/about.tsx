import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>About Us</div>;
}
