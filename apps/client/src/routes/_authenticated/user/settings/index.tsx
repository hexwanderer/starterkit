import { UserSettingsPage } from "@/features/settings/user/components/page";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/_authenticated/user/settings/")({
  component: RouteComponent,
  validateSearch: z.object({
    tab: z.string().optional(),
  }),
});

function RouteComponent() {
  const { tab } = Route.useSearch();
  return <UserSettingsPage initialTab={tab} />;
}
