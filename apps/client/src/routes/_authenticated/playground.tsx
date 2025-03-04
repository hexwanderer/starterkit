import { Title } from "@/components/header";
import { PageCommands } from "@/features/command/hooks/command-provider";
// import { useTRPC } from "@/main";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/main";
// import { useTRPC } from "@/main";

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
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => {
            throw new Error("Test error");
          }}
        >
          Test Error
        </Button>
      </div>
    </>
  );
}
