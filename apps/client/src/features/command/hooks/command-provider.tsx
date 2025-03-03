import { createContext, type ReactNode, useContext, useEffect } from "react";
import { useCommandStore, type CommandAction } from "../stores/command-store";

interface CommandContextType {
  registerAction: (action: CommandAction) => void;
  unregisterAction: (id: string) => void;
  registerActions: (actions: CommandAction[]) => void;
  unregisterActions: (ids: string[]) => void;
  openCommand: () => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export function CommandProvider({ children }: { children: ReactNode }) {
  const {
    registerAction,
    unregisterAction,
    registerActions,
    unregisterActions,
    openCommand,
  } = useCommandStore();

  return (
    <CommandContext.Provider
      value={{
        registerAction,
        unregisterAction,
        registerActions,
        unregisterActions,
        openCommand,
      }}
    >
      {children}
    </CommandContext.Provider>
  );
}

export function useCommand() {
  const context = useContext(CommandContext);
  if (context === undefined) {
    throw new Error("useCommand must be used within a CommandProvider");
  }
  return context;
}

export function PageCommands({ commands }: { commands: CommandAction[] }) {
  const { registerActions, unregisterActions } = useCommand();

  // Register commands on mount, unregister on unmount
  useEffect(() => {
    const commandIds = commands.map((cmd) => cmd.id);
    registerActions(commands);

    return () => {
      unregisterActions(commandIds);
    };
  }, [commands, registerActions, unregisterActions]);

  // Render nothing, just updates the command store
  return null;
}

export function CommandButton({ className }: { className?: string }) {
  const { openCommand } = useCommand();

  return (
    // biome-ignore lint/a11y/useButtonType: <explanation>
    <button onClick={openCommand} className={className}>
      <kbd className="px-2 py-1 text-xs font-semibold text-muted-foreground bg-muted rounded border border-border">
        ⌘K
      </kbd>
    </button>
  );
}
