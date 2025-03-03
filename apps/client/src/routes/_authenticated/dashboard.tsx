import { Combobox, ComboboxOption } from "@/components/combobox";
import { Title } from "@/components/header";
import { Button } from "@/components/ui/button";
import { PageCommands } from "@/features/command/hooks/command-provider";
import {
  useCommandStore,
  type CommandAction,
} from "@/features/command/stores/command-store";
import { authClient } from "@/main";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  const [singleValue, setSingleValue] = useState<string | undefined>(undefined);
  const [multiValue, setMultiValue] = useState<string[] | undefined>(undefined);
  const { setDialogContent, openCommand } = useCommandStore();

  return (
    <>
      <Title>{activeOrg.data?.name}</Title>
      <PageCommands commands={commands} />
      <Button
        onClick={() => {
          setDialogContent(<div>Hello!</div>);
          openCommand();
        }}
      >
        Open Dialog
      </Button>
      <div>{`Hello! Active organziation is ${activeOrg.data?.id ?? "unknown"}`}</div>
      <Combobox
        mode="single"
        value={singleValue}
        onValueChange={setSingleValue}
        placeholder="Select a team"
      >
        <ComboboxOption value="1">Team 1</ComboboxOption>
        <ComboboxOption value="2">Team 2</ComboboxOption>
        <ComboboxOption value="3">Team 3</ComboboxOption>
      </Combobox>
      <Combobox
        mode="multiple"
        value={multiValue}
        onValueChange={setMultiValue}
        placeholder="Select multiple teams"
      >
        <ComboboxOption value="1">Team 1</ComboboxOption>
        <ComboboxOption value="2">Team 2</ComboboxOption>
        <ComboboxOption value="3">Team 3</ComboboxOption>
      </Combobox>
    </>
  );
}
