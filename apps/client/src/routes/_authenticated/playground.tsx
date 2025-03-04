import { Title } from "@/components/header";
import { PageCommands } from "@/features/command/hooks/command-provider";
import { useTRPC } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/playground")({
  component: RouteComponent,
});

function RouteComponent() {
  const trpc = useTRPC();
  const m = useMutation(
    trpc.testMutation.mutationOptions({
      onSuccess: () => {
        console.log("success");
      },
    }),
  );

  const commands = useMemo(
    () => [
      {
        id: "test-server",
        name: "Test Server",
        description: "This is a test command",
        shortcut: ["Ctrl", "T"],
        callback: () => {
          m.mutate({ time: new Date() });
        },
      },
    ],
    [m],
  );

  return (
    <>
      <Title>Playground</Title>
      <PageCommands commands={commands} />
    </>
  );
}
