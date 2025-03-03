import React, { useEffect } from "react";
import {
  CommandDialog as ShadcnCommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  Command,
} from "@/components/ui/command";
import { useCommandStore, type CommandAction } from "../stores/command-store";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function CommandDialog() {
  const { open, actions, closeCommand } = useCommandStore();

  // Group actions by category
  const categorizedActions = actions.reduce<Record<string, CommandAction[]>>(
    (acc, action) => {
      const category = action.category || "General";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(action);
      return acc;
    },
    {},
  );

  // Global keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        useCommandStore.getState().toggleCommand();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Command>
      <ShadcnCommandDialog open={open} onOpenChange={closeCommand}>
        <VisuallyHidden>
          <DialogTitle>Command Palette</DialogTitle>
          <DialogDescription>Command Bar</DialogDescription>
        </VisuallyHidden>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {Object.entries(categorizedActions).map(
            ([category, categoryActions]) => (
              <React.Fragment key={category}>
                <CommandGroup heading={category}>
                  {categoryActions.map((action) => (
                    <CommandItem
                      key={action.id}
                      onSelect={() => {
                        action.callback();
                        closeCommand();
                      }}
                    >
                      {action.name}
                      {action.description && (
                        <span className="text-sm text-muted-foreground ml-2">
                          {action.description}
                        </span>
                      )}
                      {action.shortcut && (
                        <CommandShortcut>
                          {action.shortcut.map((key, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <React.Fragment key={index}>
                              {index > 0 && <span>+</span>}
                              <kbd>{key}</kbd>
                            </React.Fragment>
                          ))}
                        </CommandShortcut>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            ),
          )}
        </CommandList>
      </ShadcnCommandDialog>
    </Command>
  );
}
