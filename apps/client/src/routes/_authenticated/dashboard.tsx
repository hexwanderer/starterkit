import { Combobox, ComboboxOption } from "@/components/combobox";
import { Title } from "@/components/header";
import { authClient } from "@/main";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const activeOrg = authClient.useActiveOrganization();
  const [singleValue, setSingleValue] = useState<string | undefined>(undefined);
  const [multiValue, setMultiValue] = useState<string[] | undefined>(undefined);

  return (
    <>
      <Title>{activeOrg.data?.name}</Title>
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
