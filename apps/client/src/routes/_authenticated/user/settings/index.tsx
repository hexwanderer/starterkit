import { UserSettingsPage } from "@/features/settings/user/components/page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/user/settings/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserSettingsPage />;
}
