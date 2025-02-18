import { ResourceList } from "@/features/resource/components/resource-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/resources/")({
  component: ResourceList,
});
