import { SignState } from "@/features/auth/components/sign-state";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignState />;
}
