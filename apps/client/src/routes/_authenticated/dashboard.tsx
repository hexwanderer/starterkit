import { Title } from "@/components/header";
import { PageCommands } from "@/features/command/hooks/command-provider";
import type { CommandAction } from "@/features/command/stores/command-store";
import { authClient } from "@/main";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

const commands: CommandAction[] = [
  {
    id: "test",
    name: "Test",
    description: "This is a test command",
    shortcut: ["T"],
    callback: () => toast.success("Test command executed"),
  },
];

function RouteComponent() {
  const activeOrg = authClient.useActiveOrganization();

  return (
    <>
      <Title>{activeOrg.data?.name}</Title>
      <PageCommands commands={commands} />
      <div>{`Hello! Active organziation is ${activeOrg.data?.id ?? "unknown"}`}</div>
    </>
  );
}
